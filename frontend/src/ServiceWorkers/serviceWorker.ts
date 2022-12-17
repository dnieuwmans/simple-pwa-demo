import {
    cachePrecachableResources,
    cleanUpCaches,
    getDynamicallyCachedResource,
    getIsApiRequest,
    getIsPrecachedRequest,
    getPrecachedResource,
    isGETRequest,
    openUrlAfterNotificationClick,
    sendNewOrderNotification,
    storeAndGetApiResponse,
    syncNewOrder,
    SyncTagsEnum
} from './core';

const sw = self as (ServiceWorkerGlobalScope & typeof globalThis);

sw.addEventListener('install', async (event: ExtendableEvent) => {
    event.waitUntil(cachePrecachableResources())
});

sw.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(cleanUpCaches());
});

sw.addEventListener('fetch', async (event: FetchEvent) => {
    // This will make sure that fetch calls from chrome extensions won't be handled.
    if (!event.request.url.startsWith('http')) {
        return;
    }

    const isApiRequest = getIsApiRequest(event);
    const isPrecachedRequest = getIsPrecachedRequest(event);

    // Precached files can use the cache only strategy, since it will always be cached at install time.
    // Note that if you want to deploy a new version of an app, you'll have to update the static cache version.
    if (isPrecachedRequest) {
        event.respondWith(getPrecachedResource(event));
    } else if (isApiRequest && isGETRequest(event)) {
        event.respondWith(storeAndGetApiResponse(event));
    } else if (isGETRequest(event)) {
        // This approach is cache first then falling back to the network. 
        // This would be the best option for being offline or when the request might take a long time somehow.
        event.respondWith(getDynamicallyCachedResource(event));
    } else {
        return;
    }
});

sw.addEventListener('sync', async (event: any) => {
    switch (event.tag) {
        case SyncTagsEnum.SyncNewOrder:
            event.waitUntil(syncNewOrder());
            break;
        case SyncTagsEnum.NewOrder:
            event.waitUntil(sendNewOrderNotification())
            break;
    }
});

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.waitUntil(openUrlAfterNotificationClick(event))
});
