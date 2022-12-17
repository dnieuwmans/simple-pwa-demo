import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Header, Loader, useSnackbar } from "src/Components";
import { IProduct } from "../ProductsOverview/ProductsOverview";
import SingleProductCapture from "./Components/SingleProductCapture/SingleProductCapture";
import SingleProductDetails from "./Components/SingleProductDetails";

export default function SingleProduct() {
    const { productId } = useParams<{ productId: string }>();

    const [product, setProduct] = useState<IProduct>();
    const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        initialize();
    }, []);

    async function initialize() {
        if (!productId) {
            handleNavigateBack();
        }

        try {
            const url = `http://localhost:8081/api/products/${productId}`
            const response = await fetch(url);

            const product = await response.json();
            setProduct(product);

            if (product === null) {
                handleNavigateBack();
                showSnackbar(`Product with the id of "${productId}" could not be found`, 'warning');
                return;
            }
        } catch (error) {
            showSnackbar(`Something went wrong: ${error.toString()}`, 'error');
            console.error(error);
        }
    }

    function handleNavigateBack() {
        navigate('/');
    }

    return (
        <>
            <Header
                actionButton={{
                    onClick: handleNavigateBack,
                    icon: <i className='fa-solid fa-chevron-left'></i>
                }}
            >
                <span
                    className='page-header-title'
                    style={{ width: '100%' }}
                >
                    Product details
                </span>
            </Header>

            {!product
                ? <Loader />
                : <div className='container'>
                    <SingleProductDetails product={product} />

                    <div className="product-details__footer">
                        <p>Have you recently purchased this product and given it a nice spot? We are curious about the result, please send us a picture.</p>
                        <button
                            className='button button--primary button--borderless button--circle'
                            onClick={() => setIsPhotoDialogOpen(true)}
                        >
                            <i className="fa-solid fa-camera-retro"></i>
                            <span>Take a picture</span>
                        </button>
                    </div>

                    <SingleProductCapture open={isPhotoDialogOpen} onClose={() => setIsPhotoDialogOpen(false)} />
                </div>
            }
        </>
    )
}
