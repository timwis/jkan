/* global settings */
import notie from 'notie'
import 'jquery-serializejson'

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

    opts.el.on('submit', (e) => {
      const formData = opts.el.serializeJSON()

      file.read()
      .then((contents) => {
        const newContents = this._updateYamlString(contents, formData)
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

      e.preventDefault()
    })
  }

  _updateYamlString (yamlString, updateObject) {
    for (let key in updateObject) {
      const regex = new RegExp(`^( *${key}: +?).*`, 'm')
      const match = yamlString.match(regex)
      if (match) {
        yamlString = yamlString.replace(regex, match[1] + updateObject[key])
      } else {
        yamlString += `\n${key}: ${updateObject[key]}`
      }
    }
    return yamlString
  }
}
