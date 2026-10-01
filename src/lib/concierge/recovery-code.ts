/** Browser-safe guard: recovery credentials belong only in the dedicated memory form. */
export const containsRecoveryCode = (text: string) => /NORA-[A-Za-z0-9_-]{43}/i.test(text);
