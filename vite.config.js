// import reactRefresh from '@vitejs/plugin-react-refresh'
// import { defineConfig } from 'vite'
// import { injectHtml } from 'vite-plugin-html'
// import packageJson from '../../apps/route-manager/package.json'

// see https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
//     return {
//         // avoid clearing the bash' output
//         clearScreen: false,

//         // React 17's JSX transform workaround
//         esbuild: { jsxInject: `import * as React from 'react'` },

//         define: {
//             'process.env.uuiVersion': JSON.stringify(packageJson.version),
//         },

//         server: {
//             port: 3003,
//             strictPort: true,
//         },

//         plugins: [
//             reactRefresh(),
//             injectHtml({
//                 injectData: {
//                     mode,
//                     title:
//                         mode === 'production'
//                             ? 'WorkWave RouteManager'
//                             : `RM V3 @${packageJson.version}`,
//                 },
//             }),
//         ],

//         json: {
//             // improve JSON performances and avoid transforming them into named exports above all
//             stringify: true,
//         },

//         resolve: {
//             alias: {
//                 '@/defaultIntlV2Messages': '/locales/en/v2.json',
//                 '@/defaultIntlV3Messages': '/locales/en/v3.json',
//                 '@/components': '/src/components',
//                 '@/intl': '/src/intl/index.ts',
//                 '@/atoms': '/src/atoms/index.ts',
//                 '@/routing': '/src/routing/index.ts',
//                 // ...
//             },
//         },

//         // the dependencies consumed by the worker must be early included by Vite's pre-bundling.
//         // Otherwise, as soon as the Worker consumes it, Vite reloads the page because detects a new dependency.
//         // @see https://vitejs.dev/guide/dep-pre-bundling.html#automatic-dependency-discovery
//         optimizeDeps: {
//             include: [
//                 'idb',
//                 'immer',
//                 'axios',
//                 // ...
//             ],
//         },

//         build: {
//             target: ['es2019', 'chrome61', 'edge18', 'firefox60', 'safari16'], // default esbuild config with edge18 instead of edge16

//             minify: true,
//             brotliSize: true,
//             chunkSizeWarningLimit: 20000, // allow compressing large files (default is 500) by slowing the build. Please consider that Brotli reduces bundles size by 80%!
//             sourcemap: true,

//             rollupOptions: {
//                 output: {
//                     // having a single vendor chunk doesn't work because pixi access the `window` and it throws an error in server-data.
//                     // TODO: by splitting axios, everything works but it's luck, not a designed and expected behavior…
//                     manualChunks: { axios: ['axios'] },
//                 },
//             },
//         },
//     }
// })
// @ts-ignore
// * No declaration file for less-vars-to-js
import reactRefresh from '@vitejs/plugin-react-refresh'
import { getLessVars } from 'antd-theme-generator'
import * as dotenv from 'dotenv'
import { join } from 'path'
import { defineConfig } from 'vite'
import { ViteAliases } from 'vite-aliases'
import Inspect from 'vite-plugin-inspect'
import reactJsx from 'vite-react-jsx'
import xtend from 'xtend'
dotenv.config({ path: __dirname + '/.env' })
const themeVariables = getLessVars(join(__dirname, './src/styles/vars.less'))

export default defineConfig({
    define: {
        'process.env': xtend(
            process.env,
            process.env.NODE_ENV !== 'production'
                ? {
                      API_URL: `${process.env.DEV_API_URL}`,
                  }
                : {
                      API_URL: `${process.env.PROD_API_URL}`,
                  }
        ),
    },
    plugins: [Inspect(), ViteAliases({}), reactJsx(), reactRefresh()],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars: themeVariables,
            },
        },
    },
})
