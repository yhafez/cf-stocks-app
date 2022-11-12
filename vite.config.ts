import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Load .env file
import { loadEnv } from 'vite'
const env = loadEnv('development', process.cwd())

export default defineConfig({
	plugins: [react()],
	server: { host: true, port: 3000 },
	define: {
		'process.env': env,
	},
})
