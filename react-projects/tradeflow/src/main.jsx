import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './utils/theme'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './pages/App.jsx'

// Auto-recover from stale chunks when a new deployment invalidates old chunk hashes
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('Vite preload error detected. Auto-reloading page for fresh assets...', event);
    window.location.reload();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router}/>
  </StrictMode>,
)
