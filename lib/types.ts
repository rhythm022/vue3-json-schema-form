import { PropType, defineComponent, DefineComponent, Ref } from 'vue'
import Ajv, { Options, FormatDefinition, KeywordDefinition } from 'ajv'
export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}

type SchemaRef = { $ref: string }

// type Schema = any
export interface Schema {
  type?: SchemaTypes | string
  const?: any
  format?: string

  title?: string
  default?: any

  properties?: {
    [key: string]: Schema
  }
  items?: Schema | Schema[] | SchemaRef
  uniqueItems?: any
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  anyOf?: Schema[]
  allOf?: Schema[]
  // TODO: uiSchema
  // vjsf?: VueJsonSchemaConfig
  required?: string[]
  enum?: any[]
  enumNames?: any[]
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema

  minLength?: number
  maxLength?: number
  minimun?: number
  maximum?: number
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
}

export const PropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const

interface FormContext {
  doValidate: () => Promise<{
    errors: any[]
    valid: boolean
  }>
}

export const FormPropsDefine = {
  ...PropsDefine,
  contextRef: {
    type: Object as PropType<Ref<FormContext | undefined>>,
  },
  ajvOptions: {
    type: Object as PropType<Options>,
  },
  locale: {
    type: String,
    default: 'zh',
  },
  customValidate: {
    type: Function as PropType<(data: any, errors: any) => void>,
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
  },
  customFormats: {
    type: [Array, Object] as PropType<CustomFormat[] | CustomFormat>,
  },
  customKeywords: {
    type: [Array, Object] as PropType<CustomKeyword[] | CustomKeyword>,
  },
} as const

export const FieldPropsDefine = {
  ...PropsDefine,
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true,
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
    required: true,
  },
} as const

const TypeHelperComponent = defineComponent({
  props: FieldPropsDefine,
})

export type CommonFieldType = typeof TypeHelperComponent

export const CommonWidgetPropsDefine = {
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  errors: {
    type: Array as PropType<string[]>,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  options: {
    type: Object as PropType<{ [keys: string]: any }>,
  },
} as const

export const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<
      {
        key: string
        value: any
      }[]
    >,
    required: true,
  },
} as const

export type CommonWidgetDefine = DefineComponent<
  typeof CommonWidgetPropsDefine,
  {},
  {}
>

export type SelectionWidgetDefine = DefineComponent<
  typeof SelectionWidgetPropsDefine,
  {},
  {}
>

export enum SelectionWidgetNames {
  SelectionWidget = 'SelectionWidget',
}

export enum CommonWidgetNames {
  TextWidget = 'TextWidget',
  NumberWidget = 'NumberWidget',
}

export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefine
    [CommonWidgetNames.TextWidget]: CommonWidgetDefine
    [CommonWidgetNames.NumberWidget]: CommonWidgetDefine
  }
}

export interface TransformedErrorObject {
  name: string
  property: string
  message: string | undefined
  params: Ajv.ErrorParameters
  schemaPath: string
}

interface ErrorSchemaObject {
  [level: string]: ErrorSchema
}

export type ErrorSchema = ErrorSchemaObject & {
  // & ????????????????????????
  __errors?: string[]
}

export type UISchema = {
  widget?: string | CommonWidgetDefine
  properties?: {
    [key: string]: UISchema
  }
  items?: UISchema | UISchema[]
} & {
  [key: string]: any
}

export interface CustomFormat {
  name: string
  definition: FormatDefinition
  component: CommonWidgetDefine
}

export interface CustomKeyword {
  name: string
  definition: KeywordDefinition
  transformSchema: (originSchema: Schema) => Schema
}
