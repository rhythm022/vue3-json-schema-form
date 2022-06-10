import { defineComponent } from 'vue'
import { Schema, FiledPropsDefine } from './types'
import SchemaItem from './SchemaItem'

export default defineComponent({
  name: 'SchemaForm',
  props: FiledPropsDefine,
  setup(props) {
    const handleChange = (v: any) => {
      props.onChange(v)
    }

    return () => {
      const _props = {
        ...props,
        onChange: handleChange,
      }

      return <SchemaItem {..._props} />
    }
  },
})
