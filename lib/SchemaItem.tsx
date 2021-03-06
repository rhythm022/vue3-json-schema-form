import { defineComponent, computed } from 'vue'

import { SchemaTypes, FieldPropsDefine } from './types'
import { retrieveSchema } from './utils'

import StringField from './fields/StringField'
import NumberField from './fields/NumberField'
import ObjectField from './fields/ObjectField'
import ArrayField from './fields/ArrayField'
import { useVJSFContext } from './context'

// 负责分发的组件
export default defineComponent({
  name: 'SchemaItem',
  props: FieldPropsDefine,
  setup(props) {
    const formContext = useVJSFContext()

    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return formContext.transformSchemaRef.value(
        retrieveSchema(schema, rootSchema, value),
      )
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
        case SchemaTypes.ARRAY: {
          Component = ArrayField
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
