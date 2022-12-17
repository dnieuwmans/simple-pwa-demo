import { useEffect, useState } from "react";
import { Header, useSnackbar, Loader } from "src/Components";
import usePageTitle from "src/Hooks/usePageTitle";
import { readAllItems } from 'src/ServiceWorkers/core';
import { checkIsOnline } from "src/utils";
import ProductCard from "./Components/ProductCard";

export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
}

const pageTitle = 'Discover new plants';

export default function ProductsOverview() {
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);

    const { showSnackbar } = useSnackbar();

    usePageTitle(pageTitle)

    useEffect(() => {
        initialize();
    }, []);

    async function initialize() {
        try {
            setIsLoading(true);

            const isOnline = await checkIsOnline();

            if (isOnline) {
                const response = await fetch('http://localhost:8081/api/products');
                const products = await response.json();

                setProducts(Object.values(products));
            } else {
                if ('indexedDB' in window) {
                    const products = await readAllItems('products')
                    setProducts(products);

                    setIsLoading(false);
                }
            }

            setIsLoading(false);
        } catch (error) {
            showSnackbar(`Something went wrong: ${error.toString()}`, 'error');
            console.error(error);
        }
    }

    return (
        <>
            <Header>
                <div className='overview-header-content'>
                    <span className='page-header-title'>{pageTitle}</span>
                    <input className='input show-sm' style={{ width: 300 }} type='text' placeholder='Search for your favorite plant' />
                </div>
            </Header>

            {isLoading
                ? <Loader />
                : <div className='container'>
                    <h3 className='container__heading'>Our Picks</h3>

                    <div className='products-container'>
                        {products.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            }
        </>
    )
}