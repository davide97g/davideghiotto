/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_PRODUCTION: boolean;
  readonly VITE_LOCAL: boolean;
  readonly VITE_API_HOST: string;
  readonly VITE_AUTH_HOST: string;
  readonly VITE_FIREBASE_CONFIG_API_KEY: string;
  readonly VITE_FIREBASE_CONFIG_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_CONFIG_PROJECT_ID: string;
  readonly VITE_FIREBASE_CONFIG_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_CONFIG_APP_ID: string;
  readonly VITE_FIREBASE_CONFIG_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
