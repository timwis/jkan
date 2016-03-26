import $ from 'jquery'

export function queryByHook (hook, container) {
  return $('[data-hook~=' + hook + ']', container)
}

export function setContent (container, content) {
  return container.empty().append(content)
}

export function setParams (params) {
  const newUrl = `${window.location.href.split('?')[0]}?${$.param(params)}`
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
