"use client";

import Link from "next/link";
import { Je4nDevSignature } from "@/components/brand/je4ndev-signature";
import { COMPANY } from "@/data/company";
import { useTranslation } from "@/i18n";

export function Footer() {
  const { t, locale } = useTranslation();

  return (
    <footer className="border-t border-white/[0.06] bg-[#050505]">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-14">
        <Je4nDevSignature createdBy={t.footer.createdBy} />

        <nav
          aria-label="Legal"
          className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] text-zinc-400"
        >
          <a className="transition-colors hover:text-zinc-300" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
          <a className="transition-colors hover:text-zinc-300" href={COMPANY.whatsappUrl}>
            WhatsApp
          </a>
          <Link className="transition-colors hover:text-zinc-300" href={`/${locale}/termos`}>
            {t.footer.terms}
          </Link>
          <Link className="transition-colors hover:text-zinc-300" href={`/${locale}/privacidade`}>
            {t.footer.privacy}
          </Link>
        </nav>

        <p className="mt-4 text-center text-[11px] leading-5 text-zinc-400">
          {COMPANY.legalName}
          <span className="mx-2 text-zinc-700">·</span>
          {`CNPJ ${COMPANY.cnpj}`}
        </p>
      </div>
    </footer>
  );
}
