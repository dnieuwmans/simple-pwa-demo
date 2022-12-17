import { useSetAtom } from "jotai";
import { removeItem, writeItem } from "src/ServiceWorkers/core";
import { useSnackbar } from "../Snackbar";
import { IShoppingCartItem, shoppingCartItemsAtom } from "./ShoppingCart";

interface IProps {
    item: IShoppingCartItem;
}

export default function ShoppingCartItem(props: IProps) {
    const { item } = props;
    const { id: productId, image, name, description, price } = item.product;

    const setShoppingCart = useSetAtom(shoppingCartItemsAtom);
    const { showSnackbar } = useSnackbar();

    async function addOrUpdateShoppingCartItemToStore(shoppingCartItem: IShoppingCartItem) {
        if ('indexedDB' in window) {
            await writeItem('shopping-cart', shoppingCartItem);
        }
    }

    async function removeShoppingCartItemFromStore(shoppingCartItemId: string) {
        if ('indexedDB' in window) {
            await removeItem('shopping-cart', shoppingCartItemId);
        }
    }

    function handleUpdateQuantity(quantityToAdd: number) {
        setShoppingCart(prevState => {
            const currentShoppingCartItem = prevState.find(p => p.product.id === productId);
            const updatedShoppingCartItem: IShoppingCartItem = { ...currentShoppingCartItem, quantity: currentShoppingCartItem.quantity + quantityToAdd }

            if (updatedShoppingCartItem.quantity === 0) {
                removeShoppingCartItemFromStore(currentShoppingCartItem.id);
                showSnackbar(`${currentShoppingCartItem.product.name} removed from the shopping cart`, 'info');

                return prevState.filter(p => p.product.id !== productId)
            } else {

                addOrUpdateShoppingCartItemToStore(updatedShoppingCartItem);
                return prevState.map((p): IShoppingCartItem => p.product.id === productId ? updatedShoppingCartItem : p);
            }
        })
    }

    return (
        <div className='shopping-cart-item'>
            <div className='shopping-cart-item__image'>
                <img src={image} />
            </div>
            <div className='shopping-cart-item__description'>
                <h5>{name}</h5>
                <p className='sub-text mb-1'>{description}</p>
                <h6>€ {price}</h6>
            </div>
            <div className='shopping-cart-item__quantity'>
                <div className='quantity-button-group'>
                    <button
                        className='button button--borderless button--circle button--sm'
                        onClick={() => handleUpdateQuantity(-1)}
                    >
                        <i className="fa-solid fa-minus"></i>
                    </button>
                    <span>{item.quantity}</span>
                    <button
                        className='button button--borderless button--circle button--sm'
                        onClick={() => handleUpdateQuantity(1)}
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}