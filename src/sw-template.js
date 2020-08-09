if ('function' === typeof importScripts) {
    importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
    
    /* global workbox */
    if (workbox) {
        console.log('Workbox is loaded');
   
        /* injection point for manifest files.  */
        workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
   
        self.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SKIP_WAITING') {
                self.skipWaiting();
            }
        });

        workbox.core.clientsClaim();

        /**
         * The workboxSW.precacheAndRoute() method efficiently caches and responds to
         * requests for URLs in the manifest.
         * See https://goo.gl/S9QRab
         */
        self.__precacheManifest = [].concat(self.__precacheManifest || []);
        workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

        workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"), {
            blacklist: [/^\/_/,/\/[^\/?]+\.[^\/]+$/],
        });
        
        workbox.routing.registerRoute(new RegExp('^https:\/\/hn\.algolia\.com\/api\/v1\/(search?(.*)?)?'),
            new workbox.strategies.NetworkFirst({
                cacheName: 'api-cache',
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [0, 200],
                    })
                ]
            })
        );
   
    } else {
      console.log('Workbox could not be loaded. No Offline support');
    }
}