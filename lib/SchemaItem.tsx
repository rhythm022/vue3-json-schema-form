import { defineComponent, computed } from 'vue'

import { SchemaTypes, FiledPropsDefine } from './types'
import { retrieveSchema } from './utils'

import StringField from './fields/StringField'
import NumberField from './fields/NumberField'
import ObjectField from './fields/ObjectField'

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
      // console.log(schema, 'retrievedSchema:', retrievedSchema)

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
        case SchemaTypes.OBJECT: {
          Component = ObjectField
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
