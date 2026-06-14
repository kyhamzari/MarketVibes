import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import base44 from "@base44/vite-plugin"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Explicitly load .env files relative to the current working directory
  // Setting the third argument to '' loads all variables regardless of the VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');

  return {
    logLevel: 'error', // Suppress warnings, only show errors
    plugins: [
      base44({
        // Safely reads the flag from your system process OR your local .env configuration file
        legacySDKImports: (process.env.BASE44_LEGACY_SDK_IMPORTS || env.BASE44_LEGACY_SDK_IMPORTS) === 'true',
        hmrNotifier: true,
        navigationNotifier: true,
        analyticsTracker: true,
        visualEditAgent: true
      }),
      react(),
    ],
    server: {
      port: 3000,
      open: true,
    }
  };
});
