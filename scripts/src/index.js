/* global settings */
import 'core-js/actual'
import $ from 'jquery'
import 'jquery-deparam'
import 'bootstrap/js/dist/collapse'

import DatasetsList from './components/datasets-list'
import CategoriesFilter from './components/categories-filter'
import OrganizationsFilter from './components/organizations-filter'
import DatasetDisplay from './components/dataset-display'
import {queryByComponent} from './util'

const params = $.deparam(window.location.search.substr(1))

// Helper function to ensure datasets.json is only fetched once per page
let datasetsCache
function getDatasets () {
  datasetsCache = datasetsCache || $.getJSON(`${settings.BASE_URL}/datasets.json`)
  return datasetsCache
}

// Check for these components on the page and initialize them
const components = [
  {tag: 'dataset-display', class: DatasetDisplay},
  {tag: 'datasets-list', class: DatasetsList, usesDatasets: true},
  {tag: 'categories-filter', class: CategoriesFilter, usesDatasets: true},
  {tag: 'organizations-filter', class: OrganizationsFilter, usesDatasets: true}
]
for (let component of components) {
  const els = queryByComponent(component.tag)
  if (els.length) {
    // If the component depends on datasets.json, fetch it first (once per page) and pass it
    if (component.usesDatasets) {
      getDatasets().then((datasets) => {
        els.each((index, el) => new component.class({el: $(el), params, datasets})) // eslint-disable-line
      })
    // Otherwise simply initialize the component
    } else {
      els.each((index, el) => new component.class({el: $(el), params})) // eslint-disable-line
    }
  }
}
