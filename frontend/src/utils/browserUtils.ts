export const checkIsOnline = async () => {
    if (!navigator.onLine) {
        return false;
    }

    // navigator.onLine is not alway reliable, it can return true even though the browser can't connect with a LAN connection or router.
    try {
        await fetch('http://localhost:8081/api/is-online');
        return true;
    } catch {
        return false;
    }
}