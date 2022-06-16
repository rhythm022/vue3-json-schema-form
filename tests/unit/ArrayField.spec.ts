import { mount } from '@vue/test-utils'



import JsonSchemaForm from '../../lib'
import NumberField from '../../lib/fields/NumberField'
import StringField from '../../lib/fields/StringField'
import ArrayField from '../../lib/fields/ArrayField'
import SelectionWidget from '../../lib/widgets/Selection'

describe('ArrayField', () => {
  it('should render multi type', () => {
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema: {
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
        value: [],
        onChange: () => {},
      },
    })

    const arr = wrapper.findComponent(ArrayField)
    const str = arr.findComponent(StringField)
    const num = arr.findComponent(NumberField)

    expect(str.exists()).toBeTruthy()
    expect(num.exists()).toBeTruthy()
  })

  it('should render single type', () => {
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        value: ['1', '2'],
        onChange: () => {},
      },
    })

    const arr = wrapper.findComponent(ArrayField)
    const strs = arr.findAllComponents(StringField)
    // const num = arr.findComponent(NumberField)

    expect(strs.length).toBe(2)
    expect(strs[0].props('value')).toBe('1')
    // expect(num.exists()).toBeTruthy()
  })

  it('should render single type', () => {
    const wrapper = mount(JsonSchemaForm, {
      props: {
        schema: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['1', '2', '3'],
          },
        },
        value: [],
        onChange: () => {}, // elsint-disable-line
      },
    })

    const arr = wrapper.findComponent(ArrayField)
    const select = arr.findComponent(SelectionWidget)
    // const num = arr.findComponent(NumberField)

    expect(select.exists()).toBeTruthy()
    // expect(num.exists()).toBeTruthy()
  })
})
