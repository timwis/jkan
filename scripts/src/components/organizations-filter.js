import $ from 'jquery'

import TmplListGroupItem from '../templates/list-group-item'
import {setContent, slugify, createDatasetFilters, groupBy} from '../util'

export default class {
  constructor (opts) {
    const organizations = this._organizationsWithCount(opts.datasets, opts.params)
    const organizationsMarkup = organizations.map(TmplListGroupItem)
    setContent(opts.el, organizationsMarkup)
  }

  _organizationsWithCount (datasets, params) {
    const organizationsBySlug = groupBy(datasets, 'organization')
    return Object.keys(organizationsBySlug).map(function (organization) {
      const datasetsInOrg = organizationsBySlug[organization]
      const filters = createDatasetFilters({category: params.category})
      const filteredDatasets = datasetsInOrg.filter(filters)
      const orgSlug = slugify(organization)
      const selected = params.organization && params.organization === orgSlug
      const itemParams = selected ? omitKey(params, 'organization') : {...params, organization: orgSlug}
      return {
        title: organization,
        url: '?' + $.param(itemParams),
        count: filteredDatasets.length,
        unfilteredCount: datasetsInOrg.length,
        selected: selected
      }
    }).sort((a, b) => b.unfilteredCount - a.unfilteredCount)
  }
}

function omitKey (obj, key) {
  return Object.fromEntries(Object.entries(obj).filter(([entryKey]) => entryKey !== key))
}
