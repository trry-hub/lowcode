import autoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default function createAutoImport() {
  return autoImport({
    imports: [
      'vue',
      'vue-router',
      {
        'vue': [
          'defineProps',
          'defineEmits',
          'defineExpose',
          'withDefaults'
        ]
      },
      'pinia'
    ],
    eslintrc: {
      enabled: true,
      filepath: './.eslintrc-auto-import.json',
      globalsPropValue: true
    },
    resolvers: [VantResolver()],
    dts: 'src/auto-imports.d.ts',
    dirs: [
      './src/utils/composables/**'
    ]
  })
}
