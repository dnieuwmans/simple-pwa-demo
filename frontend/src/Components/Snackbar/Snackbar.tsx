import useSnackbar from "./useSnackbar"

export default function Snackbar() {
    const { snackbarMessage } = useSnackbar();

    function getIcon() {
        switch (snackbarMessage?.variant) {
            case 'success': return <i className="fa-solid fa-check"></i>;
            case 'info': return <i className="fa-solid fa-info"></i>;
            case 'alert': return <i className="fa-solid fa-exclamation"></i>;
            case 'error': return <i className="fa-solid fa-xmark"></i>;
        }
    }

    return (
        <div className={`snackbar ${snackbarMessage.visible ? 'snackbar--open' : ''} snackbar--${snackbarMessage?.variant ?? 'info'}`}>
            {getIcon()}
            <span>{snackbarMessage?.message}</span>
        </div>
    )
}