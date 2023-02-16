
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
