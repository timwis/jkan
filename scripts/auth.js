/* global $, _, Cookies, Github, settings */
var currentURL = window.location.href
var oauthToken = Cookies.get('oauth-token')
var authCodeMatch = window.location.href.match(/\?code=([a-z0-9]*)/)
var github = new Github()
var repo

// If user has oauth token stored in a cookie, show their username
if (oauthToken) {
  console.log('OAuth Token', oauthToken)
  github = new Github({
    token: oauthToken,
    auth: 'oauth'
  })
  var user = github.getUser()
  user.show(null, function (err, userData) {
    if (err) console.error(err)
    setUserInfo(userData)

    // If user has collaborator access on repo, show edit button
    repo = github.getRepo(settings.REPO_OWNER, settings.REPO_NAME)
    repo.isCollaborator(userData.login, function (err) {
      if (err) $('[data-hook~=edit-button]').hide()
      else $('[data-hook~=edit-button]').show()
    })
  })
// If URL has ?code=XXXX in it, use it to fetch oauth token
} else if (authCodeMatch) {
  var authCode = authCodeMatch[1]
  var authURL = settings.GATEKEEPER_HOST + '/authenticate/' + authCode
  $.getJSON(authURL, function (data) {
    console.log('auth response', data)
    Cookies.set('oauth-token', data.token)
    removeFromURL('?code=' + authCode)
  })
}

// When user clicks login
$('[data-hook~=login-link]').on('click', function (e) {
  var redirectUrl = 'https://github.com/login/oauth/authorize'
  var redirectParams = {
    client_id: settings.GITHUB_CLIENT_ID,
    redirect_uri: currentURL,
    scope: 'public_repo'
  }
  window.location.href = redirectUrl + '?' + $.param(redirectParams)
  e.preventDefault()
})

// When user clicks logout
$('[data-hook~=logout-link]').on('click', function (e) {
  Cookies.remove('oauth-token')
  window.location.reload(true)
  e.preventDefault()
})

function removeFromURL (search) {
  window.location.href = window.location.href.replace(search, '')
}

function setUserInfo (userData) {
  $('[data-hook~=login-link]').hide()
  $('[data-hook~=user-name]').text(userData.login)
  $('[data-hook~=user-dropdown]').removeClass('hidden')
}
