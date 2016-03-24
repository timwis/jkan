/* global $, _, deparam, Cookies, Github, settings */
var GITHUB_LOGIN_URL = 'https://github.com/login/oauth/authorize'
var oauthToken = Cookies.get('oauth-token')
var params = deparam(window.location.search.substr(1))
var github = new Github()
window.currentURL = window.location.href

// If user has oauth token stored in a cookie, show their username
if (oauthToken && oauthToken !== 'undefined') {
  console.log('OAuth Token', oauthToken)
  github = new Github({
    token: oauthToken,
    auth: 'oauth'
  })
  var user = github.getUser()
  user.show(null, function (err, userData) {
    if (err) console.error(err)
    setUserInfo(userData)
  })
// If URL has ?code=XXXX in it, use it to fetch oauth token
} else if (params.code) {
  var authHost = params.gatekeeper_host || settings.GATEKEEPER_HOST
  var authURL = authHost + '/authenticate/' + params.code
  $.getJSON(authURL, function (data) {
    console.log('auth response', data)
    Cookies.set('oauth-token', data.token)
    removeFromURL('code')
  })
}

// When user clicks login
$('[data-hook~=login-link]').on('click', function (e) {
  var redirectParams = {
    client_id: settings.GITHUB_CLIENT_ID,
    redirect_uri: window.currentURL,
    scope: 'public_repo'
  }
  window.location.href = GITHUB_LOGIN_URL + '?' + $.param(redirectParams)
  e.preventDefault()
})

// When user clicks logout
$('[data-hook~=logout-link]').on('click', function (e) {
  Cookies.remove('oauth-token')
  window.location.reload(true)
  e.preventDefault()
})

function removeFromURL (property) {
  delete params[property]
  var newParamString = $.param(params)
  window.location.search = newParamString ? ('?' + newParamString) : ''
}

function setUserInfo (userData) {
  $('[data-hook~=login-link]').hide()
  $('[data-hook~=user-name]').text(userData.login)
  $('[data-hook~=user-dropdown]').removeClass('hidden')
}
