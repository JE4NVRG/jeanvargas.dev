const MARK_HREF = "https://je4ndev.com";
const GITHUB_HREF = "https://github.com/JE4NVRG";

export function Je4nDevSignature({
  createdBy = "Criado por",
  className = "",
}: {
  createdBy?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <a
        href={GITHUB_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub JE4NDEV"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d8c098]/25 text-[#d8c098] transition-colors hover:border-[#d8c098]/55 hover:bg-[#d8c098]/10"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .3A12 12 0 0 0 8.2 23.7c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
        </svg>
      </a>
      <p className="text-sm text-zinc-400">
        {createdBy}{" "}
        <a
          href={MARK_HREF}
          className="font-medium text-[#d8c098] transition-colors hover:text-[#ead7b4]"
        >
          Je4nDev
        </a>
      </p>
    </div>
  );
}
