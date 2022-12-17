import { createRoot } from 'react-dom/client';
import App from './App';
import dayjs from 'dayjs'
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)
dayjs.locale('en') 

import registerServiceWorker from './registerServiceWorker';

registerServiceWorker();

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    root.render(<App />);
}