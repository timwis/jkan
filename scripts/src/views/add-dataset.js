/* global settings */
import $ from 'jquery'
import 'select2'
import 'jquery-serializejson'

import {queryByHook, slugify} from '../util'

export default function (opts) {
  opts || (opts = {})
  const elements = {
    form: queryByHook('dataset-form', opts.el),
    distributionRows: queryByHook('distribution-rows', opts.el),
    adddistributionButton: queryByHook('add-distribution', opts.el),
    alert: queryByHook('alert', opts.el),
    commitUrl: queryByHook('commit-url', opts.el),
    datasetUrl: queryByHook('dataset-url', opts.el),
    select2: $('.select2', opts.el)
  }

  const TmplDistributionRow = queryByHook('tmpl-distribution-row').html()

  // Initialize select2 plugin
  elements.select2.select2()

  // "Remove distribution" buttons
  elements.distributionRows.on('click', '[data-hook~=remove-distribution]', (e) => {
    if (window.confirm('Delete this resource?')) {
      $(e.currentTarget).closest('[data-hook~=distribution-row]').remove()
    }
    e.preventDefault()
  })

  // Add distribution button
  elements.adddistributionButton.on('click', function (e) {
    elements.distributionRows.append(TmplDistributionRow)
  })

  // Edit form submission
  elements.form.on('submit', function (e) {
    e.preventDefault()
    const formData = elements.form.serializeJSON({useIntKeysAsArrayIndex: true})
    if (!formData.title) {
      alert('error')
      return
    }
    const yaml = opts.file.formatFrontMatter(formData)
    const fileSlug = slugify(formData.title)

    opts.file.create(`${fileSlug}.md`, yaml)
    .then((response) => {
      alert('success', {commitUrl: response.commit.html_url, fileSlug: fileSlug})
    }).catch((msg) => {
      alert('error')
      console.error(msg)
    })
  })

  // Show alert box on page
  function alert (type, {commitUrl, fileSlug} = {}) {
    elements.alert.hide()
    $('[data-hook~=alert-' + type +']').show()
    if (type === 'success' && commitUrl) {
      elements.commitUrl.attr('href', commitUrl)
      const pagePath = `${settings.BASE_URL}/datasets/${fileSlug}/`
      elements.datasetUrl.attr('href', pagePath).text(pagePath)
    }
  }
}
