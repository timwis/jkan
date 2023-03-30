import $ from 'jquery'

export function queryByHook (hook, container) {
  return $(`[data-hook~=${hook}]`, container)
}

export function queryByComponent (component, container) {
  return $(`[data-component~=${component}]`, container)
}

export function setContent (container, content) {
  return container.empty().append(content)
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
export function collapseListGroup (container, show) {
  if (!show) show = container.data('show') || 5

  const itemsToHide = $('.list-group-item:gt(' + (show - 1) + '):not(.active)', container)
  if (itemsToHide.length) {
    itemsToHide.hide()

    const showMoreButton = $('<a href="#" class="list-group-item">Show ' + itemsToHide.length + ' more...</a>')
    showMoreButton.on('click', function (e) {
      itemsToHide.show()
      $(this).off('click')
      $(this).remove()
      e.preventDefault()
    })
    container.append(showMoreButton)
  }
}
