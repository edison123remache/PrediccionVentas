import { defineConfig } from '@playwright/test';
export default defineConfig({
	testDir: './tests',
	outputDir: 'test-results/unavailable',
	testMatch: 'unavailable.spec.ts',
	use: {
		baseURL: 'http://127.0.0.1:5175',
		launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
	},
	webServer: {
		command: 'npm run dev -- --host 127.0.0.1 --port 5175 --strictPort',
		url: 'http://127.0.0.1:5175/perfiles',
		env: { APP_MODE: 'connected' },
		reuseExistingServer: false
	}
});
