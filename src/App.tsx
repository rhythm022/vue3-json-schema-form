import { defineComponent } from 'vue'
const img = require('./assets/logo.png') // eslint-disable-line
export default defineComponent({
  setup() {
    return () => (
      <div>
        <img src={img}></img>
      </div>
    )
  },
})
