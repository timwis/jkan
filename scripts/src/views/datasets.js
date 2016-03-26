/* global settings */
import $ from 'jquery'
import {filter, pick, omit, chain, defaults} from 'lodash'
import 'jquery-deparam'

import {queryByHook, setContent, slugify} from '../util'
import TmplListGroupItem from '../templates/list-group-item'
import TmplDatasetItem from '../templates/dataset-item'

const datasetsPath = `${settings.BASE_URL}/datasets.json`
const params = $.deparam(window.location.search.substr(1))

export default function (opts) {
  const elements = {
    categoriesItems: queryByHook('categories-items', opts.el),
    organizationsItems: queryByHook('organizations-items', opts.el),
    datasetsItems: queryByHook('datasets-items', opts.el),
    datasetsCount: queryByHook('datasets-count', opts.el),
    searchQuery: queryByHook('search-query', opts.el)
  }

  $.getJSON(datasetsPath).done(function (datasets) {
    // Organizations
    const organizations = organizationsWithCount(datasets)
    const organizationsMarkup = organizations.map(TmplListGroupItem)
    setContent(elements.organizationsItems, organizationsMarkup)
    collapseListGroup(elements.organizationsItems)

    // Categories
    const categories = categoriesWithCount(datasets)
    const categoriesMarkup = categories.map(TmplListGroupItem)
    setContent(elements.categoriesItems, categoriesMarkup)
    collapseListGroup(elements.categoriesItems)

    // // Datasets
    const filters = createParamsFilters(pick(params, ['organization', 'category']))
    const filteredDatasets = filter(datasets, filters)
    const datasetsMarkup = filteredDatasets.map(TmplDatasetItem)
    setContent(elements.datasetsItems, datasetsMarkup)

    // // Dataset count
    const datasetsCountMarkup = filteredDatasets.length + ' datasets'
    setContent(elements.datasetsCount, datasetsCountMarkup)

    // // Search datasets listener
    const searchFunction = createSearchFunction(filteredDatasets)
    elements.searchQuery.on('keyup', (e) => {
      const query = e.currentTarget.value

      // Datasets
      const results = searchFunction(query)
      const resultsMarkup = results.map(TmplDatasetItem)
      setContent(elements.datasetsItems, resultsMarkup)

      // Dataset count
      const resultsCountMarkup = results.length + ' datasets'
      setContent(elements.datasetsCount, resultsCountMarkup)
    })
  }).fail(function () {
    console.error('Error fetching', datasetsPath)
  })
}

// Given an array of datasets, returns an array of their organizations with counts
function organizationsWithCount (datasets) {
  return chain(datasets)
    .groupBy('organization')
    .map(function (datasetsInOrg, organization) {
      const filters = createParamsFilters(pick(params, ['category']))
      const filteredDatasets = filter(datasetsInOrg, filters)
      const orgSlug = slugify(organization)
      const selected = params.organization && params.organization === orgSlug
      const itemParams = selected ? omit(params, 'organization') : defaults({organization: orgSlug}, params)
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
  return chain(datasets)
    .filter('category')
    .flatMap(function (value, index, collection) {
      // Explode objects where category is an array into one object per category
      if (typeof value.category === 'string') return value
      const duplicates = []
      value.category.forEach(function (category) {
        duplicates.push(defaults({category: category}, value))
      })
      return duplicates
    })
    .groupBy('category')
    .map(function (datasetsInCat, category) {
      const filters = createParamsFilters(pick(params, ['organization']))
      const filteredDatasets = filter(datasetsInCat, filters)
      const categorySlug = slugify(category)
      const selected = params.category && params.category === categorySlug
      const itemParams = selected ? omit(params, 'category') : defaults({category: categorySlug}, params)
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

// Collapses a bootstrap list-group to only show a few items by default
// Number of items to show can be specified in [data-show] attribute or passed as param
function collapseListGroup (container, show) {
  if (!show) show = container.data('show') || 5

  const itemsToHide = $('.list-group-item:gt(' + (show - 1) + '):not(.active)', container)
  if (itemsToHide) {
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

// Given an object of filters to use, returns a function to be used by _.filter()
function createParamsFilters (filters) {
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

// Returns a function that can be used to search an array of datasets
// The function returns the filtered array of datasets
function createSearchFunction (datasets) {
  const keys = ['title', 'notes']
  return function (query) {
    const lowerCaseQuery = query.toLowerCase()
    return filter(datasets, function (dataset) {
      return keys.reduce(function (previousValue, key) {
        return previousValue || (dataset[key] && dataset[key].toLowerCase().indexOf(lowerCaseQuery) !== -1)
      }, false)
    })
  }
}
