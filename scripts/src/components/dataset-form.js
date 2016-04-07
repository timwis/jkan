import $ from 'jquery'
import 'select2'

export default class {
  constructor (opts) {
    const elements = {
      select2: $('.select2', opts.el),
      license: $('#license', opts.el)
    }

    // Initialize select2 plugin
    elements.select2.select2()

    elements.license.on('change', function (e) {
     var selected = $('#license option:selected')
     var license = selected.val();
     var name = selected.text()
     if (license == 'other') {
       $('#license_url-wrapper').removeClass('hidden')
       $('#license_name-wrapper').removeClass('hidden')
     } else {
       $('#license_url-wrapper').addClass('hidden')
       $('#license_name-wrapper').addClass('hidden')
       $('#license_url').val(license)
       $('#license_name').val(name)
     }
   })
  }
}
