import $ from 'jquery'
import {chain, pick, omit, filter, defaults} from 'lodash'

import TmplListGroupItem from '../templates/list-group-item'
import {setContent, slugify, createDatasetFilters, collapseListGroup} from '../util'

export default class {
  constructor (opts) {
    const organizations = this._organizationsWithCount(opts.datasets, opts.params)
    const organizationsMarkup = organizations.map(TmplListGroupItem)
    setContent(opts.el, organizationsMarkup)
    collapseListGroup(opts.el)
  }

  _organizationsWithCount (datasets, params) {
    return chain(datasets)
      .groupBy('organization')
      .map(function (datasetsInOrg, organization) {
        const filters = createDatasetFilters(pick(params, ['category']))
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
}
