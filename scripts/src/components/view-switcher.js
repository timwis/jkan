/**
 * Usage:
 * Append ?view=edit querystring to URL to toggle views. If querystring
 * isn't present, the first view is shown.
 * Requires CSS rule: [data-component~=view-switcher] [data-hook~=view] {display: none;}
 *
 * <div data-component="view-switcher">
 *   <div data-hook="view" data-view="display"></div>
 *   <div data-hook="view" data-view="edit"></div>
 * </div>
 */
import $ from 'jquery'

export default class {
  constructor (opts) {
    if (opts.params.view) {
      $(`[data-hook~=view][data-view~=${opts.params.view}]`).show()
    } else {
      $(`[data-hook~=view][data-view]:first`).show()
    }
  }
}
