import $ from 'jquery'

import {queryByHook} from '../util'

export default function (opts) {
  opts || (opts = {})

  const elements = {
    adminForm: queryByHook('admin-form', opts.el),
    alert: queryByHook('alert', opts.el),
    commitUrl: queryByHook('commit-url', opts.el)
  }

  elements.adminForm.on('submit', function (e) {
    const formData = elements.adminForm.serializeJSON()

    opts.file.read()
    .then((contents) => {
      const newContents = opts.file.updateYamlString(contents, formData)
      opts.file.save(newContents)
      .then((response) => {
        alert('success', response.commit.html_url)
      }).catch((msg) => {
        alert('error')
        console.error(msg)
      })
    }).catch((err) => console.error(err))

    e.preventDefault()
  })

  // Show alert box on page
  function alert (type, commitUrl) {
    elements.alert.hide()
    $('[data-hook~=alert-' + type +']').show()
    if (type === 'success' && commitUrl) {
      elements.commitUrl.attr('href', commitUrl)
    }
  }
}
