import { createRoot } from 'react-dom/client';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import '@/app/styles/index.css';
import { App } from '@/app/App';

createRoot(document.getElementById('root')!).render(<App />);
