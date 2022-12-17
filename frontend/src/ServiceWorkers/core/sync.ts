import { clearAllItems, readAllItems } from "./apiStore";
import { showNotification } from "./notifications";

export enum SyncTagsEnum {
    SyncNewOrder = 'sync-new-order',
    NewOrder = 'new-order',
}

const sw = self as (ServiceWorkerGlobalScope & typeof globalThis);

export const syncNewOrder = async () => {
    try {
        const queuedNewOrders = await readAllItems('sync-new-orders');

        // TODO: fix interface
        const syncOrder = async (order: any) => {
            return fetch('http://localhost:8081/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...order,
                    status: 'synced',
                }),
            })
        };

        await Promise.all(queuedNewOrders.map(syncOrder))
        await clearAllItems('sync-new-orders');

        if (queuedNewOrders.some(o => o.sendNotification)) {
            await showNotification(sw.registration, {
                title: `${queuedNewOrders.length} new order(s) are now synchronized`,
                body: 'You placed a few orders while you were offline; these orders are now synchronized.',
                tag: 'order-confirmation',
            });
        }
    } catch (error) {
        console.error(error);
    }
}

export const sendNewOrderNotification = async () => {
    // This is only for demo purposes, and only works with the app or website open.
    // For real world applications, you should use something like firebase in combination with a background service within an API or so.

    const intervalSeconds = 10;

    const checkForSync = () => {
        setTimeout(async () => {
            const queuedNewOrders = await readAllItems('new-orders');

            if (queuedNewOrders.length > 0) {
                await showNotification(sw.registration, {
                    title: `${queuedNewOrders.length} new order(s) are now ready to be synchronized`,
                    body: 'You placed a few orders while you were offline; these orders are now ready to be synchronized.',
                    tag: 'order-confirmation',
                });

                checkForSync();
            }
        }, 1000 * intervalSeconds);
    }

    checkForSync();
}