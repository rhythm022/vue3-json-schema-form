import { inject } from 'vue'
import { CommonFieldType } from './types'

export const SchemaFormContextKey = Symbol()

export function useVJSFContext() {
  const context: { SchemaItem: CommonFieldType } | undefined = inject(
    SchemaFormContextKey,
  )

  if (!context) {
    throw Error('need SchemaForm provide')
  }

  return context
}
