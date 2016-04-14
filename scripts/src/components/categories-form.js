import jsyaml from 'js-yaml'

import Form from './form'

export default class extends Form {
  _formatData (formData) {
    return jsyaml.safeDump(formData.categories || [])
  }
}
