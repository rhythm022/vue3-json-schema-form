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
          {slots.default && slots.default()}
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
// export function withFormItemWrapper(Widget: any) {
//   return defineComponent({
//     name: `Wrapped${Widget.name}`,
//     props: CommonWidgetPropsDefine,
//     setup(props, { attrs }) {
//       return () => {
//         return (
//           <FormItemWrapper {...(props as any)}>
//             <Widget {...props} {...attrs} />
//           </FormItemWrapper>
//         )
//       }
//     },
//   }) as any
// }
