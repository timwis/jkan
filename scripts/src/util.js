import $ from 'jquery'
import {isEmpty} from 'lodash'

export function queryByHook (hook, container) {
  return $('[data-hook~=' + hook + ']', container)
}

export function setContent (container, content) {
  return container.empty().append(content)
}

export function setParams (params) {
  let newUrl = window.location.href.split('?')[0]
  if (!isEmpty(params)) newUrl += '?' + $.param(params)
  else console.log('empty', params)
  window.history.replaceState(null, null, newUrl)
}

// Meant to mimic Jekyll's slugify function
// https://github.com/jekyll/jekyll/blob/master/lib/jekyll/utils.rb#L142
export function slugify (text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^a-zA-Z0-9]/g, '-')  // Replace non-alphanumeric chars with -
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^\-|\-$/i, '')        // Remove leading/trailing hyphen
}
