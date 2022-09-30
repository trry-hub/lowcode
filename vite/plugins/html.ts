import { createHtmlPlugin } from 'vite-plugin-html'

export default function createHtml(env, isBuild) {
  const { VITE_APP_TITLE, VITE_APP_DEBUG_TOOL } = env
  let devtoolScript = ''
  switch (VITE_APP_DEBUG_TOOL) {
    case 'eruda':
      devtoolScript = `
        <script src="//unpkg.com/eruda/eruda.js"></script>
        <script>
          eruda.init()
        </script>`
      break
    case 'vconsole':
      devtoolScript = `
        <script src="//unpkg.com/vconsole/dist/vconsole.min.js"></script>
        <script>
          new VConsole()
        </script>`
      break
  }
  const html = createHtmlPlugin({
    inject: {
      data: {
        title: VITE_APP_TITLE,
        devtoolScript
      }
    },
    minify: isBuild
  })
  return html
}
