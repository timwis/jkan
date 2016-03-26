import State from 'ampersand-state'
import Github from 'github-api'
import jsyaml from 'js-yaml'

export default State.extend({
  props: {
    oauthToken: 'string',
    repoOwner: 'string',
    repoName: 'string',
    repoBranch: 'string',
    filePath: 'string'
  },
  session: {
    repo: 'object'
  },
  derived: {
    fileName: {
      deps: ['filePath'],
      fn: function () {
        return this.filePath.split('/').pop()
      }
    }
  },
  initialize: function () {
    const github = new Github({
      token: this.oauthToken,
      auth: 'oauth'
    })
    this.repo = github.getRepo(this.repoOwner, this.repoName)
  },
  read: function () {
    return new Promise((resolve, reject) => {
      this.repo.read(this.repoBranch, this.filePath, (err, contents) => {
        if (err) reject(err)
        else resolve(contents)
      })
    })
  },
  save: function (contents) {
    return new Promise((resolve, reject) => {
      var commitMsg = `Updated ${this.fileName}`
      this.repo.write(this.repoBranch, this.filePath, contents, commitMsg, {}, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  },
  formatYaml: function (data) {
    return jsyaml.safeDump(data)
  },
  formatFrontMatter: function (data) {
    return `---\n${this.formatYaml(data).trim()}\n---`
  },
  updateYamlString: function (yamlString, updateObject) {
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
})
