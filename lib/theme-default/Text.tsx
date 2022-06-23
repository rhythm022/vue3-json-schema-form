import { CommonWidgetPropsDefine } from '../types'
import { defineComponent } from 'vue'
import { withFormItemWrapper } from './FormItemWrapper'

let TextWidget = defineComponent({
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

// 使用 hoc 时可以：
// 让调用 Widget 的上层用户不知道加入了 wrapper 组件
// 让 Widget 也不知道 wrapper 组件的加入，自己被挤下去了
// 总之，无感的加入了中间层
TextWidget = withFormItemWrapper(TextWidget)

export default TextWidget
