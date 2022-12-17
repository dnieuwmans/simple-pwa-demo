import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { IProduct } from "src/Pages/ProductsOverview/ProductsOverview";
import ShoppingCartItem from "./ShoppingCartItem";
import { sum } from "lodash-es";
import * as numeral from "numeral";
import { useSnackbar } from "../Snackbar";
import { clearAllItems, readAllItems, SyncTagsEnum, writeItem } from "src/ServiceWorkers/core";
import { IOrder } from "src/Pages/OrdersOverview/OrdersOverview";
import { checkIsOnline } from "src/utils";
import { mapShoppingCartItemsToOrder, postOrder } from "src/Logic/ordersLogic";

interface IProps {
    open: boolean;
    onClose: () => void;
}

export interface IShoppingCartItem {
    id: string;
    product: IProduct;
    quantity: number;
}

export const shoppingCartItemsAtom = atom<IShoppingCartItem[]>([]);

export default function ShoppingCart(props: IProps) {
    const { open, onClose } = props;

    const [shoppingCartItems, setShoppingCartItems] = useAtom(shoppingCartItemsAtom);
    const { showSnackbar } = useSnackbar();

    const shippingCosts = 4.95;
    const subTotal = sum(shoppingCartItems.map(s => s.product.price * s.quantity));

    const pageHeaderHeight = document.querySelector('.page-header-container')?.clientHeight ?? 0;

    useEffect(() => {
        const handleClearOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        window.addEventListener('keydown', handleClearOnEscape);
        return () => window.removeEventListener('keydown', handleClearOnEscape);
    }, []);

    useEffect(() => {
        initialize();
    }, []);

    async function initialize() {
        if ('indexedDB' in window) {
            const shoppingCartItems: IShoppingCartItem[] = await readAllItems('shopping-cart');
            setShoppingCartItems(shoppingCartItems);
        }
    }

    function formatPrice(price: number) {
        return numeral(price).format('0,000.00')
    }

    function handleClose() {
        onClose();

        setTimeout(() => {
            setShoppingCartItems([]);
        }, 400);
    }

    async function clearShoppingCartItemsFromStore() {
        if ('indexedDB' in window) {
            await clearAllItems('shopping-cart');
        }
    }

    async function handlePlaceOrder() {
        const order: IOrder = mapShoppingCartItemsToOrder(shoppingCartItems, false);
        
        const isOnline = await checkIsOnline();

        if (isOnline) {
            await postOrder(order);
            showSnackbar('Order placed! Thanks for shopping with us', 'success');
        } else {
            if ('indexedDB' in window) {
                await writeItem('new-orders', order);

                const serviceWorker = await navigator.serviceWorker.ready;

                // @ts-ignore Typescript doesn't recognize sync somehow, maybe because it is experimental?
                // `sync` is a property of `ServiceWorkerRegistration`: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/sync
                await serviceWorker.sync.register(SyncTagsEnum.NewOrder);

                showSnackbar('Looks like you are offline. The order is queued for saving.', 'info');
            }
        }

        clearShoppingCartItemsFromStore();
        handleClose();
    }

    async function handlePlaceOrderWithSync() {

        const isOnline = await checkIsOnline();

        const order: IOrder = mapShoppingCartItemsToOrder(shoppingCartItems, !isOnline);

        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            const serviceWorker = await navigator.serviceWorker.ready;

            await writeItem('sync-new-orders', order);

            // @ts-ignore Typescript doesn't recognize sync somehow, maybe because it is experimental?
            // `sync` is a property of `ServiceWorkerRegistration`: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/sync
            await serviceWorker.sync.register(SyncTagsEnum.SyncNewOrder);
        } else {
            await postOrder(order);
        }

        showSnackbar('Order placed! Thanks for shopping with us', 'success');

        clearShoppingCartItemsFromStore();
        handleClose();
    }

    return (
        <div
            style={{ height: `calc(100vh - ${pageHeaderHeight}px)` }}
            className={`shopping-cart ${open ? 'shopping-cart--open' : ''}`}
        >
            <div className='shopping-cart__content'>
                {shoppingCartItems.map(s => <ShoppingCartItem key={s.id} item={s} />)}
            </div>
            <div className='shopping-cart__footer'>
                <div className='price-calculation'>
                    <div className='price-calculation__row'>
                        <b>Subtotal</b>
                        <span>€ {formatPrice(subTotal)}</span>
                    </div>
                    <div className='price-calculation__row'>
                        <b>Shipping costs</b>
                        <span>€ {formatPrice(shippingCosts)}</span>
                    </div>

                    <hr />
                    <div className='price-calculation__row'>
                        <b>Total</b>
                        <span>€ {formatPrice(subTotal + shippingCosts)}</span>
                    </div>
                </div>

                <div>
                    <button
                        className='button button--primary button--borderless button--circle button--lg'
                        // onClick={handlePlaceOrderWithSync}
                        onClick={handlePlaceOrder}
                        disabled={shoppingCartItems.length === 0}
                    >
                        <i className="fa-solid fa-bag-shopping"></i>
                        <span>Place order</span>
                    </button>
                </div>
            </div>
        </div>
    )
}