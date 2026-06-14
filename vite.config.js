import base44 from '@base44/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    logLevel: 'error', 
    plugins: [
      base44({ 
        // Fixed: Checked against a string and used the loaded env object
        legacySDKImports: env.BASE44_LEGACY_SDK_IMPORTS === 'true', 
        hmrNotifier: true,
        navigationNotifier: true,
        analyticsTracker: true,
        visualEditAgent: true
      }),
      react(),
    ]
  }
})
