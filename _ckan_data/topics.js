var datasets = require('./datasets_all_clean.json')

var results = datasets.map(function (dataset) {
  if (dataset.groups.length > 1) {
    dataset.category = dataset.groups.map(function (group) {
      return group.name.replace('-group', '')
    })
  } else if (dataset.groups.length === 1) {
    dataset.category = dataset.groups[0].name.replace('-group', '')
  }
  delete dataset.groups
  return dataset
})

console.log(JSON.stringify(results, null, 2))
