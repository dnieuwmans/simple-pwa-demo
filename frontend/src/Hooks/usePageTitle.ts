import { useEffect } from 'react';

export default function usePageTitle(title: string): void {
    const setPageTitle = (title?: string) => {
    const mainTitle = 'Danny\'s Plants';

        if (title) {
            document.title = `${title} - ${mainTitle}`;
        } else {
            document.title = mainTitle;
        }
    };

    useEffect(() => {
        setPageTitle(title);
        return () => setPageTitle(undefined);
    }, [title]);
}
