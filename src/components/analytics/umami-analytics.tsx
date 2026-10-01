import { UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } from "@/lib/analytics/umami";

// Tag de tracking do Umami self-hosted da JE4NDEV. `defer` mantém o
// carregamento fora do caminho crítico e a origem é externa (a instância roda
// em outro host), logo nenhum bloqueio de render. O Umami não usa cookies nem
// coleta dados pessoais, então não exige banner de consentimento.
export function UmamiAnalytics() {
  return <script defer src={UMAMI_SCRIPT_URL} data-website-id={UMAMI_WEBSITE_ID} />;
}
