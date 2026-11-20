import { VERIFIED_MARK } from "@/lib/verified-mark";
import "./palace-print.css";

function Rosette({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="Geverifieerd" role="img">
      <path d={VERIFIED_MARK.outline} fill="#1d9bf0" />
      <path d="m9 12 2 2 4-4" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="pp-sub">
      <h3><span className="pp-num">{n}</span> {title}</h3>
      {children}
    </section>
  );
}

export function PalaceProposal() {
  return (
    <div className="pp-root">
      <div className="pp-toolbar no-print">
        <span>Adviesnota • ROUT-PALACE-2026-EAA</span>
        <button type="button" onClick={() => window.print()}>Exporteer Officieel Dossier (A4 PDF)</button>
      </div>

      {/* PAGINA 1 — BRIEF */}
      <article className="pp-page pp-break">
        <header className="pp-letterhead">
          <div className="pp-sender">
            <strong>Jona Zeno Delplanche</strong>
            <span>Steward &amp; Lead Architect — ROUT Sovereign Identity OS</span>
            <span>1000 Brussel, België</span>
            <span>E-mail: hallo@rout.be | Web: https://rout.be/jdelplanche</span>
          </div>
          <div className="pp-recipient">
            <span>Het Koninklijk Paleis van België</span>
            <span>t.a.v. Mevrouw Solène Lévêque</span>
            <span>Communicatiedienst / Direction de la Communication</span>
            <span>Brederodestraat 16</span>
            <span>1000 Brussel</span>
          </div>
        </header>
        <dl className="pp-meta">
          <div><dt>Referentie</dt><dd>ROUT-PALACE-2026-EAA</dd></div>
          <div><dt>Datum</dt><dd>Brussel, 20 november 2026</dd></div>
          <div><dt>Betreft</dt><dd>Adviesnota &amp; Dossier Datasoevereiniteit: Soevereine Digitale Communicatie-infrastructuur voor het Koninklijk Paleis</dd></div>
        </dl>
        <div className="pp-body">
          <p>Geachte Mevrouw Lévêque,</p>
          <p>Met de grootste eerbied richt ik mij tot u en tot de Communicatiedienst van het Koninklijk Paleis. Als Belgische student die dankzij een studiebeurs zijn opleiding kan volgen, voel ik een diepe dankbaarheid tegenover de gemeenschap die dat mogelijk maakt. Vanuit Brussel wil ik iets teruggeven: kennis en werk ten dienste van het algemeen belang.</p>
          <p>Vandaag verwijzen vele officiële accounts op sociale media naar externe tussenpagina’s. Die ‘digitale voordeur’ staat doorgaans op Amerikaanse infrastructuur en valt daarmee onder wetgeving als de US CLOUD Act en FISA sectie 702. Elke Belgische burger die op zo’n link klikt, laat sporen achter buiten de Europese rechtsorde.</p>
          <p>Ik stel daarom eerbiedig voor een eigen, soevereine voordeur te voorzien op een geïsoleerd subdomein, bijvoorbeeld <strong>bio.monarchie.be</strong>. Dat kan op twee volledig kosteloze manieren: <em>beheerd</em> door ROUT op Europese infrastructuur, of <em>zelf gehost</em> op eigen servers van het Paleis met de openbare broncode (AGPL-3.0). Het bijgevoegde dossier licht beide opties technisch en strategisch toe.</p>
          <p>Ik blijf graag ter beschikking voor een toelichting, ter plaatse in Brussel.</p>
          <p>Met de meeste hoogachting,</p>
        </div>
        <div className="pp-signature">
          <div className="pp-signname"><strong>Jona Zeno Delplanche</strong> <Rosette size={18} /></div>
          <span>Steward &amp; Lead Architect — ROUT Sovereign Identity OS</span>
          <span className="pp-key">Verificatie: handtekeningsleutel gepubliceerd op https://rout.be/api/badge/key (Ed25519)</span>
        </div>
      </article>

      {/* PAGINA 2 */}
      <article className="pp-page pp-break">
        <h2><span className="pp-num">II</span> De ‘Digitale Voordeur’ &amp; subdomein-isolatie</h2>
        <Section n="II.1" title="Het risico van externe tussen-links">
          <p>Diensten als Linktree of Bitly registreren bij elke klik IP-adres, toestel, verwijzende pagina en tijdstip. Die gegevens worden verwerkt door ondernemingen die onder Amerikaanse jurisdictie vallen. Voor een instelling met de symbolische draagwijdte van het Paleis betekent dit dat burgers onbewust worden geprofileerd zodra zij officiële informatie zoeken.</p>
          <p>ROUT verwerkt geen trackers, geen advertentiepixels en geen derde-partij-scripts; profielafbeeldingen van externe netwerken lopen via een privacy-proxy zodat het IP-adres van de bezoeker nooit bij die netwerken terechtkomt.</p>
        </Section>
        <Section n="II.2" title="Technische isolatie via CNAME">
          <p>Een subdomein zoals <strong>bio.monarchie.be</strong> wordt met één DNS-record (CNAME) naar de voordeur verwezen. De hoofdsite <strong>monarchie.be</strong> blijft volledig gescheiden: andere servers, andere certificaten, geen gedeelde cookies of sessies. Een storing of incident op het subdomein kan de hoofdserver dus niet raken, en het Paleis kan het record op elk moment eenzijdig intrekken.</p>
        </Section>
        <Section n="II.3" title="Level of Assurance: eIDAS 2.0 EAA & Corporate Verified">
          <p>De pagina toont een cryptografisch ondertekend verificatiezegel. Op basis van eIDAS 2.0 kan dit worden aangevuld met een Electronic Attestation of Attributes (EAA), zodat elke bezoeker zelf kan controleren dat de pagina werkelijk namens het Koninklijk Paleis spreekt — en niet namens een nabootser.</p>
        </Section>
      </article>

      {/* PAGINA 3 */}
      <article className="pp-page pp-break">
        <h2><span className="pp-num">III</span> Audit, open-source &amp; duurzaam kostenmodel</h2>
        <Section n="III.1" title="Openbare code & GitHub-audit">
          <p>De volledige broncode is openbaar en controleerbaar: <strong>https://github.com/Routbe/route-roam-c9696c01.git</strong>. De diensten van het Paleis, of een onafhankelijke auditeur naar keuze, kunnen elke regel nalezen voordat een beslissing wordt genomen.</p>
        </Section>
        <Section n="III.2" title="Infrastructuur: 100% Europees en Zwitsers">
          <p>Hosting en opslag gebeuren uitsluitend bij Europese en Zwitserse aanbieders (Infomaniak, Scaleway EU). Er wordt geen Amerikaanse cloud gebruikt voor de verwerking of opslag van gegevens.</p>
        </Section>
        <Section n="III.3" title="Transparant kostenmodel">
          <p>Alle basisfuncties zijn en blijven gratis. Enkel voor zware foto-opslag geldt een symbolische drempel, uitsluitend om misbruik te voorkomen. Voor het Paleis worden beide opties — beheerd of zelf gehost — kosteloos aangeboden.</p>
        </Section>
      </article>

      {/* PAGINA 4 */}
      <article className="pp-page">
        <h2><span className="pp-num">IV</span> Decentraal kanaaloverzicht &amp; hofleveranciers-visie</h2>
        <Section n="IV.1" title="Modernisering van communicatie">
          <p>Naast de traditionele netwerken kan de voordeur soevereine en decentrale kanalen tonen — Mastodon, Bluesky, Eyou en Wsocial — zodat burgers zelf kiezen via welk platform zij het Paleis volgen, zonder afhankelijk te zijn van één commercieel netwerk.</p>
        </Section>
        <Section n="IV.2" title="Het nationale hefboomeffect">
          <p>Wanneer het Koninklijk Paleis kiest voor een soevereine digitale voordeur, zet het de toon. Openbare omroepen zoals de VRT, universiteiten en Belgische steden krijgen een helder en navolgbaar voorbeeld van digitale autonomie binnen de Europese rechtsorde.</p>
        </Section>
        <Section n="IV.3" title="Aanbod tot kosteloze begeleiding vanuit Brussel">
          <p>Ik bied aan de installatie, de verificatie en de overdracht persoonlijk en kosteloos te begeleiden, ter plaatse vanuit 1000 Brussel, in het Nederlands of het Frans.</p>
        </Section>
        <div className="pp-closing"><Rosette size={16} /> <span>ROUT Sovereign Identity OS • AGPL-3.0</span></div>
      </article>
    </div>
  );
}
