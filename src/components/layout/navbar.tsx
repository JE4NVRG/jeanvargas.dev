"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Braces } from "lucide-react";
import { useTranslation } from "@/i18n";

const navLinks = [
  { key: "work" as const, href: "#work" },
  { key: "about" as const, href: "#about" },
  { key: "services" as const, href: "#services" },
  { key: "stack" as const, href: "#stack" },
  { key: "contact" as const, href: "#contact" },
];

export function Navbar() {
  const { t, locale, toggleLocale } = useTranslation();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const anchorPrefix = pathname === "/" ? "" : "/";
  const resolveHref = useCallback(
    (href: string) => `${anchorPrefix}${href}`,
    [anchorPrefix],
  );

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-lg font-extrabold tracking-normal"
            onClick={closeMobile}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.06] text-cyan-300 transition-colors group-hover:border-cyan-300/40">
              <Braces className="h-4 w-4" />
            </span>
            <span>
              je4n<span className="text-purple-500">dev</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.filter(l => l.key !== "contact").map((link) => (
              <Link
                key={link.key}
                href={resolveHref(link.href)}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {t.nav[link.key]}
              </Link>
            ))}

            <div className="w-px h-4 bg-white/10" />

            <button
              onClick={toggleLocale}
              className="text-xs text-zinc-500 border border-white/10 rounded px-2 py-1 hover:border-white/20 transition-colors"
              aria-label="Toggle language"
            >
              {locale === "en" ? "EN | PT" : "PT | EN"}
            </button>

            <Link
              href={resolveHref("#contact")}
              className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              {t.nav.contact}
            </Link>
          </div>

          {/* Mobile hamburger / close */}
          <button
            className="md:hidden relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:text-white"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <div className="flex flex-col items-center justify-center gap-[5px]">
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeMobile}
            />

            {/* Menu panel */}
            <motion.div
              className="absolute top-0 right-0 h-full w-full max-w-sm bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/5 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col px-8 pt-24 pb-8 h-full">
                {/* Nav links */}
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                    >
                      <Link
                        href={resolveHref(link.href)}
                        onClick={closeMobile}
                        className="group flex items-center gap-3 rounded-xl px-4 py-4 text-lg font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
                      >
                        <span className="text-xs text-zinc-700 font-mono">
                          0{i + 1}
                        </span>
                        {t.nav[link.key]}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 h-px bg-white/[0.06]" />

                {/* Language toggle */}
                <motion.button
                  onClick={() => {
                    toggleLocale();
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-white"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs font-mono">
                    {locale === "en" ? "EN" : "PT"}
                  </span>
                  {locale === "en"
                    ? "Switch to Portuguese"
                    : "Mudar para Ingles"}
                </motion.button>

                {/* Spacer */}
                <div className="flex-1" />

                {/* CTA */}
                <motion.a
                  href="mailto:jean@je4ndev.com"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  jean@je4ndev.com
                </motion.a>

                {/* Social hint */}
                <motion.p
                  className="mt-4 text-center text-xs text-zinc-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  je4ndev.com
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
