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
      addResourceBtn: queryByHook('add-resource-btn', opts.el),
      deleteBtn: queryByHook('delete-dataset-btn', opts.el)
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
      let commitMsg

      // If editing existing file
      if (opts.file.filePath) {
        commitMsg = `Updated ${opts.file.fileName}`
      // If creating new file, set file path and page url
      } else {
        if (!formData.title) return notie.alert('error', 'Title is required')
        const fileSlug = slugify(formData.title)
        opts.file.filePath = (settings.DATASETS_DIR ? settings.DATASETS_DIR + '/' : '') + `${fileSlug}.md`
        opts.file.pageUrl = `/datasets/${fileSlug}/`
        commitMsg = `Created ${opts.file.fileName}` // computed by file model when filePath is set
      }

      const yaml = opts.file.formatFrontMatter(formData)
      opts.file.save(yaml, commitMsg)
      .then((response) => {
        const commitUrl = response.commit.html_url
        notie.alert('success', `
          This dataset has been <a href="${commitUrl}">saved</a> and will be
          available momentarily at <a href="${settings.BASE_URL}${opts.file.pageUrl}">${opts.file.pageUrl}</a>.
        `)
      }).catch((msg) => {
        notie.alert('error', 'There was an error saving the dataset')
        console.error(msg)
      })
    })

    // Delete dataset button
    elements.deleteBtn.on('click', function (e) {
      notie.confirm('Delete this dataset?', 'Yes', 'Cancel', () => {
        opts.file.remove()
        .then((response) => {
          const commitUrl = response.commit.html_url
          notie.alert('success', `
            This dataset has been <a href="${commitUrl}">deleted</a> and the page is currently being removed.
          `)
        }).catch((msg) => {
          notie.alert('error', 'There was an error deleting the dataset')
          console.error(msg)
        })
      })
      e.preventDefault()
    })
  }
}
