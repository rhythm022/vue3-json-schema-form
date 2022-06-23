import { defineComponent, ref, watch } from 'vue'
import { SelectionWidgetPropsDefine } from '../types'
// import { withFormItemWrapper } from './FormItemWrapper'
import FormItemWrapper from './FormItemWrapper'

export default defineComponent({
  name: 'SelectionWidget',
  props: SelectionWidgetPropsDefine,
  setup(props) {
    const currentValueRef = ref(props.value)
    watch(
      () => props.value,
      (v) => {
        if (v !== currentValueRef.value) {
          currentValueRef.value = v
        }
      },
    )

    watch(currentValueRef, (newv) => {
      if (newv !== props.value) {
        ;(props as any).onChange(newv)
      }
    })

    return () => {
      const { options } = props
      return (
        <FormItemWrapper {...(props as any)}>
          <select multiple={true} v-model={currentValueRef.value}>
            {options.map((op) => (
              <option value={op.value}>{op.key}</option>
            ))}
          </select>
        </FormItemWrapper>
      )
    }
  },
})
