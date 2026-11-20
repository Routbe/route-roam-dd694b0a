import { createFileRoute } from "@tanstack/react-router";
import { PalaceProposal } from "@/components/proposal/PalaceProposal";

export const Route = createFileRoute("/docs/proposal-palais")({
  head: () => ({
    meta: [
      { title: "Adviesnota Datasoevereiniteit — Koninklijk Paleis | ROUT" },
      { name: "description", content: "Officiële adviesbrief en dossier over soevereine digitale communicatie-infrastructuur voor het Koninklijk Paleis van België." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Adviesnota Datasoevereiniteit — Koninklijk Paleis" },
      { property: "og:description", content: "Soevereine digitale voordeur via bio.monarchie.be: brief en technisch dossier van ROUT." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PalaceProposal,
});
