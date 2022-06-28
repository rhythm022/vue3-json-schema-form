import {
  computed,
  defineComponent,
  inject,
  PropType,
  provide,
  ComputedRef,
  ref,
  ExtractPropTypes,
} from 'vue'
import { useVJSFContext } from './context'
import {
  CommonWidgetNames,
  SelectionWidgetNames,
  Theme,
  FieldPropsDefine,
} from './types'
import { isObject } from './utils'

const THEME_PROVIDER_KEY = Symbol()

// provide context eg. props theme
export default defineComponent({
  // 把 theme 从原来的 props 里单独拿出来。只有更大的组件\视图能为组件\视图，提供上下文。
  name: 'VJSFThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  setup(props, { slots }) {
    //?? 可以不要 computed 吗
    const context = computed(() => props.theme)

    provide(THEME_PROVIDER_KEY, context)

    return () => slots.default && slots.default()
  },
})

export function getWidget<T extends SelectionWidgetNames | CommonWidgetNames>(
  name: T,
  props?: ExtractPropTypes<typeof FieldPropsDefine>,
) {
  if (props) {
    const { uiSchema, schema } = props
    if (uiSchema?.widget && isObject(uiSchema.widget)) {
      return ref(uiSchema.widget) //  优先 uiSchema 里找
    }
    if (schema.format) {
      const formContext = useVJSFContext()
      if (formContext.formatMapRef.value[schema.format]) {
        return ref(formContext.formatMapRef.value[schema.format]) //  再 formContext 里找（即 format 里找）
      }
    }
  }

  const context: ComputedRef<Theme> | undefined = inject<ComputedRef<Theme>>(
    THEME_PROVIDER_KEY,
  )
  if (!context) {
    throw new Error('vjsf theme required')
  }

  const widgetRef = computed(() => {
    //?? 可以不要 computed 吗
    return context.value.widgets[name] // 再 context 里找（即 default 里找）
  })

  return widgetRef
}
