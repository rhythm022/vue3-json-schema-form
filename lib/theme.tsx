import {
  computed,
  defineComponent,
  inject,
  PropType,
  provide,
  ComputedRef,
} from 'vue'
import { Theme } from './types'

const THEME_PROVIDER_KEY = Symbol()

// provide context eg. props theme
const ThemeProvider = defineComponent({// 把 theme 从原来的 props 里单独拿出来。只有更大的组件\视图能为组件\视图，提供上下文。
  name: 'VJSFThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const context = computed(() => props.theme)//?? 可以不要 computed 吗

    provide(THEME_PROVIDER_KEY, context)

    return () => slots.default && slots.default()
  },
})

export function getWidget(name: string) {
  const context: ComputedRef<Theme> | undefined = inject<ComputedRef<Theme>>(
    THEME_PROVIDER_KEY,
  )
  if (!context) {
    throw new Error('vjsf theme required')
  }

  const widgetRef = computed(() => {
    return (context.value.widgets as any)[name]//?? 可以不要 computed 吗
  })

  return widgetRef
}

export default ThemeProvider
