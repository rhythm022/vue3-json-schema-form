import PasswordWidget from '../components/PasswordWiget'

export default {
  name: 'Demo',
  schema: {
    type: 'object',
    properties: {
      pass1: {
        type: 'string',
        minLength: 10,
        title: 'password',
      },
      pass2: {
        type: 'string',
        minLength: 10,
        title: 're try password',
      },
      color: {
        type: 'string',
        format: 'color-m', // format 名
        title: 'Input Color',
      },
    },
  },
  async customValidate(data: any, errors: any) {
    await timeout(200)

    // data 包含了所有 field 的数据
    if (data.pass1 !== data.pass2) {
      errors.pass2.addError('密码必须相同')
    }
  },
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget, // 666：widget 只包含用户可以自定义的职责如界面显示，这是 widget 独立出而区别于 StringField 等的地方
      },
      pass2: {
        color: 'red',
      },
    },
  },
  default: {
    pass1: '',
    pass2: '',
    color: '#ffffff',
  },
}

async function timeout(t: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, t)
  })
}
