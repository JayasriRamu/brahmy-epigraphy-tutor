import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Brahmi Glyph',
				short_name: 'Brahmi Glyph',
				description: 'Learn the ancient Brahmi script through interactive lessons',
				theme_color: '#6750a4',
				background_color: '#fef7ff',
				display: 'standalone',
				orientation: 'portrait',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: '/images/logo.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/images/logo.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}']
			}
		})
	]
});
