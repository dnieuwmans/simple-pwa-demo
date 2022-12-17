import { useAtomValue } from "jotai";
import { PropsWithChildren, ReactNode, useState } from "react";
import { showNotification } from "src/ServiceWorkers/core";
import ShoppingCart, { shoppingCartItemsAtom } from "../ShoppingCart/ShoppingCart";
import SidebarMenu from "../SidebarMenu/SidebarMenu";

interface IProps {
    actionButton?: {
        onClick: () => void;
        icon: ReactNode;
    }
}

export default function Header(props: PropsWithChildren<IProps>) {
    const { children } = props;

    const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
    const [isShoppingCartOpen, setIsShoppingCartOpen] = useState(false);
    const [showNotificationsBar, setShowNotificationsBar] = useState(!['denied', 'granted'].includes(window.Notification?.permission));

    const browserSupportsNotifications = 'Notification' in window;

    const shoppingCartItems = useAtomValue(shoppingCartItemsAtom);
    const hasShoppingCartItems = shoppingCartItems.length > 0;

    const actionButton = props.actionButton ?? {
        onClick: () => setIsSidebarMenuOpen(prevState => !prevState),
        icon: <i className="fa-solid fa-bars"></i>,
    };

    async function handleEnableNotifications() {
        const requestedPermission = await Notification.requestPermission();

        if (requestedPermission === 'granted') {
            if ('serviceWorker' in navigator) {
                const serviceWorker = await navigator.serviceWorker.ready;

                await showNotification(serviceWorker, {
                    title: 'Notifications enabled!',
                    body: 'The notifications for Danny\'s Plants are now enabled. Enjoy shopping with us!',
                    tag: 'notifications-enabled',
                });
            }
        }

        setShowNotificationsBar(false);
    }

    return (
        <div className='page-header-container'>
            {browserSupportsNotifications && showNotificationsBar &&
                <div className='notifications-alert alert alert--info'>
                    <i className="fa-solid fa-info"></i>
                    <span>Notifications are used within this app, would you like to enable them?</span>
                    <button onClick={handleEnableNotifications}>Enable notifications</button>
                </div>
            }

            <div className='page-header'>
                <button className='button' onClick={actionButton.onClick}>
                    {actionButton.icon}
                </button>
                {children}
                <button
                    onClick={() => setIsShoppingCartOpen(prevState => !prevState)}
                    className={`button button--circle button--borderless ${hasShoppingCartItems ? 'button--with-badge' : ''}`}
                > 
                    <i className="fa-solid fa-cart-shopping"></i>
                </button>
            </div>

            <ShoppingCart open={isShoppingCartOpen} onClose={() => setIsShoppingCartOpen(false)} />
            <SidebarMenu open={isSidebarMenuOpen} onClose={() => setIsSidebarMenuOpen(false)} />
        </div>
    )
}