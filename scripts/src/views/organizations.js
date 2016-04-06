import {queryByHook} from '../util'

export default function (opts) {
  const elements = {
    addBtn: queryByHook('add-btn', opts.el)
  }

  // If user is logged in and a collaborator, show the Add Dataset button
  if (opts.user.username && opts.user.isCollaborator) elements.addBtn.show()
  opts.user.on('change', (user) => {
    if (user.username && user.isCollaborator) elements.addBtn.show()
  })
}
