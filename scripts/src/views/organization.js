/* global settings */
import {queryByHook, slugify} from '../util'

export default function (opts) {
  const elements = {
    editButton: queryByHook('edit-button', opts.el),
    readView: queryByHook('read-view', opts.el),
    editView: queryByHook('edit-view', opts.el),
    form: queryByHook('organization-form', opts.el),
    cancelButton: queryByHook('cancel-button', opts.el),
    deleteButton: queryByHook('delete-button', opts.el),
    alert: queryByHook('alert', opts.el),
    commitUrl: queryByHook('commit-url', opts.el),
    organizationUrl: queryByHook('organization-url', opts.el)
  }

  // If user is logged in and a collaborator, show the Edit Dataset button
  if (opts.user.username && opts.user.isCollaborator) elements.editButton.show()
  opts.user.on('change', (user) => {
    if (user.username && user.isCollaborator) elements.editButton.show()
  })

  // Edit/Cancel buttons toggle read/edit views
  elements.editButton.add(elements.cancelButton).on('click', (e) => {
    switchView()
    e.preventDefault()
  })

  // Edit form submission
  elements.form.on('submit', function (e) {
    e.preventDefault()

    const formData = elements.form.serializeJSON({useIntKeysAsArrayIndex: true})
    const yaml = opts.file.formatFrontMatter(formData)
    // Ensure title was set (needed to construct filename)
    if (!formData.title) return alert('error')

    // If new file, construct file name
    let command
    let fileSlug
    if (!opts.file.filePath) {
      fileSlug = slugify(formData.title)
      command = opts.file.create(`${fileSlug}.md`, yaml)
    } else {
      command = opts.file.save(yaml)
    }
    command.then((response) => {
      if (elements.readView.length) switchView()
      alert('success', {commitUrl: response.commit.html_url, fileSlug})
    }).catch((msg) => {
      alert('error')
      console.error(msg)
    })
  })

  // Delete button
  elements.deleteButton.on('click', function (e) {
    if (window.confirm('Delete this organization?')) {
      opts.file.remove()
      .then((response) => {
        alert('success', {commitUrl: response.commit.html_url})
      }).catch((msg) => {
        alert('error')
        console.error(msg)
      })
    }
    e.preventDefault()
  })

  function switchView () {
    elements.readView.add(elements.editView).toggle()
  }

  // Show alert box on page
  function alert (type, {commitUrl, fileSlug} = {}) {
    elements.alert.hide()
    $('[data-hook~=alert-' + type +']').show()
    if (type === 'success' && commitUrl) {
      elements.commitUrl.attr('href', commitUrl)
      if (fileSlug) {
        const pagePath = `${settings.BASE_URL}/organizations/${fileSlug}/`
        elements.organizationUrl.attr('href', pagePath).text(pagePath)
      }
    }
  }
}
