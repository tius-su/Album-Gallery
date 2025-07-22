const CACHE_NAME = 'galeri-media-v9'; // <-- UBAH KE VERSI LEBIH BARU (misal: v9)
const urlsToCache = [
  '/', // Merujuk ke /index.html
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/public_album.html', // Pastikan ini ada di root Hosting Anda
  // Untuk debugging awal, hapus dulu ikon dan CDN dari sini.
  // Jika ini berhasil, Anda bisa menambahkannya kembali satu per satu.
  // Contoh ikon: '/icon-72x72.png',
  // Contoh CDN: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Event: install - Cache aset statis
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Opened cache. Adding URLs to cache.');
        // Pastikan semua URL di urlsToCache benar-benar dapat diakses
        // Jika ada yang 404 saat addAll, seluruh proses caching akan gagal
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Service Worker: FAILED to cache during install:', error);
        console.error('Service Worker: URLs that might have failed:', urlsToCache);
      })
  );
});

// Event: fetch - Melayani dari cache jika tersedia, jika tidak dari jaringan
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fallback untuk offline jika request API tidak bisa diakses
        });
      })
  );
});

// Event: activate - Hapus cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(self.clients.claim());
  console.log('Service Worker: Activated!');
});
