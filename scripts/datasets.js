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
  container.empty().append(content)
}

function organizationsList (datasets) {
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

function categoriesList (datasets) {
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
  var organizations = organizationsList(datasets)
  var organizationsMarkup = organizations.map(templates.listGroupItem)
  setContent(containers.organizationsItems, organizationsMarkup)

  // Categories
  var categories = categoriesList(datasets)
  var categoriesMarkup = categories.map(templates.listGroupItem)
  setContent(containers.categoriesItems, categoriesMarkup)

  // Datasets
  var datasetsMarkup = datasets.map(templates.datasetItem)
  setContent(containers.datasetsItems, datasetsMarkup)

  var datasetsCountMarkup = datasets.length + ' datasets'
  setContent(containers.datasetsCount, datasetsCountMarkup)
}).fail(function () {
  console.error('Error fetching', datasetsPath)
})
