"use client";

import { useEffect, useRef } from "react";

export function FaviconHead() {
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Evita execução múltipla
    if (isLoadedRef.current) return;
    isLoadedRef.current = true;

    // Carregamento síncrono e otimizado dos favicons
    const loadFavicons = () => {
      // Remove apenas favicons antigos, não todos os links
      const existingFavicons = document.querySelectorAll(
        'link[rel*="icon"], link[rel="apple-touch-icon"]'
      );
      existingFavicons.forEach((icon) => icon.remove());

      // Configurações dos favicons otimizadas
      const faviconConfigs = [
        {
          rel: "icon",
          href: "/favicon.ico",
          sizes: "any",
          type: "image/x-icon",
        },
        {
          rel: "icon",
          href: "/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
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
          type: "image/png",
        },
      ];

      // Cria um fragment para inserção em batch (mais performance)
      const fragment = document.createDocumentFragment();

      faviconConfigs.forEach((config) => {
        const link = document.createElement("link");
        Object.entries(config).forEach(([key, value]) => {
          link.setAttribute(key, value);
        });

        // Adiciona cache-busting apenas na primeira carga
        if (!sessionStorage.getItem("favicon-loaded")) {
          const href = link.getAttribute("href");
          link.setAttribute("href", `${href}?v=${Date.now()}`);
        }

        fragment.appendChild(link);
      });

      // Inserção em batch para melhor performance
      document.head.appendChild(fragment);

      // Marca como carregado na sessão atual
      sessionStorage.setItem("favicon-loaded", "true");
    };

    // Executa imediatamente se o DOM está pronto
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadFavicons);
    } else {
      loadFavicons();
    }

    // Cleanup
    return () => {
      document.removeEventListener("DOMContentLoaded", loadFavicons);
    };
  }, []);

  return null;
}
