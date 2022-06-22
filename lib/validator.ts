import Ajv from 'ajv'
const i18n = require('ajv-i18n') // eslint-disable-line

import { Schema, TransformedErrorObject, ErrorSchema } from './types'

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

  return {
    errors,
    errorSchema,
    valid: errors.length === 0,
  }
}
