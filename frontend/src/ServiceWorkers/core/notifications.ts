const defaultIcon = '/assets/logo512.png';

type NotificationTags = 'order-confirmation' | 'notifications-enabled';

interface INotificationOptions {
    title: string;
    body: string;
    tag?: NotificationTags;
}

const sw = self as (ServiceWorkerGlobalScope & typeof globalThis);

export const showNotification = async (serviceWorkerRegistration: ServiceWorkerRegistration, options: INotificationOptions) => {
    return await serviceWorkerRegistration.showNotification(options.title, {
        body: options.body,
        icon: defaultIcon,
        tag: options.tag,
    });
}

export const openUrlAfterNotificationClick = async (event: NotificationEvent) => {
    const isOrderConfirmation = event.notification.tag === 'order-confirmation';
    const url = self.location.origin + (isOrderConfirmation ? '/orders' : '');
    
    const clients = await sw.clients.matchAll({ type: 'window', includeUncontrolled: true });

    for (const client of clients) {
        if (client instanceof WindowClient && client.url === url && 'focus' in client) {
            return client.focus();
        }
    }

    if (sw.clients.openWindow) {
        return sw.clients.openWindow(url);
    }

    return null;
}