import { CommonWidgetPropsDefine, CommonWidgetDefine } from '../../lib/types'
import { defineComponent } from 'vue'

import { withFormItemWrapper } from '../../lib/theme-default/FormItemWrapper'

const PasswordWidget: CommonWidgetDefine = withFormItemWrapper(
  defineComponent({
    name: 'PasswordWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value
        e.target.value = props.value
        ;(props as any).onChange(value)
      }
      return () => {
        return (
          <input
            type="password"
            value={props.value as any}
            onInput={handleChange}
          />
        )
      }
    },
  }),
)

export default PasswordWidget
