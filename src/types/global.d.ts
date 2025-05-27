/**
 * Global type declarations for the application
 */

// Clerk global types
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

// Make this file a module
export {};
