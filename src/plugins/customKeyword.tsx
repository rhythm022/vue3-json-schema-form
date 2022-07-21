import { CustomKeyword } from '../../lib/types'

const keyword: CustomKeyword = {
  name: 'presetA',
  definition: {
    macro: () => {
      return {
        minLength: 10,
      }
    },
  },
  transformSchema(schema) {
    return {
      ...schema,
    }
  },
}

export default keyword
