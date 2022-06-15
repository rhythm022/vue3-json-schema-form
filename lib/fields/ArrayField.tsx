import { defineComponent, PropType } from 'vue'
import { createUseStyles } from 'vue-jss'

import { FiledPropsDefine, Schema } from '../types'

import { useVJSFContext } from '../context'

import SelectionWidget from '../widgets/Selection'
/*
{
  items: { type: number }
}


{
  items: { type: number, enum: [1, 2] }
}


{
  items: [
    { type: string }
    { type: number }
  ]
}

*/
const useStyles = createUseStyles({
  container: {
    border: '1px solid #eee',
  },
  actions: {
    background: '#eee',
    padding: 10,
    textAlign: 'right',
  },
  action: {
    '& + &': {
      marginLeft: 10,
    },
  },
  content: {
    padding: 10,
  },
})
// 1、因为使用了 slot 所以命名为 wrapper
// 2、没有集成 onAdd、onDelete、onUp、onDown 逻辑, 需要集成进来吗？
// 3、prop index 有没有必要？
const ArrayItemWrapper = defineComponent({
  name: 'ArrayItemWrapper',
  props: {
    onAdd: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDelete: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onUp: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDown: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles()

    const handleAdd = () => (props as any).onAdd(props.index)
    const handleDown = () => (props as any).onDown(props.index)
    const handleUp = () => (props as any).onUp(props.index)
    const handleDelete = () => (props as any).onDelete(props.index)

    return () => {
      const classes = classesRef.value
      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button class={classes.action} onClick={handleAdd}>
              新增
            </button>
            <button class={classes.action} onClick={handleDelete}>
              删除
            </button>
            <button class={classes.action} onClick={handleUp}>
              上移
            </button>
            <button class={classes.action} onClick={handleDown}>
              下移
            </button>
          </div>
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      )
    }
  },
})

export default defineComponent({
  name: 'ArrayField',
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext()

    const handleArrayItemChange = (v: any, index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      arr[index] = v //66
      ;(props as any).onChange(arr)
    }

    const handleAdd = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      arr.splice(index + 1, 0, undefined)
      ;(props as any).onChange(arr)
    }

    const handleDelete = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      arr.splice(index, 1)
      ;(props as any).onChange(arr)
    }

    const handleUp = (index: number) => {
      if (index === 0) return
      const { value } = props as any
      const arr = Array.isArray(value) ? value : []

      const item = arr.splice(index, 1)
      arr.splice(index - 1, 0, item[0])
      ;(props as any).onChange(arr)
    }

    const handleDown = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      if (index === arr.length - 1) return

      const item = arr.splice(index, 1)
      arr.splice(index + 1, 0, item[0])
      ;(props as any).onChange(arr)
    }

    return () => {
      const { schema, rootSchema, value } = props

      const SchemaItem = context.SchemaItem

      const isMultiType = Array.isArray(schema.items)
      const isSelect = schema.items && (schema.items as any).enum

      if (isMultiType) {
        // 用户填写指定数量的不同类型的值
        const items: Schema[] = schema.items as any
        const arr = Array.isArray(value) ? value : []
        return items.map((
          // schema map
          s: Schema,
          index: number,
        ) => (
          <SchemaItem
            schema={s}
            key={index}
            rootSchema={rootSchema}
            value={arr[index]}
            onChange={(v: any) => handleArrayItemChange(v, index)}
          />
        ))
      } else if (!isSelect) {
        // 用户填写不定数量的同一类型的值
        const arr = Array.isArray(value) ? value : []

        return arr.map((v: any, index: number) => {
          // value map
          return (
            <ArrayItemWrapper
              index={index}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onDown={handleDown}
              onUp={handleUp}
            >
              <SchemaItem
                schema={schema.items as Schema}
                value={v}
                key={index}
                rootSchema={rootSchema}
                onChange={(v: any) => handleArrayItemChange(v, index)}
              />
            </ArrayItemWrapper>
          )
        })
      } else {
        // 用户在可选范围内挑出一个或多个值
        const { enum: enums } = (schema as any).items
        const options = enums.map((e: any) => ({
          key: e,
          value: e,
        }))
        return (
          <SelectionWidget
            onChange={props.onChange as (v: any) => void}
            value={props.value}
            options={options}
          />
        )
      }
    }
  },
})
