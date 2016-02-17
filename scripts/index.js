var queryString = window.location.search.substring(1)
var query = deparam(queryString)

if (query.category) {
  $('dataset:not([data-category="' + query.category + '"])').hide()
}
