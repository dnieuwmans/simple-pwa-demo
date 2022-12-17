const precachedCacheName = 'precached-v3';
const dynamicCacheName = 'dynamic-v1';

const staticFiles = [
    '/',
    '/index.html',
    '/assets/favicon.ico',
    '/assets/app.css',
    '/assets/reset.css',
];

export const cleanUpCaches = async () => {
    const cachKeys = await caches.keys();
    const currentCaches = [precachedCacheName, dynamicCacheName];

    const cachesToDelete = cachKeys
        .map(k => !currentCaches.includes(k) ? caches.delete(k) : null)
        .filter(Boolean);

    await Promise.all(cachesToDelete);
}

export const getIsPrecachedRequest = (event: FetchEvent) => {
    const url = new URL(event.request.url);

    const isPartOfPrecachedFiles = staticFiles
        .filter(f => f !== '/') // Every pathname contains "/"
        .includes(url.pathname);

    return isPartOfPrecachedFiles || url.pathname === '/';
}

export const cachePrecachableResources = async () => {
    const cache = await caches.open(precachedCacheName);
    await cache.addAll(staticFiles);
}

export const getPrecachedResource = async (event: FetchEvent) => {
    const cache = await caches.open(precachedCacheName);
    return await cache.match(event.request.url);
}

export const getDynamicallyCachedResource = async (event: FetchEvent) => {
    const cache = await caches.open(dynamicCacheName);
    const cachedResponse = await cache.match(event.request.url);

    if (cachedResponse) {
        return cachedResponse;
    }

    const fetchedResponse = await fetch(event.request);
    cache.put(event.request, fetchedResponse.clone()); // Cloning is needed or the call would fail.

    return fetchedResponse;
}
