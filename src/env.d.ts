/// <reference types="astro/client" />

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Locals {}
}

interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID?: string;
  readonly SANITY_DATASET?: string;
  readonly SANITY_API_VERSION?: string;
  readonly SANITY_API_READ_TOKEN?: string;
  readonly SANITY_USE_CDN?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
