var yaml = require('js-yaml')
var fs = require('fs')
var slug = require('slug')

var orgs = require('./organizations_all_clean.json')

orgs.forEach(function (org) {
  var filename = 'organizations/' + slug(org.name.toLowerCase()) + '.md'
  org.title = org.name
  delete org.name
  var desc = org.description
  delete org.description
  org.description = desc
  var output = '---\n' + yaml.dump(org) + '---\n'
  // console.log(output)
  fs.writeFileSync(filename, output)
  console.log('wrote', filename)
})

console.log('finished')
