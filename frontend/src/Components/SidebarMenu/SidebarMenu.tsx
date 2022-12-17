import { useEffect } from "react";
import { Link } from "react-router-dom";

interface IProps {
    open: boolean;
    onClose: () => void;
}

export default function SidebarMenu(props: IProps) {
    const { open, onClose } = props;

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

    return (
        <div
            className={`sidebar-menu ${open ? 'sidebar-menu--open' : ''}`}
            style={{ height: `calc(100vh - ${pageHeaderHeight}px)` }}
        >
            <Link className='sidebar-menu__item' to='/'>Home</Link>
            <Link className='sidebar-menu__item' to='/orders'>Orders</Link>
        </div>
    )
}