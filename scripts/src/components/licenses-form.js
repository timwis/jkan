import jsyaml from 'js-yaml'

import Form from './form'

export default class extends Form {
  _formatData (formData) {
    const list = {}
    for (let license of formData.licenses) {
      if (license.license_name !== '') {
        list[license.license_url] = license.license_name
      }
    }
    return jsyaml.safeDump(list)
  }
}
