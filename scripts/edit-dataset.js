/* global $, jsyaml, github, settings */

// On form submit (main logic)
$('[data-hook~=edit-dataset]').on('submit', function (e) {
  e.preventDefault()
  var formData = getFormData(e.currentTarget)
  var yaml = formatData(formData)
  saveFile(yaml, function (err, response) {
    if (err) {
      alert('error')
      console.err(err)
    } else {
      toggleView()
      alert('success', response.commit.html_url)
    }
  })
})

// Toggle edit/view versions of the page when 'edit' or 'cancel' buttons are clicked
$('[data-hook~=edit-button], [data-hook~=cancel-button]').on('click', function (e) {
  toggleView()
  e.preventDefault()
})

// Returns a form element's data as an object
function getFormData (formEl) {
  var elements = Array.apply(null, formEl.elements) // convert to array
  var formData = {}
  for (var i = 0; i < elements.length; i++) {
    var id = elements[i].id
    if (id) formData[id] = elements[i].value
  }
  return formData
}

// Format data object into YAML front-matter
function formatData (formData) {
  return '---\n' + jsyaml.safeDump(formData).trim() + '\n---'
}

// Saves a file to github
function saveFile (contents, callback) {
  var repo = github.getRepo(settings.USERNAME, settings.REPO)
  var fileName = settings.FILE_PATH.split('/').pop()
  var commitMsg = 'Updated ' + fileName
  return repo.write(settings.BRANCH, settings.FILE_PATH, contents, commitMsg, {}, callback)
}

// Show alert box on page
function alert (type, commitUrl) {
  $('[data-hook~=alert]').hide()
  $('[data-hook~=alert-' + type +']').show()
  if (type === 'success' && commitUrl) {
    $('[data-hook~=commit-url]').attr('href', commitUrl)
  }
}

// Switch between edit / view versions of the page
function toggleView () {
  $('[data-hook~=view], [data-hook~=edit]').toggle()
}
