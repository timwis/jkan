/**
 * Usage:
 * <form data-component="form"
 *   data-file-dir="_datasets"
 *   data-render-dir="datasets"
 *   data-file-path="_datasets/foo.md"
 *   data-render-path="/datasets/foo/"
 */
/* global settings */
import notie from 'notie'
import 'jquery-serializejson'

import FileModel from '../models/file'
import {slugify} from '../util'

export default class {
  constructor (opts) {
    const file = new FileModel({
      user: opts.user,
      repoOwner: settings.REPO_OWNER,
      repoName: settings.REPO_NAME,
      repoBranch: settings.REPO_BRANCH,
      filePath: opts.el.data('file-path'),
      renderPath: opts.el.data('render-path')
    })
    const fileDir = opts.el.data('file-dir')
    const renderDir = opts.el.data('render-dir')

    opts.el.on('submit', function (e) {
      e.preventDefault()
      const formData = opts.el.serializeJSON({useIntKeysAsArrayIndex: true})
      let commitMsg

      // If editing existing file
      if (file.filePath) {
        commitMsg = `Updated ${file.fileName}`
      // If creating new file, set file path and page url
      } else {
        if (!formData.title) return notie.alert('error', 'Title is required')
        const fileSlug = slugify(formData.title)
        file.filePath = (fileDir ? fileDir + '/' : '') + `${fileSlug}.md`
        file.renderPath = `/${renderDir}/${fileSlug}/`
        commitMsg = `Created ${file.fileName}` // computed by file model when filePath is set
      }

      const yaml = file.formatFrontMatter(formData)
      file.save(yaml, commitMsg)
      .then((response) => {
        const commitUrl = response.commit.html_url
        notie.alert('success', `
          This page has been <a href="${commitUrl}">saved</a> and will be
          available momentarily at <a href="${settings.BASE_URL}${file.renderPath}">${file.renderPath}</a>.
        `)
      }).catch((msg) => {
        notie.alert('error', 'There was an error saving the page')
        console.error(msg)
      })
    })
  }
}
