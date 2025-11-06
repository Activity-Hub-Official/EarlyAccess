// sw.js — minimal SW for local notification testing (no push backend required)

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Uncomment for real Web Push payloads later:
// self.addEventListener('push', (event) => {
//   const data = event.data ? event.data.json() : {};
//   const title = data.title || 'Activity Hub';
//   const body  = data.body  || 'You have a new update.';
//   const icon  = data.icon  || 'assets/icons/icon-192.png';
//   const url   = data.url   || './';
//   event.waitUntil(
//     self.registration.showNotification(title, { body, icon, tag: 'ah-push', data: { url } })
//   );
// });

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url && client.url.startsWith(self.registration.scope)) {
          client.focus();
          if ('navigate' in client) client.navigate(targetUrl);
          return;
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
