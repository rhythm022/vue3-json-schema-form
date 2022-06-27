import { defineComponent, computed } from 'vue'
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

    const TextWidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props.uiSchema)
      return widgetRef.value
    })

    const widgetOptionsRef = computed(() => {
      const { widget, properties, items, ...rest } = props.uiSchema // eslint-disable-line
      return rest
    })

    return () => {
      return (
        <TextWidgetRef.value
          value={props.value}
          onChange={handleChange}
          errors={props.errorSchema.__errors}
          schema={props.schema}
          options={widgetOptionsRef.value}
        />
      )
    }
  },
})
