import { CommonWidgetPropsDefine } from '../types'
import { defineComponent } from 'vue'

const TextWidget = defineComponent({
  props: CommonWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      const value = e.target.value
      e.target.value = props.value // 用 props.value 复原 dom，让 dom 上的 value 只在初始化时被 props 控制。即受控组件。
      ;(props as any).onChange(value)
    }
    return () => {
      return (
        <input type="text" value={props.value as any} onInput={handleChange} />
      )
    }
  },
})

export default TextWidget
