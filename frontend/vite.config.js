import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Pinned, with strictPort, so the dev server never silently slides to
    // the next free port when another project holds 5173. The backend's
    // server-side PDF export loads the report from this exact origin
    // (backend/.env FRONTEND_ORIGIN) — a drifting port made it render
    // whatever other app was on 5173 and produce a blank PDF.
    port: 5175,
    strictPort: true,
  },
})
