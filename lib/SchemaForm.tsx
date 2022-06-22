import {
  defineComponent,
  provide,
  Ref,
  watchEffect,
  watch,
  shallowRef,
} from 'vue'
import { FormPropsDefine, ErrorSchema } from './types'
import SchemaItem from './SchemaItem'
import { SchemaFormContextKey } from './context'
import Ajv, { Options } from 'ajv'
import { validateFormData } from './validator'

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
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})

    watch(
      // 对父暴露 doValidate，代替对父暴露 this。
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              const result = validateFormData(
                validatorRef.value,
                props.value,
                props.schema,
                props.locale,
              )

              errorSchemaRef.value = result.errorSchema

              return result
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
          errorSchema={errorSchemaRef.value || {}}
        />
      )
    }
  },
})
