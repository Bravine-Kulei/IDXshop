/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_APP_ENV: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_LIVE_CHAT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
