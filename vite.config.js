import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import base44 from "@base44/vite-plugin"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 👈 ADD THIS: Sets the base path to your GitHub repository name during production builds
    base: process.env.NODE_ENV === 'production' ? '/kyhamzari/MarketVibes/' : '/', 
    logLevel: 'error',
    plugins: [
      base44({
        legacySDKImports: (process.env.BASE44_LEGACY_SDK_IMPORTS || env.BASE44_LEGACY_SDK_IMPORTS) === 'true',
        hmrNotifier: true,
        navigationNotifier: true,
        analyticsTracker: true,
        visualEditAgent: true
      }),
      react(),
    ],
  };
});
