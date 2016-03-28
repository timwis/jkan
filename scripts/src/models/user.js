import State from 'ampersand-state'
import Cookies from 'js-cookie'
import Github from 'github-api'
import $ from 'jquery'
import 'jquery-deparam'

const githubLoginUrl = 'https://github.com/login/oauth/authorize'

export default State.extend({
  props: {
    oauthToken: 'string',
    username: 'string'
  },
  session: {
    clientId: 'string',
    proxyHost: 'string'
  },
  initialize: function () {
    // If login cookies saved, set the user model to them
    this.oauthToken = Cookies.get('oauth-token')
    const userData = Cookies.getJSON('user-data')
    if (userData) this.username = userData.login
  },
  initiateLogin: function () {
    const returnParams = {clientId: this.clientId, proxyHost: this.proxyHost}
    const redirectParams = {
      client_id: this.clientId,
      redirect_uri: window.location.href.split('?')[0] + '?' + $.param(returnParams),
      scope: 'public_repo'
    }
    window.location.href = githubLoginUrl + '?' + $.param(redirectParams)
  },
  finishLogin: function (authCode) {
    this._verify(authCode)
    .then((oauthToken) => {
      this.set('oauthToken', oauthToken)
      Cookies.set('oauth-token', oauthToken)

      this._getUser(oauthToken)
      .then((userData) => {
        this.set('username', userData.login)
        Cookies.set('user-data', userData)
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
    Cookies.remove('oauth-token')
    Cookies.remove('user-data')
  },
  _getUser: function () {
    return new Promise((resolve, reject) => {
      const github = new Github({
        token: this.oauthToken,
        auth: 'oauth'
      })
      const user = github.getUser()
      user.show(null, (err, userData) => {
        if (err) reject(err)
        else resolve(userData)
      })
    })
  }
})
