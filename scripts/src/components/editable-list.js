/**
 * Usage:
 * <div data-component="editable-list" data-item-label="category">
 *   <div data-hook="items">
 *     <div data-hook="item">
 *       <button data-hook="remove-item-btn">Remove</button>
 *     </div>
 *   </div>
 *   <button data-hook="add-items-btn">Add</button>
 *   <script type="text/template" data-hook="item-template">
 *   </script>
 * </div>
 */
import $ from 'jquery'
import notie from 'notie'

import {queryByHook} from '../util'

export default class {
  constructor (opts) {
    const elements = {
      itemTemplate: queryByHook('item-template', opts.el),
      items: queryByHook('items', opts.el),
      addBtn: queryByHook('add-item-btn', opts.el)
    }
    const ItemTemplate = elements.itemTemplate.html()
    const itemLabel = opts.el.data('item-label') || 'item'

    // Add button
    elements.addBtn.on('click', function (e) {
      elements.items.append(ItemTemplate)
    })

    // "Remove resource" buttons
    elements.items.on('click', '[data-hook~=remove-item-btn]', (e) => {
      notie.confirm(`Delete this ${itemLabel}?`, 'Yes', 'Cancel', () => {
        $(e.currentTarget).closest('[data-hook~=item]').remove()
      })
    })
  }
}
