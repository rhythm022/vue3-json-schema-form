import { defineComponent, PropType } from 'vue'
import { Schema, SchemaTypes } from './types'

export default defineComponent({
  name: 'SchemaForm',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const schema = props.schema as Schema

      switch (schema.type) {
        case SchemaTypes.STRING:
          return <input type="text"></input>
      }
      return <div>this is a form</div>
    }
  },
})
