var datasets = require('./datasets_topic_case.json')

var results = datasets.map(function (dataset) {
  var resources = dataset.resources
  delete dataset.resources
  if (resources) dataset.resources = resources
  return dataset
})

console.log(JSON.stringify(results, null, 2))
