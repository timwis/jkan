import {queryByHook} from '../util'

var clientIdMaxLength = 24
var clientSecretWarning = `That looks too long to be the Client ID.
  Make sure you don't put the Client Secret here`

export default function (opts) {
  opts || (opts = {})

  const elements = {
    clientId: queryByHook('github-client-id', opts.el),
    appName: queryByHook('app-name', opts.el),
    loginBtn: queryByHook('login-link', opts.el),
    saveBtn: queryByHook('save', opts.el),
    alert: queryByHook('alert', opts.el),
    commitUrl: queryByHook('commit-url', opts.el)
  }

  elements.clientIdParent = elements.clientId.parent()
  elements.clientIdHelpBlock = elements.clientId.next('.help-block')

  // If logged in already, only show the save button
  if (opts.clientId && opts.proxyHost) {
    elements.clientId.val(opts.user.clientId).attr('disabled', true)
    elements.appName.val(getAppName(opts.user.proxyHost)).attr('disabled', true)
    elements.saveBtn.removeClass('disabled')
  }

  if (opts.user.username) disableSignOn(opts.user.username)
  opts.user.on('change:username', (userModel) => disableSignOn(userModel.username))

  // Monitor length of Client ID to make sure it's not the secret
  elements.clientId.keyup((e) => {
    if (elements.clientId.length > clientIdMaxLength) {
      elements.clientIdParent.addClass('has-error')
      elements.clientIdHelpBlock.text(clientSecretWarning)
    } else {
      elements.clientIdParent.removeClass('has-error')
      elements.clientIdHelpBlock.empty()
    }
  })

  elements.loginBtn.on('click', function (e) {
    const clientId = elements.clientId.val()
    const appName = elements.appName.val()
    if (clientId && appName) {
      opts.user.clientId = clientId
      opts.user.proxyHost = `https://${appName}.herokuapp.com`
      opts.user.initiateLogin()
    }
    e.preventDefault()
  })

  elements.saveBtn.on('click', function (e) {
    const formData = {
      github_client_id: elements.clientId.val(),
      gatekeeper_host: `https://${elements.appName.val()}.herokuapp.com`
    }
    opts.file.read()
    .then((contents) => {
      const newContents = opts.file.updateYamlString(contents, formData)
      opts.file.save(newContents)
      .then((response) => {
        alert('success', response.commit.html_url)
      }).catch((msg) => {
        alert('error')
        console.error(msg)
      })
    }).catch((err) => console.error(err))

    e.preventDefault()
  })

  function disableSignOn (username) {
    elements.loginBtn.addClass('disabled').text(`Signed in as ${username}`)
  }

  // Show alert box on page
  function alert (type, commitUrl) {
    elements.alert.hide()
    $('[data-hook~=alert-' + type +']').show()
    if (type === 'success' && commitUrl) {
      elements.commitUrl.attr('href', commitUrl)
    }
  }
}

// Extract first subdomain from a url
function getAppName (url) {
  const match = url.match(/^https?:\/\/([\dA-Za-z-]+)/)
  return match ? match[1] : ''
}
