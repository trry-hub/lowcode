import components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default function createComponents() {
    const resolvers = []
    resolvers.push(VantResolver())
    return components({
        resolvers,
        dirs: ['src/components'],
        include: [/\.vue$/, /\.vue\?vue/, /\.jsx$/],
        dts: 'src/components.d.ts'
    })
}
