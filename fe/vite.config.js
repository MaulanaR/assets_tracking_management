import * as path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => {
	const env = loadEnv("development", process.cwd(), "");
	return {
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@components": path.resolve(__dirname, "./src/components"),
				"@pages": path.resolve(__dirname, "./src/pages"),
			},
		},
		// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
		//
		// 1. prevent Vite from obscuring rust errors
		clearScreen: false,
		// 2. tauri expects a fixed port, fail if that port is not available
		server: {
			port: 1420,
			strictPort: true,
			host: host || false,
			hmr: host
				? {
						protocol: "ws",
						host,
						port: 1421,
					}
				: undefined,
			watch: {
				// 3. tell Vite to ignore watching `src-tauri`
				ignored: ["**/src-tauri/**"],
			},
			proxy: {
				"/api/v1": {
					target: env.VITE_API_BASE_URL,
					changeOrigin: true,
					secure: false,
				},
			},
		},
	};
});
