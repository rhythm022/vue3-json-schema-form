import Ajv from 'ajv'
const i18n = require('ajv-i18n') // eslint-disable-line

import { Schema, TransformedErrorObject, ErrorSchema } from './types'
import { mergeObjects } from './utils'
function toErrorSchema(errors: TransformedErrorObject[]) {
  if (errors.length < 1) return {}

  return errors.reduce((errorSchema, error) => {
    const { property, message } = error
    const path = property.split('/') // /obj/a -> [obj, a]
    let parent = errorSchema

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === '') {
      path.splice(0, 1)
    }

    // {
    //   obj: {
    //     a: {}
    //   }
    // } // /obj/a
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        ;(parent as any)[segment] = {}
      }
      parent = parent[segment]
    }

    if (Array.isArray(parent.__errors)) {
      // We store the list of errors for this node in a property named __errors
      // to avoid name collision with a possible sub schema field named
      // "errors" (see `validate.createErrorHandler`).
      parent.__errors = parent.__errors.concat(message || '')
    } else {
      if (message) {
        parent.__errors = [message]
      }
    }
    return errorSchema
  }, {} as ErrorSchema) // errorSchema 像字典树
}

function transformErrors(
  errors: Ajv.ErrorObject[] | null | undefined,
): TransformedErrorObject[] {
  if (errors === null || errors === undefined) return []

  return errors.map(({ message, dataPath, keyword, params, schemaPath }) => {
    return {
      name: keyword,
      params,
      message,
      schemaPath,
      property: `${dataPath}`,
    }
  })
}

export function validateFormData(
  validator: Ajv.Ajv,
  formData: any,
  schema: Schema,
  locale = 'zh',
  customValidate?: (data: any, errors: any) => void,
) {
  let validationError = null
  try {
    validator.validate(schema, formData)
  } catch (err) {
    validationError = err
  }

  i18n[locale](validator.errors)
  let errors = transformErrors(validator.errors)

  if (validationError) {
    errors = [
      ...errors,
      {
        message: (validationError as any).message,
      } as TransformedErrorObject,
    ]
  }

  const errorSchema = toErrorSchema(errors)

  if (!customValidate) {
    return {
      errors,
      errorSchema,
      valid: errors.length === 0,
    }
  }

  /**
   * {
   *    obj: {
   *       a: { b: str }
   *       __errors: []
   *    }
   * }
   *
   * raw.obj.a
   */
  const proxy = createErrorProxy()
  customValidate(formData, proxy)

  const newErrorSchema = mergeObjects(errorSchema, proxy, true) // 666

  return {
    errors,
    errorSchema: newErrorSchema,
    valid: errors.length === 0,
  }
}

function createErrorProxy() {
  return new Proxy(
    {},
    {
      get(target, key) {
        // 如果 .addError，返回函数
        if (key === 'addError') {
          return (msg: string) => {
            const __errors = Reflect.get(target, '__errors')
            if (Array.isArray(__errors)) {
              __errors.push(msg)
            } else {
              ;(target as any).__errors = [msg]
            }
          }
        }
        // 如果点出 undefined，就生成并返回 {} 空对象 // 666
        const res = Reflect.get(target, key)
        if (res === undefined) {
          const p: any = createErrorProxy()
          ;(target as any)[key] = p
          return p
        }

        return res
      },
    },
  )
}
