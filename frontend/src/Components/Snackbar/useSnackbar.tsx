import { atom, useAtom } from "jotai";

interface ISnackbarMessage {
    message: string;
    variant: 'info' | 'warning' | 'error' | 'success';
    visible: boolean;
}

const snackbarMessageAtom = atom<ISnackbarMessage>({ message: '', variant: 'info', visible: false });

type UseSnackbarReturnType = {
    snackbarMessage: ISnackbarMessage;
    showSnackbar: (message: string, variant: ISnackbarMessage['variant']) => void;
    hideSnackbar: () => void;
}

let timeout: NodeJS.Timeout;

export default function useSnackbar(): UseSnackbarReturnType {
    const [snackbarMessage, setSnackbarMessage] = useAtom(snackbarMessageAtom);

    function handleShowSnackbar(message: string, variant: ISnackbarMessage['variant']) {
        if (snackbarMessage.visible) {
            handleHideSnackbar()

            // Give it some time to hide and show a new one.
            setTimeout(() => {
                setSnackbarMessage({ message, variant, visible: true });
            }, 400);
        } else {
            setSnackbarMessage({ message, variant, visible: true });
        }

        timeout = setTimeout(() => {
            handleHideSnackbar();
        }, 3000);
    }

    function handleHideSnackbar() {
        setSnackbarMessage(prevState => ({ ...prevState, visible: false }));
        clearTimeout(timeout);
    }

    return {
        snackbarMessage,
        showSnackbar: handleShowSnackbar,
        hideSnackbar: handleHideSnackbar,
    }
}