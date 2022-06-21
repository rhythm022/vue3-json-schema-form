import { CommonWidgetPropsDefine } from '../types'
import { defineComponent } from 'vue'

const TextWidget = defineComponent({
  props: CommonWidgetPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      (props as any).onChange(e.target.value)
    }
    return () => {
      return (
        <input type="text" value={props.value as any} onInput={handleChange} />
      )
    }
  },
})

export default TextWidget
