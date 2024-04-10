import react from "@vitejs/plugin-react-swc";

import { defineConfig } from "vite";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./app"),
		},
	},
	// https://stackoverflow.com/questions/66863200/changing-the-input-and-output-directory-in-vite
	build: {
		outDir: "../../dist/frontend",
	},
});
