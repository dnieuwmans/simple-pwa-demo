import { orderBy, partition } from "lodash-es";
import { useEffect, useState } from "react";
import { Header, useSnackbar, Loader } from "src/Components";
import { usePageTitle } from "src/Hooks";
import OrdersOverviewTableRow from "./Components/OrdersOverviewTableRow";
import { fetchOrders, postOrder } from "../../Logic/ordersLogic";
import { removeItem } from "src/ServiceWorkers/core";

const pageTitle = 'View your orders';

export interface IOrder {
    id: string;
    products: {
        name: string;
        price: number;
        image: string;
        quantity: number;
    }[];
    shippingCosts: number;
    orderedAt: Date;
    status: 'synced' | 'draft';
    sendNotification?: boolean;
}

// const dracaena = require('src/dracaena.jpg');
// const strelitzia = require('src/strelitzia.jpg');

export default function OrdersOverview() {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState<IOrder[]>([])

    usePageTitle(pageTitle);

    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        initialize();
    }, []);

    async function initialize() {
        try {
            setIsLoading(true);

            const orders = await fetchOrders();
            setOrders(orders);

            setIsLoading(false);
        } catch (error) {
            showSnackbar(`Something went wrong: ${error.toString()}`, 'error');
            console.error(error);
        }
    }

    async function handleRemoveDraftOrder(order: IOrder) {
        try {
            await removeItem('new-orders', order.id);
            setOrders(prevState => prevState.filter(o => o.id !== order.id));
        } catch (error) {
            showSnackbar(`Something went wrong: ${error.toString()}`, 'error');
            console.error(error);
        }
    }

    async function handleSyncDraftOrder(order: IOrder) {
        try {
            await postOrder(order);
            await removeItem('new-orders', order.id);

            setOrders(prevState => prevState.map((p): IOrder => p.id === order.id
                ? ({ ...p, status: 'synced' })
                : p
            ));

            showSnackbar('Order placed! Thanks for shopping with us', 'success');
        } catch (error) {
            showSnackbar(`Something went wrong: ${error.toString()}`, 'error');
            console.error(error);
        }
    }

    const [draftOrders, syncedOrders] = partition(orders, o => o.status === 'draft');
    const sortedOrders = orderBy([...draftOrders, ...syncedOrders], o => o.orderedAt, 'desc');

    const hasDraftOrders = draftOrders.length > 0;

    // Last of type wouldn't work in this situation, so just use javascript to determine the first and last item of draftOrders.
    const lastIndexOfDraftOrders = draftOrders.length - 1;

    return (
        <>
            <Header>
                <div className='overview-header-content'>
                    <span className='page-header-title'>{pageTitle}</span>
                </div>
            </Header>

            {isLoading
                ? <Loader />
                : <div className='container'>
                    <h3>Your orders</h3>
                    <h6 className='container__heading'>{orders.length} order(s)</h6>

                    {hasDraftOrders &&
                        <div className='alert alert--warning mb-2'>
                            <i className="fa-solid fa-exclamation"></i>
                            <span>Some of your placed orders did not synced properly, due to lost connectivity. Please sync the orders if applicable.</span>
                        </div>
                    }

                    {sortedOrders.map((o, i) => (
                        <OrdersOverviewTableRow
                            index={i}
                            key={o.id}
                            lastIndexOfDraftOrders={lastIndexOfDraftOrders}
                            order={o}
                            onRemoveDraftOrder={handleRemoveDraftOrder}
                            onSyncDraftOrder={handleSyncDraftOrder}
                        />
                    ))}
                </div>
            }
        </>
    )
}