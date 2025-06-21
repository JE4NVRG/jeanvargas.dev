"use client";

import { useEffect, useRef } from "react";

export function FaviconHead() {
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Evita execução múltipla
    if (isLoadedRef.current) return;
    isLoadedRef.current = true;

    // Força favicon personalizado sobre o da Vercel
    const forceFavicon = () => {
      // Remove favicons existentes da Vercel
      const existingFavicons = document.querySelectorAll(
        'link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="shortcut"]'
      );
      existingFavicons.forEach((icon) => icon.remove());

      // Configuração simplificada para Vercel
      const faviconConfigs = [
        {
          rel: "shortcut icon",
          href: "/favicon.ico",
          type: "image/x-icon",
        },
        {
          rel: "icon",
          href: "/favicon.ico",
          type: "image/x-icon",
        },
        {
          rel: "icon",
          href: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
        },
      ];

      // Inserção imediata no head
      faviconConfigs.forEach((config) => {
        const link = document.createElement("link");
        Object.entries(config).forEach(([key, value]) => {
          link.setAttribute(key, value);
        });
        document.head.appendChild(link);
      });

      // Força atualização do favicon na aba
      setTimeout(() => {
        const links = document.querySelectorAll('link[rel*="icon"]');
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href) {
            link.setAttribute("href", href + "?v=" + Date.now());
          }
        });
      }, 100);
    };

    // Executa quando DOM estiver pronto
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", forceFavicon);
    } else {
      forceFavicon();
    }

    // Cleanup
    return () => {
      document.removeEventListener("DOMContentLoaded", forceFavicon);
    };
  }, []);

  return null;
}
