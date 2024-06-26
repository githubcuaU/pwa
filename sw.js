
const staticCache = "Static-cache-v1";
const dynamicCache = "Dynamic-cache-v1";

const assets = 
[
  "/",
  "/index.html",
  "/pages/fallback.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/materialize.min.css",
  "/css/app.css",
  "/img/list.jpg",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
];

// Cache size limit
const limitCacheSize = (name, size) => 
{
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", function (event) 
{
  // Fires when the browser install the app.
  // Here we're just logging the event and the contents of the object passed to the event.
  // The purpose of this event is to give the service worker a place to setup the local
  // environment after the installation completes.
  console.log(`SW: Event fired: ${event.type}`);
  event.waitUntil(
    caches.open(staticCache).then(function (cache) {
      console.log("SW: Precaching App shell");
      cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", function (event) 
{
  // Fires after the service worker completes its installation.
  // It's a place for the service worker to clean up from previous service worker versions.
  // console.log(`SW: Event fired: ${event.type}`);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCache && key !== dynamicCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", function (event) 
{
  // Fires whenever the app requests a resource (file or data).
  // Next, go get the requested resource from the network.
  // console.log(`SW: Fetching ${event.request.url}`);
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchRes) => {
            return caches.open(dynamicCache).then((cache) => {
              cache.put(event.request.url, fetchRes.clone());
              limitCacheSize(dynamicCache, 3);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => caches.match("/pages/fallback.html"))
  );
});

