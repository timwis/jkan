/* global $, settings, updateConfig, alert, params */
var CLIENT_ID_MAX_LENGTH = 24
var CLIENT_SECRET_WARNING = "That looks too long to be the Client ID. Make sure you don't put the Client Secret here"

var elements = {
  clientId: $('[data-hook~=github-client-id]'),
  appName: $('[data-hook~=app-name]'),
  login: $('[data-hook~=login-link]'),
  save: $('[data-hook~=save]')
}

elements.clientIdParent = elements.clientId.parent()
elements.clientIdHelpBlock = elements.clientId.next('.help-block')

// Monitor length of Client ID to make sure it's not the secret
elements.clientId.keyup(function (e) {
  if ($(this).val().length > CLIENT_ID_MAX_LENGTH) {
    elements.clientIdParent.addClass('has-error')
    elements.clientIdHelpBlock.text(CLIENT_SECRET_WARNING)
  } else {
    elements.clientIdParent.removeClass('has-error')
    elements.clientIdHelpBlock.empty()
  }
})

// When Client ID or App Name changes, put their values into the currentURL
// variable, which is used by the login mechanism, so they'll be returned after login
elements.clientId.add(elements.appName).on('change', function (e) {
  settings.GITHUB_CLIENT_ID = elements.clientId.val()
  settings.GATEKEEPER_HOST = 'https://' + elements.appName.val() + '.herokuapp.com'
  var params = {
    github_client_id: settings.GITHUB_CLIENT_ID,
    gatekeeper_host: settings.GATEKEEPER_HOST
  }
  window.currentURL = window.location.href.split('?')[0] + '?' + $.param(params)
})

// If gatekeeper_host and github_client_id querystring params are present, use them
if (params.gatekeeper_host && params.github_client_id) {
  elements.clientId.val(params.github_client_id)
  elements.appName.val(params.gatekeeper_host.replace('https://', '').replace('.herokuapp.com', ''))
}

elements.save.on('click', function (e) {
  if (params.gatekeeper_host && params.github_client_id) {
    var formData = {
      github_client_id: params.github_client_id,
      gatekeeper_host: params.gatekeeper_host
    }
    updateConfig(formData, function (err, response) {
      if (err) {
        alert('error')
        console.error(err)
      } else {
        alert('success', response.commit.html_url)
      }
    })
  }
})
