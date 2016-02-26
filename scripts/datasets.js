/* global $, _, deparam */

var params = deparam(window.location.search.substr(1))

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

_.templateSettings.variable = 'data'

var templates = {
  listGroupItem: _.template($('[data-hook=tmpl-list-group-item]').html()),
  datasetItem: _.template($('[data-hook=tmpl-dataset-item]').html())
}

function queryByHook (hook) {
  return $('[data-hook~=' + hook + ']')
}

var containers = {
  categoriesItems: queryByHook('categories-items'),
  organizationsItems: queryByHook('organizations-items'),
  datasetsItems: queryByHook('datasets-items'),
  datasetsCount: queryByHook('datasets-count')
}

function setContent (container, content) {
  return container.empty().append(content)
}

function organizationsWithCount (datasets) {
  return _.chain(datasets)
    .groupBy('organization')
    .map(function (datasetsInOrg, organization) {
      var filters = createParamsFilters(_.pick(params, ['category']))
      var filteredDatasets = _.filter(datasetsInOrg, filters)
      var slug = slugify(organization)
      var itemParams = _.defaults({organization: slug}, params)
      return {
        title: organization,
        url: '?' + $.param(itemParams),
        count: filteredDatasets.length,
        unfilteredCount: datasetsInOrg.length,
        selected: params.organization === slug
      }
    })
    .orderBy('unfilteredCount', 'desc')
    .value()
}

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
      var itemParams = _.defaults({category: slug}, params)
      return {
        title: category,
        url: '?' + $.param(itemParams),
        count: filteredDatasets.length,
        unfilteredCount: datasetsInCat.length,
        selected: params.category === slug
      }
    })
    .orderBy('unfilteredCount', 'desc')
    .value()
}

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

function slugify (text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text
}

var datasetsPath = '../datasets.json'
$.getJSON(datasetsPath).done(function (datasets) {
  // Organizations
  var organizations = organizationsWithCount(datasets)
  var organizationsMarkup = organizations.map(templates.listGroupItem)
  setContent(containers.organizationsItems, organizationsMarkup)
  collapseListGroup(containers.organizationsItems)

  // Categories
  var categories = categoriesWithCount(datasets)
  var categoriesMarkup = categories.map(templates.listGroupItem)
  setContent(containers.categoriesItems, categoriesMarkup)
  collapseListGroup(containers.categoriesItems)

  // Datasets
  var filters = createParamsFilters(_.pick(params, ['organization', 'category']))
  var filteredDatasets = _.filter(datasets, filters)
  console.log(filteredDatasets)
  var datasetsMarkup = filteredDatasets.map(templates.datasetItem)
  setContent(containers.datasetsItems, datasetsMarkup)

  var datasetsCountMarkup = datasets.length + ' datasets'
  setContent(containers.datasetsCount, datasetsCountMarkup)
}).fail(function () {
  console.error('Error fetching', datasetsPath)
})
