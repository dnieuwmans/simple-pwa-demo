import { IShoppingCartItem } from "src/Components/ShoppingCart/ShoppingCart";
import { readAllItems } from "src/ServiceWorkers/core";
import { checkIsOnline } from "src/utils";
import { IOrder } from "../Pages/OrdersOverview/OrdersOverview";

const fetchDraftOrders = async (): Promise<IOrder[]> => {
    if ('indexedDB' in window) {
        const [sycnedNewOrders, newOrders] = await Promise.all([
            readAllItems('sync-new-orders'),
            readAllItems('new-orders'),
        ])

        return [...sycnedNewOrders, ...newOrders];
    }

    return [];
}

export const fetchOrders = async (): Promise<IOrder[]> => {
    const isOnline = await checkIsOnline();

    if (isOnline) {
        const response = await fetch('http://localhost:8081/api/orders');
        const ordersJson = await response.json();

        const orders: IOrder[] = ordersJson ? Object.values(ordersJson) : [];
        const draftOrders = await fetchDraftOrders();

        return [...orders, ...draftOrders];
    } else {
        if ('indexedDB' in window) {
            const orders = await readAllItems('orders')
            const draftOrders = await fetchDraftOrders();

            const allOrders: IOrder[] = [...orders, ...draftOrders];
            return allOrders;
        }
    }

    return [];
}

export const mapShoppingCartItemsToOrder = (shoppingCartItems: IShoppingCartItem[], sendNotification: boolean): IOrder => {
    return {
        id: `order-${new Date().getTime()}`,
        products: shoppingCartItems.map(s => ({
            quantity: s.quantity,
            image: s.product.image,
            name: s.product.name,
            price: s.product.price,
        })),
        orderedAt: new Date(),
        shippingCosts: 4.95,
        status: 'draft',
        sendNotification,
    }
}

export const postOrder = async (order: IOrder) => {
    await fetch('http://localhost:8081/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            ...order,
            status: 'synced',
        }),
    });
}
