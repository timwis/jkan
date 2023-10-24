import $ from 'jquery'
import {chain, pick, omit, filter, defaults} from 'lodash'

import TmplListGroupItem from '../templates/list-group-item'
import {setContent, slugify, createDatasetFilters, collapseListGroup} from '../util'

export default class {
  constructor (opts) {
    const projects = this._projectsWithCount(opts.datasets, opts.params)
    const projectsMarkup = projects.map(TmplListGroupItem)
    setContent(opts.el, projectsMarkup)
    collapseListGroup(opts.el)
  }

  // Given an array of datasets, returns an array of their projects with counts
  _projectsWithCount (datasets, params) {
    return chain(datasets)
      .filter('project')
      .flatMap(function (value, index, collection) {
        // Explode objects where project is an array into one object per project
        if (typeof value.project === 'string') return value
        const duplicates = []
        value.project.forEach(function (project) {
          duplicates.push(defaults({project: project}, value))
        })
        return duplicates
      })
      .groupBy('project')
      .map(function (datasetsInCat, project) {
        const filters = createDatasetFilters(pick(params, ['organization']))
        const filteredDatasets = filter(datasetsInCat, filters)
        const projectSlug = slugify(project)
        const selected = params.project && params.project === projectSlug
        const itemParams = selected ? omit(params, 'project') : defaults({project: projectSlug}, params)
        return {
          title: project,
          url: '?' + $.param(itemParams),
          count: filteredDatasets.length,
          unfilteredCount: datasetsInCat.length,
          selected: selected
        }
      })
      .orderBy('unfilteredCount', 'desc')
      .value()
  }
}
