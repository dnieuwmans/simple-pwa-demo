import { IProduct } from "src/Pages/ProductsOverview/ProductsOverview"

interface IProps {
    product: IProduct;
}

export default function SingleProductDetails(props: IProps) {
    const { image, name, price, description } = props.product;

    return (
        <div className='product-details'>
            <div className='product-details__image'>
                <img src={image} />
            </div>

            <div className='product-details-content'>
                <h5 className='product-details-content__heading'>
                    <span>{name}</span>
                    <span>€ {price}</span>
                </h5>
                <p className='sub-text'>{description}</p>
            </div>
        </div>
    )
}