import { useSetAtom } from "jotai";
import { Link } from "react-router-dom";
import { useSnackbar } from "src/Components";
import { IShoppingCartItem, shoppingCartItemsAtom } from "src/Components/ShoppingCart/ShoppingCart";
import { writeItem } from "src/ServiceWorkers/core";
import { IProduct } from "../ProductsOverview"

interface IProps {
    product: IProduct;
}

export default function ProductCard(props: IProps) {
    const { product } = props;
    const { id: productId, name, description, price, stock, image } = product;

    const setShoppingCart = useSetAtom(shoppingCartItemsAtom);

    const { showSnackbar } = useSnackbar();

    async function addOrUpdateShoppingCartItemToStore(shoppingCartItem: IShoppingCartItem) {
        if ('indexedDB' in window) {
            await writeItem('shopping-cart', shoppingCartItem);
        }
    }

    function handleAddProductToShoppingCart() {
        setShoppingCart(prevState => {
            const existingProduct = prevState.find(p => p.id === productId);

            if (existingProduct) {
                const updatedShoppingCartItem: IShoppingCartItem = { ...existingProduct, quantity: existingProduct.quantity + 1 };

                addOrUpdateShoppingCartItemToStore(updatedShoppingCartItem);
                showSnackbar(`Added one more ${name} to the shopping cart`, 'success');

                return prevState.map((p): IShoppingCartItem => p.id === productId ? updatedShoppingCartItem: p);
            }

            const shoppingCartItem: IShoppingCartItem = { product, quantity: 1, id: productId }

            addOrUpdateShoppingCartItemToStore(shoppingCartItem);
            showSnackbar(`${name} added to the shopping cart`, 'success');
            return [...prevState, shoppingCartItem];
        })
    }

    return (
        <div className='product-card'>
            <div className='product-card__image'>
                <img src={image} />

                <Link to={`/${productId}`} className='button product-card-more-info-button'>
                    View product
                </Link>
            </div>
            <div className='product-card__details'>
                <h5 className='product-card-detail__heading'>
                    <span>{name}</span>
                    <span>€ {price}</span>
                </h5>
                <p className='sub-text'>{description}</p>

                <hr />

                <div className='product-card-details__footer'>
                    <span>{stock} left in stock</span>
                    <button
                        className='button button--primary button--borderless button--circle'
                        onClick={handleAddProductToShoppingCart}
                    >
                        <i className='fa-solid fa-plus'></i>
                        <span>Add to card</span>
                    </button>
                </div>
            </div>
        </div>
    )
}