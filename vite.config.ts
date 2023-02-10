import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            strategies: "injectManifest",
            srcDir: "service-worker",
            filename: "sw.ts",
            injectManifest: {
                injectionPoint: undefined
            },
            manifest: {
                "name": "Vue-application",
                "short_name": "Vue-app",
                "theme_color": "#2196f3",
                "background_color": "#ffffff",
                "display": "standalone",
                "description": "Vue application for portfolio",
                "orientation": "any",
                "scope": "/",
                "start_url": "/login",
                "icons": [
                    {
                        "src": "icon_1.png",
                        "sizes": "256x256",
                        "type": "image/png"
                    },
                    {
                        "src": "icon_2.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "any maskable"
                    },
                    {
                        "src": "icon_3.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    }
                ]
            },
            devOptions: {
                enabled: true,
                type: "module"
            }
        })
    ]
});
