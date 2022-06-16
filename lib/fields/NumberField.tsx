import { FieldPropsDefine } from '../types'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NumberField',
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (e: any) => {
      let num = Number(e.target.value) as any
      num = Number.isNaN(num) ? undefined : num
      ;(props as any).onChange(num)
    }

    return () => {
      return <input type="number" value={props.value} onInput={handleChange} />
    }
  },
})
