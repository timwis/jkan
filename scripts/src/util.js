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

export function slugify (text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
}
