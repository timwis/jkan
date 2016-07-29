import State from 'ampersand-state'
import Cookies from 'js-cookie'
import Github from 'github-api'
import $ from 'jquery'
import 'jquery-deparam'

const githubLoginUrl = 'https://github.com/login/oauth/authorize'

export default State.extend({
  props: {
    oauthToken: 'string',
    username: 'string',
    isCollaborator: 'boolean'
  },
  session: {
    repoOwner: 'string',
    repoName: 'string',
    clientId: 'string',
    proxyHost: 'string'
  },
  initialize: function () {
    // If login cookies saved, set the user model to them
    this.set(Cookies.getJSON('jkan'))
  },
  initiateLogin: function () {
    const redirectParams = {
      client_id: this.clientId,
      redirect_uri: window.location.href.split('?')[0],
      scope: 'public_repo'
    }
    window.location.href = githubLoginUrl + '?' + $.param(redirectParams)
  },
  finishLogin: function (authCode) {
    return this._verify(authCode)
    .then((oauthToken) => {
      this.set('oauthToken', oauthToken)
      Cookies.set('jkan', this.serialize())

      this._getUser(oauthToken)
      .then((userData) => {
        this.set('username', userData.login)
        Cookies.set('jkan', this.serialize())
        this._isCollaborator(userData.login)
        .then(() => {
          this.set('isCollaborator', true)
          Cookies.set('jkan', this.serialize())
        }).catch(() => {
          this.set('isCollaborator', false)
          Cookies.set('jkan', this.serialize())
        })
      }).catch(() => console.error('Error fetching user info'))
    }).catch(() => console.error('Error verifying auth code'))
  },
  // Use authCode from step 1 to fetch auth token
  _verify: function (authCode) {
    return new Promise((resolve, reject) => {
      const proxyUrl = `${this.proxyHost}/authenticate/${authCode}`

      $.getJSON(proxyUrl, (data) => {
        if (data && data.token) {
          resolve(data.token)
        } else {
          reject('Authentication failed')
        }
      })
    })
  },
  logout: function () {
    Cookies.remove('jkan')
  },
  _getUser: function () {
    return new Promise((resolve, reject) => {
      const github = new Github({
        token: this.oauthToken,
        auth: 'oauth'
      })
      const user = github.getUser()
      user.getProfile((err, userData) => {
        if (err) reject(err)
        else resolve(userData)
      })
    })
  },
  _isCollaborator: function (username) {
    return new Promise((resolve, reject) => {
      const github = new Github({
        token: this.oauthToken,
        auth: 'oauth'
      })
      const repo = github.getRepo(this.repoOwner, this.repoName)
      repo.isCollaborator(username, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }
})
