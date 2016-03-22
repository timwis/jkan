/* global $, settings, github */
// var configFileContents

$('form').on('submit', function (e) {
  var formData = $(e.currentTarget).serializeJSON()

  var repo = github.getRepo(settings.REPO_OWNER, settings.REPO_NAME)
  repo.read(settings.BRANCH, '_config.yml', function (err, fileContents) {
    if (err) console.error(err)
    var newFileContents = fileContents
    for (var key in formData) {
      var regex = new RegExp(key + ':.*')
      var newValue = key + ': ' + formData[key]
      newFileContents = newFileContents.replace(regex, newValue)
    }
    var commitMsg = 'Updated _config.yml'
    return repo.write(settings.BRANCH, '_config.yml', newFileContents, commitMsg, {}, function (err, response) {
      if (err) {
        alert('error')
        console.error(err)
      } else {
        alert('success', response.commit.html_url)
      }
    })
  })

  e.preventDefault()
})

// Show alert box on page
function alert (type, commitUrl) {
  $('[data-hook~=alert]').hide()
  $('[data-hook~=alert-' + type +']').show()
  if (type === 'success' && commitUrl) {
    $('[data-hook~=commit-url]').attr('href', commitUrl)
  }
}
