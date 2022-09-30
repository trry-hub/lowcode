import fs from 'fs'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import createVitePlugins from './vite/plugins'

// https://vitejs.dev/config/
export default ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  // 全局 scss 资源
  const scssResources = []
  fs.readdirSync('src/assets/styles/resources').forEach(dirname => {
    if (fs.statSync(`src/assets/styles/resources/${dirname}`).isFile())
      scssResources.push(`@import "src/assets/styles/resources/${dirname}";`)
  })
  // css 精灵图相关
  fs.readdirSync('src/assets/sprites').forEach(dirname => {
    if (fs.statSync(`src/assets/sprites/${dirname}`).isDirectory()) {
      // css 精灵图生成的 scss 文件也需要放入全局 scss 资源
      scssResources.push(`@import "src/assets/sprites/_${dirname}.scss";`)
    }
  })
  return defineConfig({
    base: '/',
    // 开发服务器选项 https://cn.vitejs.dev/config/#server-options
    server: {
      host: '0.0.0.0',
      open: env.VITE_OPEN_PROXY === 'true',
      proxy: {
        '/gateway': {
          target: 'https://lowcode-dev.yaomaitong.net',
          changeOrigin: command === 'serve' && env.VITE_OPEN_PROXY === 'true'
          // rewrite: path => path.replace(/\/gateway/, ''),
          // configure: (proxy, options) => {
          //   proxy.on('proxyRes', function(proxyRes, req) {
          //     console.log('RAW Response from the target', options.target + req.url)
          //   })
          // }
        }
      }
    },
    // 构建选项 https://cn.vitejs.dev/config/#server-fsserve-root
    build: {
      target: 'es2015',
      outDir: 'dist',
      // outDir: mode === 'production' ? 'dist' : `dist-${mode}`,
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true'
    },
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: scssResources.join('')
        }
      }
    }
  })
}
