import {
  defineComponent,
  provide,
  Ref,
  watchEffect,
  watch,
  shallowRef,
} from 'vue'
import { FormPropsDefine } from './types'
import SchemaItem from './SchemaItem'
import { SchemaFormContextKey } from './context'
import Ajv, { Options } from 'ajv'

const defaultAjvOptions: Options = {
  allErrors: true,
  jsonPointers: true,
}

// 负责接口的组件
export default defineComponent({
  name: 'SchemaForm',
  props: FormPropsDefine,
  setup(props) {
    const handleChange = (v: any) => {
      ;(props as any).onChange(v)
    }
    const context: any = {
      SchemaItem,
    }
    provide(SchemaFormContextKey, context)

    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any // ajv用于校验
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      })
    })

    watch(
      // 对父暴露 doValidate，代替对父暴露 this。
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              const valid = validatorRef.value.validate(
                props.schema,
                props.value,
              ) as boolean
              return {
                valid,
                errors: validatorRef.value.errors || [],
              }
            },
          }
        }
      },
      {
        immediate: true,
      },
    )

    return () => {
      return (
        <SchemaItem
          rootSchema={props.schema}
          schema={props.schema}
          value={props.value}
          onChange={handleChange}
        />
      )
    }
  },
})
