export function queryByHook (hook, container) {
  const context = container || document
  return Array.from(context.querySelectorAll(`[data-hook~=${hook}]`))
}

export function queryByComponent (component, container) {
  const context = container || document
  return Array.from(context.querySelectorAll(`[data-component~=${component}]`))
}

export function setContent (container, content) {
  const containerList = ensureArray(container)
  const contentString = Array.isArray(content) ? content.join('\n') : content
  containerList.forEach((container) => container.innerHTML = contentString)
}

// Meant to mimic Jekyll's slugify function
// https://github.com/jekyll/jekyll/blob/master/lib/jekyll/utils.rb#L142
export function slugify (text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^a-zA-Z0-9]/g, '-')  // Replace non-alphanumeric chars with -
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^\-|\-$/i, '')        // Remove leading/trailing hyphen
}

// Given an object of filters to use, returns a function to be used by _.filter()
export function createDatasetFilters (filters) {
  return function (dataset) {
    const conditions = []
    if (filters.organization) {
      conditions.push(dataset.organization && slugify(dataset.organization) === filters.organization)
    }
    if (filters.category) {
      conditions.push(dataset.category && slugify(dataset.category).indexOf(filters.category) !== -1)
    }
    return conditions.every(function (value) { return !!value })
  }
}

// Collapses a bootstrap list-group to only show a few items by default
// Number of items to show can be specified in [data-show] attribute or passed as param
export function collapseListGroup (container, numToShow) {
  if (!numToShow) numToShow = +container.dataset.show || 5

  const hideFromIndex = numToShow + 1
  const itemsToHideQuery = `.list-group-item:nth-of-type(n+${hideFromIndex}):not(.active)`
  const itemsToHide = Array.from(container.querySelectorAll(itemsToHideQuery))

  if (itemsToHide.length) {
    hide(itemsToHide)

    const showMoreButton = createShowMoreButton(itemsToHide)
    container.appendChild(showMoreButton)
  }
}

export function param (obj) {
  const params = new URLSearchParams(obj)
  return params.toString()
}

export function hide (els) {
  ensureArray(els).forEach((el) => el.classList.add('hidden'))
}

export function show (els) {
  ensureArray(els).forEach((el) => el.classList.remove('hidden'))
}

export function toggleVisibility (els) {
  ensureArray(els).forEach((el) => el.classList.toggle('hidden'))
}

function ensureArray (item) {
  return Array.isArray(item) ? item : [item]
}

function createShowMoreButton (hiddenItems) {
  const el = document.createElement('a')
  el.classList.add('list-group-item')
  el.setAttribute('href', '#')
  el.textContent = `Show ${hiddenItems.length} more...`
  el.addEventListener('click', function (event) {
    show(hiddenItems)
    this.remove()
    event.preventDefault()
  }, {once: true})

  return el
}
