const Ajv = require('ajv')
const localize = require('ajv-i18n')
const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: {
      type: 'string',
      errorMessage:{
          type:'这是错误的'
      },
    },
  },
  required: ['foo'],
  additionalProperties: false,
}

const ajv = new Ajv({ allErrors: true }) 
require('ajv-errors')(ajv)

const validate = ajv.compile(schema)

const data = {
  foo: 1,
  bar: 1,
}

const valid = validate(data)
if (!valid) {
  //   localize.zh(validate.errors)
  console.log(validate.errors)
}
