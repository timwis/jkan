/* global settings */
import $ from 'jquery'
import 'jquery-deparam'
import {omit} from 'lodash'

import UserModel from './models/user'
import FileModel from './models/file'
import NavView from './views/nav'
import DatasetsView from './views/datasets'
import DatasetView from './views/dataset'
import AdminView from './views/admin'
import SetupView from './views/setup'
import {queryByHook, setParams} from './util'

const params = $.deparam(window.location.search.substr(1))

const elements = {
  main: queryByHook('main'),
  nav: queryByHook('nav')
}

const user = new UserModel({
  clientId: params.clientId || settings.GITHUB_CLIENT_ID,
  proxyHost: params.proxyHost || settings.GATEKEEPER_HOST
})

// If user is mid-login, finish the login process
if (params.code) {
  setParams(omit(params, ['code', 'clientId', 'proxyHost']))
  user.finishLogin(params.code)
}

// Always initialize nav view
NavView({el: elements.nav, user})

const router = {
  routes: {
    '/datasets/(.+)/': function () {
      const file = new FileModel({
        oauthToken: user.oauthToken,
        repoOwner: settings.REPO_OWNER,
        repoName: settings.REPO_NAME,
        repoBranch: settings.BRANCH,
        filePath: settings.FILE_PATH
      })
      DatasetView({el: elements.main, file})
    },
    '/datasets/': function () {
      DatasetsView({el: elements.main})
    },
    '/admin/': function () {
      const file = new FileModel({
        oauthToken: user.oauthToken,
        repoOwner: settings.REPO_OWNER,
        repoName: settings.REPO_NAME,
        repoBranch: settings.BRANCH,
        filePath: '_config.yml'
      })
      AdminView({el: elements.main, file})
    },
    '/setup/': function () {
      const file = new FileModel({
        oauthToken: user.oauthToken,
        repoOwner: settings.REPO_OWNER,
        repoName: settings.REPO_NAME,
        repoBranch: settings.BRANCH,
        filePath: '_config.yml'
      })
      SetupView({
        el: elements.main,
        file,
        user,
        clientId: params.clientId,
        proxyHost: params.proxyHost
      })
    }
  },
  route: function (pageUrl) {
    for (let route in this.routes) {
      if ((new RegExp(route)).test(pageUrl)) {
        this.routes[route]()
        break
      }
    }
  }
}

router.route(settings.PAGE_URL)
