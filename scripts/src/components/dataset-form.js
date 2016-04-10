import $ from 'jquery'
import 'select2'
import 'jquery-serializejson'
import notie from 'notie'

import {queryByHook} from '../util'

export default class {
  constructor (opts) {
    const elements = {
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
  }
}
