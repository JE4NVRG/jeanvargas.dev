"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Verifica se o navegador suporta Service Workers
    if ("serviceWorker" in navigator) {
      // Registra o Service Worker após o carregamento da página
      window.addEventListener("load", () => {
        registerServiceWorker();
      });
    } else {
      console.log("🚫 Service Worker não suportado neste navegador");
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      console.log("🔄 Registrando Service Worker...");

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("✅ Service Worker registrado com sucesso!", registration);

      // Gerencia atualizações do Service Worker
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        console.log("🔄 Nova versão do Service Worker encontrada");

        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                console.log(
                  "🔄 Nova versão disponível! Recarregue a página para aplicar."
                );
                // Opcional: mostrar notificação para o usuário
                showUpdateNotification();
              } else {
                console.log("✅ Service Worker instalado pela primeira vez");
              }
            }
          });
        }
      });

      // Escuta mensagens do Service Worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("📨 Mensagem do Service Worker:", event.data);
      });
    } catch (error) {
      console.error("❌ Erro ao registrar Service Worker:", error);
    }
  };

  const showUpdateNotification = () => {
    // Implementação simples de notificação de atualização
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Je4nDev Portfolio", {
        body: "Nova versão disponível! Recarregue a página.",
        icon: "/favicon-32x32.png",
        badge: "/favicon-16x16.png",
      });
    }
  };

  // Função para limpar cache (útil para desenvolvimento)
  const clearCache = async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          console.log("🧹 Cache limpo com sucesso!");
          window.location.reload();
        }
      };

      navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" }, [
        messageChannel.port2,
      ]);
    }
  };

  // Expõe função para limpeza de cache globalmente (desenvolvimento)
  if (typeof window !== "undefined") {
    (
      window as typeof window & { clearJe4nDevCache?: () => Promise<void> }
    ).clearJe4nDevCache = clearCache;
  }

  return null;
}
