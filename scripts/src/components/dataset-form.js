/* global settings */
import $ from 'jquery'
import 'select2'
import 'jquery-serializejson'
import notie from 'notie'

import {queryByHook, slugify} from '../util'

export default class {
  constructor (opts) {
    const elements = {
      form: opts.el, // the component itself is the form
      tmplResourceRow: queryByHook('tmpl-resource-row'),
      select2: $('.select2', opts.el),
      resourceRows: queryByHook('resource-rows', opts.el),
      addResourceBtn: queryByHook('add-resource-btn', opts.el)
    }
    const TmplResourceRow = elements.tmplResourceRow.html()

    // Initialize select2 plugin
    elements.select2.select2()

    // Add resource button
    elements.addResourceBtn.on('click', function (e) {
      elements.resourceRows.append(TmplResourceRow)
    })

    // "Remove resource" buttons
    elements.resourceRows.on('click', '[data-hook~=remove-resource-btn]', (e) => {
      notie.confirm('Delete this resource?', 'Yes', 'Cancel', () => {
        $(e.currentTarget).closest('[data-hook~=resource-row]').remove()
      })
    })

    // Form submission
    elements.form.on('submit', function (e) {
      e.preventDefault()
      const formData = elements.form.serializeJSON({useIntKeysAsArrayIndex: true})
      if (!formData.title) {
        notie.alert('error', 'Title is required')
        return
      }
      const yaml = opts.file.formatFrontMatter(formData)
      const fileSlug = slugify(formData.title)

      opts.file.create(`${fileSlug}.md`, yaml)
      .then((response) => {
        const commitUrl = response.commit.html_url
        const pagePath = `${settings.BASE_URL}/datasets/${fileSlug}/`
        notie.alert('success', `
          This dataset has been <a href="${commitUrl}">created</a> and the page is currently generating.<br>
          It will be available momentarily at <a href="${pagePath}">${pagePath}</a>.
        `)
      }).catch((msg) => {
        notie.alert('error', msg)
        console.error(msg)
      })
    })
  }
}
