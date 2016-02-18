var datasets = require('./datasets_topics.json')

var topics = {
  'arts-culture-history': 'Arts / Culture / History',
  'budget-finance': 'Budget / Finance',
  'economy': 'Economy',
  'education': 'Education',
  'elections-politics': 'Elections / Politics',
  'environment': 'Environment',
  'food': 'Food',
  'health-human-services': 'Health / Human Services',
  'parks-recreation': 'Parks / Recreation',
  'planning-zoning': 'Planning / Zoning',
  'public-safety': 'Public Safety',
  'real-estate-land-records': 'Real Estate / Land Records',
  'transportation': 'Transportation',
  'uncategorized': 'Uncategorized'
}

var results = datasets.map(function (dataset) {
  if (dataset.category && typeof dataset.category === 'string') {
    var match = topics[dataset.category]
    if (match) dataset.category = match
    else console.log('no match on', dataset.category)
  } else if (dataset.category) {
    dataset.category = dataset.category.map(function (cat) {
      var match = topics[cat]
      if (match) return match
      else console.log('no match on', cat)
    })
  }
  return dataset
})

console.log(JSON.stringify(datasets, null, 2))
