import { defineComponent, computed } from 'vue'

import { SchemaTypes, FiledPropsDefine } from './types'
import { retrieveSchema } from './utils'

import StringField from './fields/StringField'
import NumberField from './fields/NumberField'

export default defineComponent({
  name: 'SchemaItem',
  props: FiledPropsDefine,
  setup(props) {
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return retrieveSchema(schema, rootSchema, value)
    })

    return () => {
      const { schema } = props
      const retrievedSchema = retrievedSchemaRef.value

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

      return <Component {...props} schema={retrievedSchema} />
    }
  },
})
