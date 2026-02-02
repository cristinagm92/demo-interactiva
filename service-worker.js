const CACHE_NAME = "impostor-cache-v3"; // Cambia la versión cuando actualices
const ASSETS = [
  "/Impostor-Anime/",
  "/Impostor-Anime/index.html",
  "/Impostor-Anime/script.js",
  "/Impostor-Anime/styles.css",
  "/Impostor-Anime/suspense-248067.mp3",
  "/Impostor-Anime/icon-192.png",
  "/Impostor-Anime/icon-512.png"
];

// Instalar y cachear archivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Activa el SW nuevo inmediatamente
});

// Activar y borrar cachés antiguas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Controla todas las pestañas sin recargar
});

// Interceptar peticiones
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
