
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Snackbar } from "./Components";
import OrdersOverview from "./Pages/OrdersOverview/OrdersOverview";
import ProductsOverview from "./Pages/ProductsOverview/ProductsOverview";
import SingleProduct from "./Pages/SingleProduct/SingleProduct";

export default function App() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <ProductsOverview />,
        },
        {
            path: '/orders',
            element: <OrdersOverview />,
        },
        {
            path: '/:productId',
            element: <SingleProduct />,
        }
    ]);

    return (
        <div>
            <RouterProvider router={router} />
            <Snackbar />
        </div>
    )
}

