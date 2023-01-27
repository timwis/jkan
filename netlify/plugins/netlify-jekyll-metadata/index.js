import fs from 'node:fs'

export const onPreBuild = async function () {
  const siteUrl = process.env.URL
  const repoUrl = new URL(process.env.REPOSITORY_URL || '')
  const repoNameWithOwner = repoUrl.pathname.replace(/^\/+/, '')
  const branch = process.env.BRANCH
  
  const fileContents = `
repository: ${repoNameWithOwner}
url: ${siteUrl}
branch: ${branch}
baseurl: ""
`
  const fileName = '_config.ci.yml'
  return fs.promises.writeFile(fileName, fileContents.trim())
}
