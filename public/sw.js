// Service Worker para cache eficiente - Je4nDev Portfolio
const CACHE_NAME = "je4ndev-v1.0";
const STATIC_CACHE_NAME = "je4ndev-static-v1.0";

// Recursos críticos para cache imediato
const CRITICAL_RESOURCES = [
  "/",
  "/favicon.ico",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/site.webmanifest",
];

// Recursos estáticos para cache
const STATIC_RESOURCES = [
  "/next.svg",
  "/vercel.svg",
  "/globe.svg",
  "/file.svg",
  "/window.svg",
  "/profile-placeholder.svg",
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker instalando...");

  event.waitUntil(
    Promise.all([
      // Cache crítico (favicons)
      caches.open(CACHE_NAME).then((cache) => {
        console.log("📦 Cachando recursos críticos...");
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      // Cache estático
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("📁 Cachando recursos estáticos...");
        return cache.addAll(STATIC_RESOURCES);
      }),
    ]).then(() => {
      console.log("✅ Service Worker instalado com sucesso!");
      return self.skipWaiting();
    })
  );
});

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker ativando...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Remove caches antigos
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log("🗑️ Removendo cache antigo:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("✅ Service Worker ativado!");
        return self.clients.claim();
      })
  );
});

// Interceptação de requisições
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Estratégia Cache First para favicons e recursos estáticos
  if (isFaviconOrStatic(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log("📦 Servindo do cache:", url.pathname);
          return response;
        }

        // Se não estiver no cache, busca na rede e adiciona ao cache
        return fetch(event.request).then((response) => {
          // Verifica se a resposta é válida
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clona a resposta para o cache
          const responseToCache = response.clone();
          const cacheName = isFavicon(url.pathname)
            ? CACHE_NAME
            : STATIC_CACHE_NAME;

          caches.open(cacheName).then((cache) => {
            cache.put(event.request, responseToCache);
            console.log("💾 Adicionado ao cache:", url.pathname);
          });

          return response;
        });
      })
    );
  }
  // Estratégia Network First para outras requisições
  else {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});

// Funções auxiliares
function isFavicon(pathname) {
  return (
    pathname.includes("favicon") ||
    pathname.includes("apple-touch-icon") ||
    pathname.includes("android-chrome") ||
    pathname === "/site.webmanifest"
  );
}

function isFaviconOrStatic(pathname) {
  return (
    isFavicon(pathname) ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".webp")
  );
}

// Limpeza periódica do cache
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              return caches.delete(cacheName);
            })
          );
        })
        .then(() => {
          console.log("🧹 Cache limpo!");
          event.ports[0].postMessage({ success: true });
        })
    );
  }
});
