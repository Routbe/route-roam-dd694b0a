/**
 * RFC 9449 DPoP proof verification for the OID4VCI token and credential endpoints (strict, no
 * Bearer fallback). A proof is accepted only when it is a single compact JWS with typ dpop+jwt,
 * alg ES256 or Ed25519, an embedded public jwk of the matching key type, a valid signature,
 * htm = the request method, htu = the endpoint URI, iat within 60 s, a valid server nonce, ath =
 * SHA-256 of the access token when one is presented, and a jti never seen before for that key.
 * Pure apart from the injected nonce check and replay cache; server-safe and browser-safe.
 */
import { sha256 } from "@noble/hashes/sha2.js";
import { b64uEncode } from "@/lib/support/hybrid-signature";
import { isPublicJwk, parseJws, verifyJws, type PublicJwk } from "./jose";

export const DPOP_TYP = "dpop+jwt";
export const DPOP_ALGS = ["ES256", "Ed25519"] as const;
export const DPOP_WINDOW_S = 60;
const enc = new TextEncoder();

/** RFC 7638 JWK SHA-256 thumbprint over the required members in lexicographic order. */
export function jwkThumbprint(jwk: PublicJwk): string {
  const canonical = jwk.kty === "EC" ? { crv: jwk.crv, kty: jwk.kty, x: jwk.x, y: jwk.y } : { crv: jwk.crv, kty: jwk.kty, x: jwk.x };
  return b64uEncode(sha256(enc.encode(JSON.stringify(canonical))));
}

export const accessTokenHash = (token: string) => b64uEncode(sha256(enc.encode(token)));

/** "https://host/path" without query or fragment (RFC 9449 §4.3 htu comparison). */
export function normalizeHtu(u: unknown): string | null {
  if (typeof u !== "string" || u.length > 2048) return null;
  try {
    const url = new URL(u);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return `${url.protocol}//${url.host.toLowerCase()}${url.pathname}`;
  } catch {
    return null;
  }
}

/**
 * Seen (key thumbprint, jti) pairs for the replay window. In-memory per server instance; it holds
 * an entry for twice the iat window so a proof cannot come back on either side of the clock skew.
 * Full = fail closed (the proof is refused, never let through unchecked).
 */
export class JtiReplayCache {
  private seen = new Map<string, number>();
  constructor(private readonly max = 50_000, private readonly holdMs = 2 * DPOP_WINDOW_S * 1000) {}
  /** True when the pair is new (and is now recorded); false on a replay or a full cache. */
  claim(jkt: string, jti: string, now: number): boolean {
    const key = `${jkt}\u0000${jti}`;
    const until = this.seen.get(key);
    if (until !== undefined && until > now) return false;
    if (this.seen.size >= this.max) {
      for (const [k, t] of this.seen) if (t <= now) this.seen.delete(k);
      if (this.seen.size >= this.max) return false;
    }
    this.seen.set(key, now + this.holdMs);
    return true;
  }
  get size() {
    return this.seen.size;
  }
}

export type DpopCheck = { ok: true; jkt: string; jwk: PublicJwk } | { ok: false; error: "invalid_dpop_proof" | "use_dpop_nonce" };

export async function checkDpopProof(
  header: string | null,
  opts: {
    method: string;
    htu: string;
    now: number;
    checkNonce: (nonce: unknown) => Promise<boolean>;
    replay: JtiReplayCache;
    /** The presented access token; its hash must be the proof's ath. Absent = ath must be absent too. */
    accessToken?: string;
  },
): Promise<DpopCheck> {
  const bad = { ok: false, error: "invalid_dpop_proof" } as const;
  // Exactly one DPoP header: Headers.get joins repeats with ", ", and a compact JWS has no comma.
  if (typeof header !== "string" || header.length === 0 || header.includes(",") || header.includes(" ")) return bad;
  let jws;
  try {
    jws = parseJws(header, 4096);
  } catch {
    return bad;
  }
  const { header: h, payload: p } = jws;
  const alg = h["alg"];
  const jwk = h["jwk"];
  if (h["typ"] !== DPOP_TYP || !DPOP_ALGS.includes(alg as never) || !isPublicJwk(jwk)) return bad;
  if (alg === "ES256" ? jwk.kty !== "EC" : jwk.kty !== "OKP") return bad;
  if ("kid" in h || "x5c" in h || "jku" in h || "x5u" in h) return bad;
  if (!verifyJws(alg === "Ed25519" ? "EdDSA" : "ES256", jwk, jws.signingInput, jws.signature)) return bad;

  const jti = p["jti"];
  if (typeof jti !== "string" || jti.length < 16 || jti.length > 128) return bad;
  if (p["htm"] !== opts.method.toUpperCase()) return bad;
  const htu = normalizeHtu(p["htu"]);
  if (!htu || htu !== normalizeHtu(opts.htu)) return bad;
  const iat = p["iat"];
  if (typeof iat !== "number" || !Number.isFinite(iat) || Math.abs(opts.now / 1000 - iat) > DPOP_WINDOW_S) return bad;
  if (opts.accessToken !== undefined) {
    if (typeof p["ath"] !== "string" || p["ath"] !== accessTokenHash(opts.accessToken)) return bad;
  } else if ("ath" in p) {
    return bad;
  }
  if (!(await opts.checkNonce(p["nonce"]))) return { ok: false, error: "use_dpop_nonce" };

  const jkt = jwkThumbprint(jwk);
  // Recorded last, after the signature, so unsigned junk can never fill the cache.
  if (!opts.replay.claim(jkt, jti, opts.now)) return bad;
  return { ok: true, jkt, jwk };
}
