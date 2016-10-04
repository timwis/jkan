/* global settings */
import $ from 'jquery'
import notie from 'notie'
import 'jquery-serializejson'

import FileModel from '../models/file'
import {queryByHook, updateYamlString} from '../util'

export default class {
  constructor (opts) {
    const file = new FileModel({
      user: opts.user,
      repoOwner: settings.REPO_OWNER,
      repoName: settings.REPO_NAME,
      repoBranch: settings.REPO_BRANCH,
      filePath: opts.el.data('file-path')
    })

    const activateBtn = queryByHook('activate-btn')
    activateBtn.on('click', (e) => {
      const theme = $(e.currentTarget).data('theme')
      file.read()
      .then((contents) => {
        const newContents = updateYamlString(contents, { jkan_theme: theme })
        file.save(newContents)
        .then((response) => {
          const commitUrl = response.commit.html_url
          notie.alert('success', `
          The configuration has been <a href="${commitUrl}">saved</a>
          and the site is regenerating.
        `)
        }).catch((msg) => {
          notie.alert('error', 'There was an error saving the configuration')
          console.error(msg)
        })
      }).catch((err) => console.error(err))
    })
  }
}
