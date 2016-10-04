import State from 'ampersand-state'
import Github from 'github-api'

export default State.extend({
  props: {
    repoOwner: 'string',
    repoName: 'string',
    repoBranch: 'string',
    filePath: 'string',
    renderPath: 'string'
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
      this.repo.getContents(this.repoBranch, this.filePath, true, (err, contents) => {
        if (err) reject(err)
        else resolve(contents)
      })
    })
  },
  save: function (contents, commitMsg) {
    return new Promise((resolve, reject) => {
      if (!commitMsg) commitMsg = `Updated ${this.fileName}`
      this.repo.writeFile(this.repoBranch, this.filePath, contents, commitMsg, {}, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  },
  remove: function () {
    return new Promise((resolve, reject) => {
      this.repo.deleteFile(this.repoBranch, this.filePath, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
})
