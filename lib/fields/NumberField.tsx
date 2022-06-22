import { FieldPropsDefine } from '../types'
import { defineComponent } from 'vue'
import { getWidget } from '../theme'
import { CommonWidgetNames } from '../types'
export default defineComponent({
  name: 'NumberField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (num: any) => {
      num = Number(num)
      num = Number.isNaN(num) ? undefined : num
      ;(props as any).onChange(num)
    }
    const NumberWidgetRef = getWidget(CommonWidgetNames.NumberWidget)

    return () => (
      <NumberWidgetRef.value
        value={props.value}
        onChange={handleChange}
        errors={props.errorSchema.__errors}
      />
    )
  },
})
