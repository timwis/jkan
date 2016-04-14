import $ from 'jquery'

import {queryByHook} from '../util'

export default class {
  constructor (opts) {
    const elements = {
      resourceItem: queryByHook('resource-item', opts.el)
    }

    // Resource details links
    elements.resourceItem.each((index, item) => {
      if ($('table tr', item).length) {
        queryByHook('show-resource-details', item).show()
      }
    })
    elements.resourceItem.on('click', '[data-hook~=show-resource-details]', (e) => {
      $(e.currentTarget).closest('[data-hook~=resource-item]').children('[data-hook~=resource-details]').toggle()
      e.preventDefault()
    })
  }
}
