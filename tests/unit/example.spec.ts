import { mount } from '@vue/test-utils'

import JsonSchemaForm from '../../lib'
import NumberField from '../../lib/fields/NumberField'
import theme from '../../lib/theme-default'

describe('JsonSchemaFrom', () => {
  it('should render correct number field', async () => {
    let value = ''
    const wrapper = mount(JsonSchemaForm, {
      props: {
        theme:theme as any ,
        schema: {
          type: 'number',
        },
        value: value,
        onChange: (v) => {
          value = v
        },
      },
    })

    const numberField = wrapper.findComponent(NumberField)
    expect(numberField.exists()).toBeTruthy()
    // await numberField.props('onChange')('123')
    const input = numberField.find('input')
    input.element.value = '123'
    input.trigger('input')
    expect(value).toBe(123)
  })
})
