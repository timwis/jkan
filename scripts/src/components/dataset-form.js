import $ from 'jquery'
import 'select2'

export default class {
  constructor (opts) {
    const elements = {
      select2: $('.select2', opts.el)
    }

    // Initialize select2 plugin
    elements.select2.select2()
  }
}
