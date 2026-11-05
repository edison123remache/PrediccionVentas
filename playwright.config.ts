import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	use: {
		baseURL: 'http://127.0.0.1:5174',
		launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
	},
	webServer: {
		command: 'npm run dev -- --host 127.0.0.1 --port 5174 --strictPort',
		url: 'http://127.0.0.1:5174',
		reuseExistingServer: !process.env.CI
	},
	projects: [
		{ name: 'escritorio', use: { viewport: { width: 1440, height: 1000 } } },
		{
			name: 'movil',
			use: { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true }
		}
	]
});
