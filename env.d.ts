/// <reference types="vite/client" />
/// <reference path="./src/auto-imports.d.ts" />
/// <reference path="./src/components.d.ts" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_PROXY_PREFIX: string;
  readonly VITE_ENABLE_DEBUG: boolean;
  readonly VITE_ENABLE_MOCK: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
