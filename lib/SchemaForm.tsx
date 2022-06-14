import { defineComponent, provide } from 'vue'
import { PropsDefine } from './types'
import SchemaItem from './SchemaItem'
import { SchemaFormContextKey } from './context'

export default defineComponent({
  name: 'SchemaForm',
  props: PropsDefine,
  setup(props) {
    const handleChange = (v: any) => {
      ;(props as any).onChange(v)
    }
    const context: any = {
      SchemaItem,
    }
    provide(SchemaFormContextKey, context)

    return () => {
      const _props = {
        ...props,
        onChange: handleChange,
        rootSchema: props.schema,
      }

      return <SchemaItem {..._props} />
    }
  },
})
