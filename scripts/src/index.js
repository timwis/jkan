/*eslint no-new:0*/
/* global settings */
import $ from 'jquery'
import 'jquery-deparam'
import {omit} from 'lodash'

import UserModel from './models/user'
import FileModel from './models/file'
import Navigation from './components/navigation'
import DatasetsList from './components/datasets-list'
import CategoriesFilter from './components/categories-filter'
import OrganizationsFilter from './components/organizations-filter'
import DatasetForm from './components/dataset-form'
import ViewSwitcher from './components/view-switcher'
import {queryByComponent, queryByHook, setParams} from './util'

const params = $.deparam(window.location.search.substr(1))

// Initialize user
const user = new UserModel({
  clientId: params.clientId || settings.GITHUB_CLIENT_ID,
  proxyHost: params.proxyHost || settings.GATEKEEPER_HOST,
  repoOwner: settings.REPO_OWNER,
  repoName: settings.REPO_NAME
})

// If user is mid-login, finish the login process
if (params.code) {
  setParams(omit(params, 'code'))
  user.finishLogin(params.code)
}

// Navigation
const navigationEls = queryByComponent('nav')
navigationEls.each((index, el) => new Navigation({el: $(el), user}))

// Datasets List
const datasetsListEls = queryByComponent('datasets-list')
if (datasetsListEls.length) {
  getDatasets().then((datasets) => {
    datasetsListEls.each((index, el) => new DatasetsList({el: $(el), datasets, params}))
  })
}

// Categories Filter
const categoriesFilterEls = queryByComponent('categories-filter')
if (categoriesFilterEls.length) {
  getDatasets().then((datasets) => {
    categoriesFilterEls.each((index, el) => new CategoriesFilter({el: $(el), datasets, params}))
  })
}

// Organizations Filter
const organizationsFilterEls = queryByComponent('organizations-filter')
if (organizationsFilterEls.length) {
  getDatasets().then((datasets) => {
    organizationsFilterEls.each((index, el) => new OrganizationsFilter({el: $(el), datasets, params}))
  })
}

// Dataset Form
const datasetFormEls = queryByComponent('dataset-form')
if (datasetFormEls.length) {
  datasetFormEls.each((index, el) => {
    const $el = $(el)
    const file = new FileModel({
      user,
      repoOwner: settings.REPO_OWNER,
      repoName: settings.REPO_NAME,
      repoBranch: settings.BRANCH,
      filePath: $el.data('file-path'),
      pageUrl: $el.data('page-url')
    })
    new DatasetForm({el: $el, file})
  })
}

// View Switcher
const viewSwitcherEls = queryByComponent('view-switcher')
viewSwitcherEls.each((index, el) => new ViewSwitcher({el: $(el), params}))

// Show administrator elements if/when logged in and a collaborator
const adminEls = [
  queryByHook('add-dataset-btn'),
  queryByHook('edit-dataset-btn')
]
if (user.username && user.isCollaborator) adminEls.forEach((el) => el.show())
user.on('change', (changedUser) => {
  if (changedUser.username && changedUser.isCollaborator) adminEls.forEach((el) => el.show())
})

let datasetsCache
function getDatasets () {
  datasetsCache = datasetsCache || $.getJSON(`${settings.BASE_URL}/datasets.json`)
  return datasetsCache
}
