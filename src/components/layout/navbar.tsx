"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/i18n";

const navLinks = [
  { key: "work" as const, href: "#work" },
  { key: "about" as const, href: "#about" },
  { key: "services" as const, href: "#services" },
  { key: "stack" as const, href: "#stack" },
];

export function Navbar() {
  const { t, locale, toggleLocale } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/80 backdrop-blur-lg border-b border-white/5"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          je4n<span className="text-purple-500">dev</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {t.nav[link.key]}
            </a>
          ))}

          <div className="w-px h-4 bg-white/10" />

          <button
            onClick={toggleLocale}
            className="text-xs text-zinc-500 border border-white/10 rounded px-2 py-1 hover:border-white/20 transition-colors"
            aria-label="Toggle language"
          >
            {locale === "en" ? "EN | PT" : "PT | EN"}
          </button>

          <a
            href="#contact"
            className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            {t.nav.contact}
          </a>
        </div>

        <button
          className="md:hidden text-zinc-400"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
}
