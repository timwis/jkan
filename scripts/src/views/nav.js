import 'bootstrap/js/dropdown'

import {queryByHook} from '../util'

export default function (opts) {
  opts || (opts = {})
  const elements = {
    loginLink: queryByHook('login-link', opts.el),
    logoutLink: queryByHook('logout-link', opts.el),
    userName: queryByHook('user-name', opts.el),
    userDropdown: queryByHook('user-dropdown', opts.el)
  }

  elements.loginLink.on('click', function (e) {
    opts.user.initiateLogin()
    e.preventDefault()
  })

  elements.logoutLink.on('click', function (e) {
    opts.user.logout()
    window.location.reload(true)
    e.preventDefault()
  })

  if (opts.user.username) setUserInfo(opts.user)
  opts.user.on('change:username', setUserInfo)

  function setUserInfo (user) {
    elements.loginLink.hide()
    elements.userName.text(user.username)
    elements.userDropdown.removeClass('hidden')
  }
}
