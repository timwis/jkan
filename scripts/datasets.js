/* global $, _, deparam */

var params = deparam(window.location.search.substr(1))

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
      var itemParams = _.defaults({organization: slugify(organization)}, params)
      return {
        title: organization,
        url: '?' + $.param(itemParams),
        count: datasetsInOrg.length
      }
    })
    .orderBy('count', 'desc')
    .value()
}

function categoriesWithCount (datasets) {
  return _.chain(datasets)
    .filter('category')
    .map('category')
    .flatten() // category can be a string or an array of strings
    .groupBy()
    .map(function (instances, category) {
      var itemParams = _.defaults({category: slugify(category)}, params)
      return {
        title: category,
        url: '?' + $.param(itemParams),
        count: instances.length
      }
    })
    .value()
}

function collapseListGroup (container, show) {
  if (!show) show = container.data('show') || 5

  var itemsToHide = $('.list-group-item:gt(' + (show - 1) + ')', container)
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
  var datasetsMarkup = datasets.map(templates.datasetItem)
  setContent(containers.datasetsItems, datasetsMarkup)

  var datasetsCountMarkup = datasets.length + ' datasets'
  setContent(containers.datasetsCount, datasetsCountMarkup)
}).fail(function () {
  console.error('Error fetching', datasetsPath)
})
