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
