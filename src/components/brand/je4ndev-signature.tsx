const MARK_HREF = "https://je4ndev.com";

/**
 * Assinatura de marca do rodape: wordmark JE4NDEV em destaque,
 * com uma linha de credito pessoal opcional.
 */
export function Je4nDevSignature({
  byline,
  className = "",
}: {
  byline?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <a
        href={MARK_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="JE4NDEV — site oficial"
        className="inline-flex items-center justify-center px-3 py-1 transition-opacity hover:opacity-85"
      >
        <span className="font-sans text-[26px] font-semibold uppercase leading-none tracking-[0.32em] text-[#d8c098]">
          JE4NDEV
        </span>
      </a>
      {byline ? <p className="text-sm text-zinc-400">{byline}</p> : null}
    </div>
  );
}
