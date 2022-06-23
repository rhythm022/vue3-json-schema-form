import { defineComponent } from 'vue'
import { CommonWidgetPropsDefine } from '../types'

import { createUseStyles } from 'vue-jss'

const useStyles = createUseStyles({
  container: {},
  label: {
    display: 'block',
    color: '#777',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    margin: '5px 0',
    padding: 0,
    paddingLeft: 20,
  },
})

const FormItemWrapper = defineComponent({
  name: 'FormItemWrapper',
  props: CommonWidgetPropsDefine,
  setup(props, { slots }) {
    const classesRef = useStyles()
    return () => {
      const { schema, errors } = props
      const classes = classesRef.value
      return (
        <div class={classes.container}>
          <label class={classes.label}>{schema.title}</label>
          {/* 无论 Widget 是内部写死，还是通过 slot 外部传入，Widget 都是 FormItemWrapper 的子组件 */}
          {slots.default && slots.default()}{' '}
          <ul class={classes.errorText}>
            {errors?.map((err) => (
              <li>{err}</li>
            ))}
          </ul>
        </div>
      )
    }
  },
})

export default FormItemWrapper

// HOC: Higher Order Component: 高阶组件
export function withFormItemWrapper(Widget: any) {
  // withFormItemWrapper 专门用来耦合 FormItemWrapper Widget
  // 三个都是组件，从父到子：withFormItemWrapper > FormItemWrapper > Widget
  return defineComponent({
    name: `Wrapped${Widget.name}`,
    props: CommonWidgetPropsDefine,
    setup(props, { attrs }) {
      return () => {
        return (
          <FormItemWrapper {...(props as any)}>
            <Widget {...props} {...attrs} />
          </FormItemWrapper>
        )
      }
    },
  }) as any
}
