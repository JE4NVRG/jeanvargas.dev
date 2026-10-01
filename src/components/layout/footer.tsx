"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { Je4nDevSignature } from "@/components/brand/je4ndev-signature";
import { COMPANY } from "@/data/company";
import { useTranslation } from "@/i18n";

export function Footer() {
  const { t, locale } = useTranslation();

  return (
    <footer className="border-t border-white/[0.06] bg-[#050505]">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-14">
        <Je4nDevSignature byline={t.footer.byline} />

        <a
          href={COMPANY.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={locale === "pt" ? "GitHub de Jean (abre em nova aba)" : "Jean's GitHub (opens in a new tab)"}
          data-analytics-event="portfolio-navigation-click"
          data-cta="footer-github"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-zinc-300 transition-colors hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Github size={17} aria-hidden="true" />
          GitHub <span className="text-zinc-400">@JE4NVRG</span>
        </a>

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
          <Link className="transition-colors hover:text-zinc-300" href={`/${locale}/guides`} data-analytics-event="portfolio-navigation-click" data-cta="footer-guides">
            {locale === "pt" ? "Guias" : "Guides"}
          </Link>
          <Link className="transition-colors hover:text-zinc-300" href={`/${locale}/termos`}>
            {t.footer.terms}
          </Link>
          <Link className="transition-colors hover:text-zinc-300" href={`/${locale}/privacidade`}>
            {t.footer.privacy}
          </Link>
        </nav>

        <p className="mt-4 text-center text-[11px] leading-5 text-zinc-500">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
