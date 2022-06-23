export default {
  name: 'Simple',
  schema: {
    description: 'A simple form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        title: 'firstName',
        type: 'string',
        default: 'Chuck',
      },
      lastName: {
        title: 'lastName',
        type: 'string',
      },
      telephone: {
        title: 'telephone',
        type: 'string',
        minLength: 10,
      },
      staticArray: {
        type: 'array',
        items: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
        ],
      },
      singleTypeArray: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            age: {
              type: 'number',
            },
          },
        },
      },
      multiSelectArray: {
        title: 'multiSelectArray',
        type: 'array',
        items: {
          type: 'string',
          enum: ['123', '456', '789'],
        },
      },
    },
  },
  uiSchema: {
    title: 'A registration form',
    properties: {
      firstName: {
        title: 'First name',
      },
      lastName: {
        title: 'Last name',
      },
      telephone: {
        title: 'Telephone',
      },
    },
  },
  default: {
    firstName: 1,
    telephone: '555',
    lastName: 'Norris',
    age: 75,
    bio: 'Roundhouse kicking asses since 1940',
    password: 'noneed',
    staticArray: ['a', '2'],
    // singleTypeArray: [{ name: 'jokcy', age: 12 }],
    multiSelectArray: [],
  },
}
