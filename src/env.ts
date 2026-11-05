import { defineEnvVars } from '@sveltejs/kit/env';
export const variables = defineEnvVars({
	APP_MODE: {
		public: false,
		static: false,
		schema: (value: string | undefined) => value ?? 'demo',
		description: 'Se implementa únicamente demo. Cualquier otro modo bloquea el acceso conectado.'
	}
});
