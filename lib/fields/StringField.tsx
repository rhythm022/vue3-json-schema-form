import { defineComponent } from 'vue'
import { FieldPropsDefine } from '../types'
import { getWidget } from '../theme'
import { CommonWidgetNames } from '../types'

export default defineComponent({
  name: 'StringField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (value: any) => {
      ;(props as any).onChange(value)
    }
    const TextWidgetRef = getWidget(CommonWidgetNames.TextWidget)

    return () => {
      return (
        <TextWidgetRef.value
          value={props.value}
          onChange={handleChange}
          errors={props.errorSchema.__errors}
          schema={props.schema}
        />
      )
    }
  },
})
