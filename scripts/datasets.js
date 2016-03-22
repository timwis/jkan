/* global $, _, deparam */

var params = deparam(window.location.search.substr(1))

_.templateSettings.variable = 'data'

var templates = {
  listGroupItem: _.template($('[data-hook=tmpl-list-group-item]').html()),
  datasetItem: _.template($('[data-hook=tmpl-dataset-item]').html())
}

var elements = {
  categoriesItems: queryByHook('categories-items'),
  organizationsItems: queryByHook('organizations-items'),
  datasetsItems: queryByHook('datasets-items'),
  datasetsCount: queryByHook('datasets-count'),
  searchQuery: queryByHook('search-query')
}

var datasetsPath = '../datasets.json'
$.getJSON(datasetsPath).done(function (datasets) {
  // Organizations
  var organizations = organizationsWithCount(datasets)
  var organizationsMarkup = organizations.map(templates.listGroupItem)
  setContent(elements.organizationsItems, organizationsMarkup)
  collapseListGroup(elements.organizationsItems)

  // Categories
  var categories = categoriesWithCount(datasets)
  var categoriesMarkup = categories.map(templates.listGroupItem)
  setContent(elements.categoriesItems, categoriesMarkup)
  collapseListGroup(elements.categoriesItems)

  // Datasets
  var filters = createParamsFilters(_.pick(params, ['organization', 'category']))
  var filteredDatasets = _.filter(datasets, filters)
  var datasetsMarkup = filteredDatasets.map(templates.datasetItem)
  setContent(elements.datasetsItems, datasetsMarkup)

  // Dataset count
  var datasetsCountMarkup = filteredDatasets.length + ' datasets'
  setContent(elements.datasetsCount, datasetsCountMarkup)

  // Search datasets listener
  var searchFunction = createSearchFunction(filteredDatasets)
  elements.searchQuery.on('keyup', function (e) {
    var query = e.currentTarget.value

    // Datasets
    var results = searchFunction(query)
    var resultsMarkup = results.map(templates.datasetItem)
    setContent(elements.datasetsItems, resultsMarkup)

    // Dataset count
    var resultsCountMarkup = results.length + ' datasets'
    setContent(elements.datasetsCount, resultsCountMarkup)
  })
}).fail(function () {
  console.error('Error fetching', datasetsPath)
})

function queryByHook (hook) {
  return $('[data-hook~=' + hook + ']')
}

// Given an array of datasets, returns an array of their organizations with counts
function organizationsWithCount (datasets) {
  return _.chain(datasets)
    .groupBy('organization')
    .map(function (datasetsInOrg, organization) {
      var filters = createParamsFilters(_.pick(params, ['category']))
      var filteredDatasets = _.filter(datasetsInOrg, filters)
      var slug = slugify(organization)
      var selected = params.organization && params.organization === slug
      var itemParams = selected ? _.omit(params, 'organization') : _.defaults({organization: slug}, params)
      return {
        title: organization,
        url: '?' + $.param(itemParams),
        count: filteredDatasets.length,
        unfilteredCount: datasetsInOrg.length,
        selected: selected
      }
    })
    .orderBy('unfilteredCount', 'desc')
    .value()
}

// Given an array of datasets, returns an array of their categories with counts
function categoriesWithCount (datasets) {
  return _.chain(datasets)
    .filter('category')
    .flatMap(function (value, index, collection) {
      // Explode objects where category is an array into one object per category
      if (typeof value.category === 'string') return value
      var duplicates = []
      value.category.forEach(function (category) {
        duplicates.push(_.defaults({category: category}, value))
      })
      return duplicates
    })
    .groupBy('category')
    .map(function (datasetsInCat, category) {
      var filters = createParamsFilters(_.pick(params, ['organization']))
      var filteredDatasets = _.filter(datasetsInCat, filters)
      var slug = slugify(category)
      var selected = params.category && params.category === slug
      var itemParams = selected ? _.omit(params, 'category') : _.defaults({category: slug}, params)
      return {
        title: category,
        url: '?' + $.param(itemParams),
        count: filteredDatasets.length,
        unfilteredCount: datasetsInCat.length,
        selected: selected
      }
    })
    .orderBy('unfilteredCount', 'desc')
    .value()
}

function setContent (container, content) {
  return container.empty().append(content)
}

// Collapses a bootstrap list-group to only show a few items by default
// Number of items to show can be specified in [data-show] attribute or passed as param
function collapseListGroup (container, show) {
  if (!show) show = container.data('show') || 5

  var itemsToHide = $('.list-group-item:gt(' + (show - 1) + '):not(.active)', container)
  if (itemsToHide) {
    itemsToHide.hide()

    var showMoreButton = $('<a href="#" class="list-group-item">Show ' + itemsToHide.length + ' more...</a>')
    showMoreButton.on('click', function (e) {
      itemsToHide.show()
      $(this).off('click')
      $(this).remove()
      e.preventDefault()
    })
    container.append(showMoreButton)
  }
}

// Given an object of filters to use, returns a function to be used by _.filter()
function createParamsFilters (filters) {
  return function (dataset) {
    var conditions = []
    if (filters.organization) {
      conditions.push(dataset.organization && slugify(dataset.organization) === filters.organization)
    }
    if (filters.category) {
      conditions.push(dataset.category && slugify(dataset.category).indexOf(filters.category) !== -1)
    }
    return conditions.every(function (value) { return !!value })
  }
}

function slugify (text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
}

// Returns a function that can be used to search an array of datasets
// The function returns the filtered array of datasets
function createSearchFunction (datasets) {
  var keys = ['title', 'notes']
  return function (query) {
    var lowerCaseQuery = query.toLowerCase()
    return _.filter(datasets, function (dataset) {
      return keys.reduce(function (previousValue, key) {
        return previousValue || (dataset[key] && dataset[key].toLowerCase().indexOf(lowerCaseQuery) !== -1)
      }, false)
    })
  }
}
