/**
 * Usage:
 * <button data-component="delete-page-button"
 *   data-file-path="_datasets/foo.md">Delete</button>
 */
/* global settings */
import notie from 'notie'

import FileModel from '../models/file'

export default class {
  constructor (opts) {
    const file = new FileModel({
      user: opts.user,
      repoOwner: settings.REPO_OWNER,
      repoName: settings.REPO_NAME,
      repoBranch: settings.REPO_BRANCH,
      filePath: opts.el.data('file-path')
    })

    opts.el.on('click', function (e) {
      notie.confirm('Delete this page?', 'Yes', 'Cancel', () => {
        file.remove()
        .then((response) => {
          const commitUrl = response.commit.html_url
          notie.alert('success', `
            This page has been <a href="${commitUrl}">deleted</a> and is currently being removed.
          `)
        }).catch((msg) => {
          notie.alert('error', 'There was an error deleting the page')
          console.error(msg)
        })
      })
      e.preventDefault()
    })
  }
}
