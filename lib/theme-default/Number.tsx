import { CommonWidgetPropsDefine } from '../types'
import { defineComponent } from 'vue'
// import { withFormItemWrapper } from './FormItemWrapper'
import FormItemWrapper from './FormItemWrapper'

const NumberWidget = defineComponent({
  props: CommonWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      const value = e.target.value
      e.target.value = props.value // 用 props.value 复原 dom，让 dom 上的 value 只在初始化时被 props 控制。即受控组件。
      ;(props as any).onChange(value)
    }
    return () => {
      return (
        <FormItemWrapper {...(props as any)}>
          <input
            type="number"
            value={props.value as any}
            onInput={handleChange}
          />
        </FormItemWrapper>
      )
    }
  },
})

export default NumberWidget
