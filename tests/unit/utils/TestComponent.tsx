import { defineComponent } from 'vue'
import JsonSchemaForm, {
  ThemeProvider,
  FormPropsDefine,
} from '../../../lib'
import defaultTheme from '../../../lib/theme-default'

// vjsf-theme-default // import {ThemeProvider} from 'vue3-jsonschema-form'
// vue3-jsonschema-form

export const ThemeDefaultProvider = defineComponent({
  setup(p, { slots }) {
    return () => (
      <ThemeProvider theme={defaultTheme as any}>
        {slots.default && slots.default()}
      </ThemeProvider>
    )
  },
})

export default defineComponent({
  name: 'TestComponent',
  props: FormPropsDefine,
  setup(props) {
    return () => (
      <ThemeDefaultProvider>
        <JsonSchemaForm {...(props as any)} />
      </ThemeDefaultProvider>
    )
  },
})
