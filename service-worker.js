const CACHE_NAME = 'galeri-media-v6'; // Pastikan Anda mengubah ini ke v6 atau v7 untuk pembaruan paksa
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  // Tambahkan semua ikon yang Anda definisikan di manifest.json
  '/icon-72x72.png', // Pastikan jalur ini benar jika ikon Anda di root
  '/icon-96x96.png',
  '/icon-128x128.png',
  '/icon-144x144.png',
  '/icon-152x152.png',
  '/icon-192x192.png',
  '/icon-384x384.png',
  '/icon-512x512.png',
  '/public_album.html', // Pastikan juga menyertakan public_album.html jika ingin di-cache
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' // Jika ingin di-cache
];

// Event: install - Cache aset statis
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Pastikan semua URL di urlsToCache benar-benar dapat diakses
        // Jika ada yang 404 saat addAll, seluruh proses caching akan gagal
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
        // Tangani error, misal: log URL mana yang gagal
        // console.error('URLs that might have failed:', urlsToCache);
      })
  );
});

// Event: fetch - Melayani dari cache jika tersedia, jika tidak dari jaringan
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, lakukan permintaan jaringan
        return fetch(event.request).catch(() => {
          // Fallback untuk offline jika request API tidak bisa diakses
          // Anda bisa menampilkan halaman offline khusus di sini
          // Contoh: return caches.match('/offline.html');
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
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Klaim klien agar Service Worker baru segera mengambil kendali
  event.waitUntil(self.clients.claim());
});