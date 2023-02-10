const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", event => {
    event.waitUntil(caches.open("sw-store"));
});

sw.addEventListener("fetch", event => {
    const { method } = event.request;

    if ( method !== "GET" ) return;

    event.respondWith(
        (async () => {
            const cache = await caches.open("sw-store");
            const { request } = event;
            const { method, headers, keepalive, url } = request;
            const { protocol } = new URL(url);
            let response: Response;

            try {
                const nowResponse = await fetch(request, { method, headers, keepalive });
                if ( !/^chrome\-extension/i.test(protocol) && nowResponse.status < 400 ) {
                    await cache.put(request, nowResponse.clone());
                }
                response = nowResponse;
            } catch (error) {
                let cachedResponse = await cache.match(request);

                if ( cachedResponse ) {
                    response = cachedResponse;
                } else {
                    const e = error as Error;
                    response = new Response(e.name, {
                        status: 500,
                        statusText: e.name
                    });
                }
            }

            return response;
        })()
    )
});