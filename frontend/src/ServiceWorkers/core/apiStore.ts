import { openDB } from 'idb';

type StoreNames = 'products' | 'shopping-cart' | 'orders' | 'sync-new-orders' | 'new-orders';

const apiUrlOrigin = 'http://localhost:8081';

const databasePromise = openDB('products-store', 1, {
    upgrade(db) {
        db.createObjectStore('products', { keyPath: 'id' });
        db.createObjectStore('shopping-cart', { keyPath: 'id' });
        db.createObjectStore('orders', { keyPath: 'id' });
        db.createObjectStore('sync-new-orders', { keyPath: 'id' });
        db.createObjectStore('new-orders', { keyPath: 'id' });
    },
});

const getStoreUsingUrl = (url: URL): StoreNames | undefined => {
    switch (url.pathname) {
        case '/api/products': return 'products';
        case '/api/orders': return 'orders';
        default: return undefined;
    }
}

const getDatabaseStore = async (storeName: string, transactionMode: IDBTransactionMode = 'readwrite') => {
    const database = await databasePromise;
    const transaction = database.transaction(storeName, transactionMode);

    return transaction.objectStore(storeName);
}

export const writeMultipleItems = async (storeName: StoreNames, data: any[]) => {
    const store = await getDatabaseStore(storeName);
    await Promise.all(data.map(d => store.put(d)));
}

export const writeItem = async (storeName: StoreNames, data: any) => {
    const store = await getDatabaseStore(storeName);
    await store.put(data);
}

export const readAllItems = async (storeName: StoreNames) => {
    const store = await getDatabaseStore(storeName, 'readonly');
    return await store.getAll();
}

export const removeItem = async (storeName: StoreNames, key: string) => {
    const store = await getDatabaseStore(storeName);
    store.delete(key);
}

export const clearAllItems = async (storeName: StoreNames) => {
    const store = await getDatabaseStore(storeName);
    await store.clear();
}

export const isGETRequest = (event: FetchEvent) => {
    return event.request.method === 'GET';
}

export const getIsApiRequest = (event: FetchEvent) => {
    const url = new URL(event.request.url);
    return url.origin === apiUrlOrigin && !url.pathname.includes('public/');
}

export const storeAndGetApiResponse = async (event: FetchEvent) => {
    const response = await fetch(event.request);

    const clonedResponse = response.clone();
    const jsonData = await clonedResponse.json();

    const dataToStore = [];
    for (let item in jsonData) {
        dataToStore.push(jsonData[item]);
    }

    const url = new URL(event.request.url);
    const storeName = getStoreUsingUrl(url);

    if (storeName) {
        await clearAllItems(storeName);
        await writeMultipleItems(storeName, dataToStore);
    }

    return response;
}