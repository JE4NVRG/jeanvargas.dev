import Link from "next/link";
import { COMPANY } from "@/data/company";
import { getLegalDocument, type LegalSlug } from "@/data/legal";

export function LegalDocumentPage({
  locale,
  slug,
}: {
  locale: "pt" | "en";
  slug: LegalSlug;
}) {
  const doc = getLegalDocument(slug, locale);
  const otherSlug: LegalSlug = slug === "termos" ? "privacidade" : "termos";
  const other = getLegalDocument(otherSlug, locale);
  const isPt = locale === "pt";

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300/90">
        {COMPANY.brand}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {doc.title}
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-300">{doc.description}</p>
      <p className="mt-2 text-sm text-zinc-400">
        {isPt ? "Atualizado em" : "Updated"} {doc.updatedAt}
      </p>

      <div className="mt-10 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-7 text-zinc-300">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-300">
        <p>
          {COMPANY.legalName} · {COMPANY.tradeName}
        </p>
        <p className="mt-1 font-medium text-white">{`CNPJ ${COMPANY.cnpj}`}</p>
        <p className="mt-1">
          <a className="underline decoration-white/20 hover:text-white" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
          {" · "}
          <a className="underline decoration-white/20 hover:text-white" href={COMPANY.whatsappUrl}>
            WhatsApp {COMPANY.whatsappDisplay}
          </a>
        </p>
      </div>

      <p className="mt-8 text-sm text-zinc-400">
        <Link href={`/${locale}/${otherSlug}`} className="text-zinc-300 underline decoration-white/20 hover:text-white">
          {other.title}
        </Link>
        {" · "}
        <Link href={`/${locale}`} className="text-zinc-300 underline decoration-white/20 hover:text-white">
          {isPt ? "Voltar ao início" : "Back to home"}
        </Link>
      </p>
    </main>
  );
}
