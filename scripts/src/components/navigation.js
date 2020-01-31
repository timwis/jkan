import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/tooltip'
import 'bootstrap/js/dist/popover'
import 'bootstrap/js/dist/collapse'

import {queryByHook} from '../util'

export default class {
  constructor (opts) {
    const elements = {
      loginLink: queryByHook('login-link', opts.el),
      logoutLink: queryByHook('logout-link', opts.el),
      adminLinkListItem: queryByHook('admin-link-list-item', opts.el),
      userName: queryByHook('user-name', opts.el),
      userDropdown: queryByHook('user-dropdown', opts.el),
      userDropdownLink: queryByHook('user-dropdown-link', opts.el),
      userIssue: queryByHook('user-issue', opts.el)
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

    if (opts.user.username) this._setUserInfo(opts.user, elements)
    opts.user.on('change', (user) => {
      if (user.username) this._setUserInfo(user, elements)
    })
  }

  _setUserInfo (user, elements) {
    elements.loginLink.hide()
    elements.userName.text(user.username)
    elements.userDropdown.removeClass('hidden')
    if (user.isCollaborator) {
      elements.adminLinkListItem.show()
    } else if (user.isCollaborator === false) { // don't catch undefined
      elements.userIssue.show()
      elements.userDropdownLink.popover({
        content: 'You do not have collaborator access to this repository, so you will not be able to make any changes.',
        placement: 'bottom',
        trigger: 'hover',
        container: 'body'
      })
    }
  }
}
