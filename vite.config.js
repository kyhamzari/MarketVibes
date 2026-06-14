import base44 from '@base44/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Fixed: Sets the base URL path for GitHub Pages deployment
    base: '/<kyhamzari/MarketVibes>/', 
    logLevel: 'error', 
    plugins: [
      base44({ 
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
