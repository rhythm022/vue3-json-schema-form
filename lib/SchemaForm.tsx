import { defineComponent, provide } from 'vue'
import { FormPropsDefine } from './types'
import SchemaItem from './SchemaItem'
import { SchemaFormContextKey } from './context'

// 负责接口的组件
export default defineComponent({
  name: 'SchemaForm',
  props: FormPropsDefine,
  setup(props) {
    const handleChange = (v: any) => {
      ;(props as any).onChange(v)
    }
    const context: any = {
      SchemaItem,
    }
    provide(SchemaFormContextKey, context)

    return () => {
      return (
        <SchemaItem
          rootSchema={props.schema}
          schema={props.schema}
          value={props.value}
          onChange={handleChange}
        />
      )
    }
  },
})
