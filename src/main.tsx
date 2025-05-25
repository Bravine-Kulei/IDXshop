import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react';
// Import the App component you want to use:
// - App: Full application with routing and Clerk authentication
import App from "./App";
import axios from 'axios';

// Import Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Set base URL for API requests using Vite environment variables
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Add request interceptor for Clerk authentication
axios.interceptors.request.use(
  async (config) => {
    // Get Clerk session token if available
    try {
      const clerkToken = await window.Clerk?.session?.getToken();
      if (clerkToken) {
        config.headers.Authorization = `Bearer ${clerkToken}`;
      }
    } catch (error) {
      console.warn('Failed to get Clerk token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        elements: {
          // Modal and overlay styling
          modalContent: "bg-[#0a0a0a] border border-gray-700",
          modalCloseButton: "text-gray-400 hover:text-white",

          // Card styling
          card: "bg-[#0a0a0a] border border-gray-700 shadow-xl",
          cardBox: "bg-[#0a0a0a]",

          // Header styling
          headerTitle: "text-white text-2xl font-bold",
          headerSubtitle: "text-gray-400",

          // Form elements
          formFieldInput: "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-[#00a8ff] focus:ring-1",
          formFieldLabel: "text-gray-300 font-medium",
          formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",

          // Buttons
          formButtonPrimary: "bg-[#00a8ff] hover:bg-[#0090e0] text-white font-medium transition-colors duration-200 shadow-lg",
          formButtonSecondary: "bg-gray-800 hover:bg-gray-700 text-white border-gray-600",

          // Social buttons
          socialButtonsBlockButton: "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200",
          socialButtonsBlockButtonText: "text-white font-medium",
          socialButtonsBlockButtonArrow: "text-gray-400",

          // Links and text
          footerActionText: "text-gray-400",
          footerActionLink: "text-[#00a8ff] hover:text-[#0090e0] transition-colors duration-200 font-medium",

          // Dividers
          dividerText: "text-gray-400",
          dividerLine: "bg-gray-600",

          // Alternative methods
          alternativeMethodsBlockButton: "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200",
          alternativeMethodsBlockButtonText: "text-white",

          // OTP and verification
          otpCodeFieldInput: "bg-gray-800 border-gray-600 text-white focus:border-[#00a8ff] focus:ring-[#00a8ff]",

          // Links
          formResendCodeLink: "text-[#00a8ff] hover:text-[#0090e0] transition-colors duration-200",

          // Identity preview
          identityPreviewText: "text-gray-300",
          identityPreviewEditButton: "text-[#00a8ff] hover:text-[#0090e0] transition-colors duration-200",

          // Root element
          rootBox: "bg-[#0a0a0a]",

          // Additional modal styling
          modalBackdrop: "bg-black bg-opacity-75",

          // Error styling
          formFieldErrorText: "text-red-400",

          // Loading
          spinner: "text-[#00a8ff]",

          // Navbar (if used)
          navbar: "bg-[#0a0a0a] border-gray-700",
          navbarButton: "text-gray-300 hover:text-white",

          // Page background
          main: "bg-[#0a0a0a]"
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
