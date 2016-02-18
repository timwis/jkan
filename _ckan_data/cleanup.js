var _ = require('lodash')

var datasets = require('./city_only.json')
var organizations = {}

datasets.forEach(function (dataset) {
  // Extract organization
  var match = _.find(dataset.extras, function (extra) { return extra.key === 'Department' })
  if (match) {
    var organization = match.value
    // Save as simple property on dataset
    dataset.organization = organization

    // Save to organizations hash
    if (!organizations[organization]) organizations[organization] = 0
    organizations[organization]++
  }

  // Remove keys
  delete dataset.extras
  delete dataset.owner_org
  delete dataset.license_id
  delete dataset.license_title
})

var orgs = _.keys(organizations).map(function (org) { return {name: org, description: org + ', City of Philadelphia'} })

console.log(JSON.stringify(datasets, null, 2))
