import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/inter';
import './index.css';
import { captureCampaignSource } from './services/api';

// Remember which campaign link (?source=…) brought this visitor
captureCampaignSource();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
