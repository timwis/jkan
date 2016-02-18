var yaml = require('js-yaml')
var fs = require('fs')

var datasets = require('./reordered.json')

datasets.forEach(function (dataset) {
  var filename = 'datasets/' + dataset.name + '.md'
  delete dataset.name
  var output = '---\n' + yaml.dump(dataset) + '---\n'
  fs.writeFileSync(filename, output)
  console.log('wrote', filename)
})

console.log('finished')
