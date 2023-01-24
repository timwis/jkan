import fs from 'node:fs'
import url from 'node:url'

export const onPreBuild = async function () {
  const siteUrl = process.env.URL
  const repoUrl = new URL(process.env.REPOSITORY_URL || '')
  const repoNameWithOwner = repoUrl.pathname.replace(/^\/+/, '')
  
  const fileName = '_config_override.yml'
  const fileContents = `repository: ${repoNameWithOwner}\nurl: ${siteUrl}`
  return fs.promises.writeFile(fileName, fileContents)
}
