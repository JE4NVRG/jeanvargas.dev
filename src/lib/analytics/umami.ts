// Umami self-hosted (JE4NDEV) — analytics sem cookies do site público.
//
// Os dois valores abaixo são PÚBLICOS de qualquer forma: aparecem no HTML de
// toda página pública. Por isso ficam em código (e não em env de build) — o
// build standalone do Next não recebe NEXT_PUBLIC_* do runtime.
export const UMAMI_SCRIPT_URL = "https://umami.je4ndev.com/script.js";

// Website "je4ndev-portfolio" (domínio je4ndev.com) na instância própria.
export const UMAMI_WEBSITE_ID = "57718bdd-2cfd-4a6e-97f5-443d1b0bb35b";

type UmamiTracker = {
  track: (event: string, data?: Record<string, unknown>) => void;
};

// O tracker vive em uma origem externa e pode não estar carregado (bloqueador,
// offline, script ainda baixando). Medição é best-effort: nunca pode quebrar a
// navegação do usuário — daí o optional chaining.
export function trackUmamiEvent(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const tracker = (window as unknown as { umami?: UmamiTracker }).umami;
  tracker?.track(event, data);
}
