import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	// https://stackoverflow.com/questions/66863200/changing-the-input-and-output-directory-in-vite
	build: {
		outDir: "../dist/frontend",
	},
});
