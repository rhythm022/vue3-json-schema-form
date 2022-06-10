import { defineComponent } from 'vue'

import { SchemaTypes, FiledPropsDefine } from './types'
import StringField from './fields/StringField'
import NumberField from './fields/NumberField'

export default defineComponent({
  name: 'SchemaItem',
  props: FiledPropsDefine,
  setup(props) {
    return () => {
      const { schema } = props
      let Component: any
      switch (schema.type) {
        case SchemaTypes.STRING: {
          Component = StringField
          break
        }
        case SchemaTypes.NUMBER: {
          Component = NumberField
          break
        }
        default: {
          console.warn(`${schema.type} is not supported`)
        }
      }

      return <Component {...props} />
    }
  },
})
