import dayjs from "dayjs";
import { sumBy } from "lodash-es";
import numeral from "numeral";
import { IOrder } from "../OrdersOverview";

interface IProps {
    order: IOrder;
    index: number;
    lastIndexOfDraftOrders: number;
    onRemoveDraftOrder: (order: IOrder) => Promise<void>;
    onSyncDraftOrder: (order: IOrder) => Promise<void>;
}

export default function OrdersOverviewTableRow(props: IProps) {
    const { order, index, lastIndexOfDraftOrders, onSyncDraftOrder, onRemoveDraftOrder } = props;

    async function handleSyncDraftOrder() {
        await onSyncDraftOrder(order);
    }

    async function handleRemoveDraftOrder() {
        await onRemoveDraftOrder(order);
    }

    function formatPrice(price: number) {
        return numeral(price).format('0,000.00')
    }

    function getOrderRowClassName() {
        const classNames = [
            'orders-row',
            order.status === 'draft' ? 'orders-row--draft' : '',
            index === 0 ? 'orders-row--draft-first' : '',
            index === lastIndexOfDraftOrders ? 'orders-row--draft-last' : '',
        ]

        return classNames.filter(Boolean).join(' ');
    }

    return (
        <div className={getOrderRowClassName()}>
            {/* TODO: make this better */}
            <div>
                <img src={order.products[0].image} />
            </div>
            <div className='orders-row__product-name'>
                <span>{order.products[0].name}</span>
                {order.products.length > 1 && <span>+ {order.products.length - 1}</span>}
            </div>
            <div className='orders-row__price'>
                <span>€ {formatPrice(sumBy(order.products, p => p.price))}</span>
                <span>+ € {formatPrice(order.shippingCosts)} shipping costs</span>
            </div>
            <div>€ {formatPrice(sumBy(order.products, p => p.price) + order.shippingCosts)}</div>
            <div className='orders-row__actions'>
                {order.status === 'draft' &&
                    <>
                        <button className='button' onClick={handleSyncDraftOrder}>
                            <i className="fa-solid fa-rotate"></i>
                            <span>Sync</span>
                        </button>
                        <button className='button' onClick={handleRemoveDraftOrder}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </>
                }
            </div>
            <div className='orders-row__date'>
                {dayjs(order.orderedAt).fromNow()}
            </div>
        </div>
    )
}