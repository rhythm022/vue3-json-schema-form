import { defineComponent } from 'vue'
import { Schema, PropsDefine } from './types'
import SchemaItem from './SchemaItem'

export default defineComponent({
  name: 'SchemaForm',
  props: PropsDefine,
  setup(props) {
    const handleChange = (v: any) => {
      (props as any).onChange(v)
    }

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
