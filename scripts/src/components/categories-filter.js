import $ from 'jquery'

import TmplListGroupItem from '../templates/list-group-item'
import {setContent, slugify, createDatasetFilters, groupBy} from '../util'

export default class {
  constructor (opts) {
    const categories = this._categoriesWithCount(opts.datasets, opts.params)
    const categoriesMarkup = categories.map(TmplListGroupItem)
    setContent(opts.el, categoriesMarkup)
  }

  // Given an array of datasets, returns an array of their categories with counts
  _categoriesWithCount (datasets, params) {
    const exploded = datasets
      .filter((dataset) => dataset.category)
      .flatMap(function (value) {
        // Explode objects where category is an array into one object per category
        if (typeof value.category === 'string') return value
        return value.category.map(function (category) {
          return {...value, category: category}
        })
      })
    const categoriesBySlug = groupBy(exploded, 'category')
    return Object.keys(categoriesBySlug).map(function (category) {
      const datasetsInCat = categoriesBySlug[category]
      const filters = createDatasetFilters({organization: params.organization})
      const filteredDatasets = datasetsInCat.filter(filters)
      const categorySlug = slugify(category)
      const selected = params.category && params.category === categorySlug
      const itemParams = selected ? omitKey(params, 'category') : {...params, category: categorySlug}
      return {
        title: category,
        url: '?' + $.param(itemParams),
        count: filteredDatasets.length,
        unfilteredCount: datasetsInCat.length,
        selected: selected
      }
    }).sort((a, b) => b.unfilteredCount - a.unfilteredCount)
  }
}

function omitKey (obj, key) {
  return Object.fromEntries(Object.entries(obj).filter(([entryKey]) => entryKey !== key))
}
