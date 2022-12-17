export default function registerServiceWorker() {
    window.addEventListener('load', async () => {
        if ('serviceWorker' in navigator) {
            await register('service-worker.js');
        }
    });
}

const register = async (scriptUrl: string) => {
    try {
        await navigator.serviceWorker.register(scriptUrl);
    } catch (error) {
        console.error(error);
    }
}