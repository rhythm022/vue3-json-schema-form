import {
  defineComponent,
  provide,
  Ref,
  watchEffect,
  watch,
  shallowRef,
  ref,
  computed,
} from 'vue'
import {
  FormPropsDefine,
  ErrorSchema,
  CommonWidgetDefine,
  Schema,
} from './types'
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
    const formatMapRef = computed(() => {
      if (props.customFormats) {
        // 接口层处理接口的体现
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        return customFormats.reduce((result, format) => {
          result[format.name] = format.component
          return result
        }, {} as { [key: string]: CommonWidgetDefine }) // 取出 widget
      } else return {}
    })

    const transformSchemaRef = computed(() => {
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]
        return (schema: Schema) => {
          let newSchema = schema
          customKeywords.forEach((keyword) => {
            if ((newSchema as any)[keyword.name]) {
              newSchema = keyword.transformSchema(schema)
            }
          })
          return newSchema
        }
      }
      return (s: Schema) => s
    })

    const context: any = {
      SchemaItem,
      formatMapRef,
      transformSchemaRef,
    }
    provide(SchemaFormContextKey, context)

    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any // ajv用于校验
    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      })

      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        customFormats.forEach((format) => {
          // 取出 validate
          validatorRef.value.addFormat(format.name, format.definition)
        })
      }

      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]
        customKeywords.forEach((keyword) => {
          validatorRef.value.addKeyword(keyword.name, keyword.definition)
        })
      }
    })
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})

    const validatingRef = ref()
    const validateIndex = ref(0)
    watch(
      () => props.value,
      () => {
        if (validatingRef.value) {
          validate() // 如果校验中，值发生改变，就自动重新 validate
        }
      },
      { deep: true },
    )
    async function validate() {
      // 用户每一次动作，都新发一次校验，但只关注最后一次校验
      console.log('start validate -------->')
      const index = (validateIndex.value += 1)
      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema,
        props.locale,
        props.customValidate,
      )

      if (index < validateIndex.value) return

      // 表明目前为止，用户没再动过
      errorSchemaRef.value = result.errorSchema

      validatingRef.value(result)
      validatingRef.value = undefined
      console.log('end validate -------->')
    }
    watch(
      // 对父暴露 doValidate，代替对父暴露 this。
      () => props.contextRef,
      () => {
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              return new Promise((resolve) => {
                validatingRef.value = resolve // 表示校验开始
                validate()
              })
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
          uiSchema={props.uiSchema || {}}
        />
      )
    }
  },
})
