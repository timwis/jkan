import State from 'ampersand-state'
import Github from 'github-api'
import jsyaml from 'js-yaml'

export default State.extend({
  props: {
    repoOwner: 'string',
    repoName: 'string',
    repoBranch: 'string',
    filePath: 'string',
    pageUrl: 'string'
  },
  session: {
    user: 'state'
  },
  derived: {
    fileName: {
      deps: ['filePath'],
      fn: function () {
        return this.filePath.split('/').pop()
      }
    },
    repo: {
      deps: ['user.oauthToken', 'repoOwner', 'repoName'],
      fn: function () {
        const github = new Github({
          token: this.user.oauthToken,
          auth: 'oauth'
        })
        return github.getRepo(this.repoOwner, this.repoName)
      }
    }
  },
  read: function () {
    return new Promise((resolve, reject) => {
      this.repo.read(this.repoBranch, this.filePath, (err, contents) => {
        if (err) reject(err)
        else resolve(contents)
      })
    })
  },
  save: function (contents, commitMsg) {
    return new Promise((resolve, reject) => {
      if (!commitMsg) commitMsg = `Updated ${this.fileName}`
      this.repo.write(this.repoBranch, this.filePath, contents, commitMsg, {}, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  },
  remove: function () {
    return new Promise((resolve, reject) => {
      this.repo.remove(this.repoBranch, this.filePath, (err, data) => {
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
