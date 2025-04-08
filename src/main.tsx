
// This file is kept for compatibility with the current setup
// Future development should use the Next.js pages structure
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx is executing - attempting to render the app");

try {
  const rootElement = document.getElementById("root");
  console.log("Root element found:", rootElement);
  
  if (rootElement) {
    const root = createRoot(rootElement);
    console.log("React root created, about to render App component");
    root.render(<App />);
    console.log("App rendered successfully");
  } else {
    console.error("Root element not found in the DOM");
  }
} catch (error) {
  console.error("Error rendering the application:", error);
}
