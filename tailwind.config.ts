import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				surf: {
					50: '#f0f9ff',
					500: '#3b82f6',
					600: '#2563eb'
				}
			}
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;
