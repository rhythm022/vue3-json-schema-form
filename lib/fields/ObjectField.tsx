import { defineComponent } from 'vue'

import { FiledPropsDefine } from '../types'
import { isObject } from '../utils'
import { useVJSFContext } from '../context'

/*
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
  },
}
*/
export default defineComponent({
  name: 'ObjectField',
  props: FiledPropsDefine,
  setup(props) {
    const { SchemaItem } = useVJSFContext()

    const handleObjectFieldChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {}
      //66
      if (v === undefined || v === '') {
        delete value[key]
      } else {
        value[key] = v
      }

      ;(props as any).onChange(value)
    }

    return () => {
      const { schema, rootSchema, value } = props
      const properties = schema.properties || {}
      const currentValue: any = isObject(value) ? value : {}

      return Object.keys(properties).map((k: string, index: number) => (
        <SchemaItem
          key={index}
          rootSchema={rootSchema}
          schema={properties[k]}
          value={currentValue[k]}
          onChange={(v: any) => handleObjectFieldChange(k, v)}
        />
      ))
    }
  },
})
