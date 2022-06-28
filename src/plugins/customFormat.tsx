import { CommonWidgetPropsDefine, CustomFormat } from '../../lib'
import { withFormItemWrapper } from '../../lib/theme-default/FormItemWrapper'
import { computed, defineComponent } from 'vue'

const colorWidget = withFormItemWrapper(
  defineComponent({
    name: 'ColorWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value
        e.target.value = props.value
        ;(props as any).onChange(value)
      }

      const styleRef = computed(() => {
        return {
          color: (props.options && props.options.color) || 'black',
        }
      })

      return () => {
        return (
          <input
            type="color"
            value={props.value as any}
            onInput={handleChange}
            style={styleRef.value}
          />
        )
      }
    },
  }),
)

const format: CustomFormat[] = [
  {
    name: 'color-m', // 找到 format 名对应的 format // format 包含 colorWidget 和 validate
    component: colorWidget as any,
    definition: {
      type: 'string',
      validate: /^#[0-9A-Za-z]{6}$/,
    },
  },
]

export default format
