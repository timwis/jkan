/* global $, jsyaml, settings, repo */
var resourceRowTemplate = $('[data-hook~=tmpl-resource-row]').html()
var resourceRowsEl = $('[data-hook~=resource-rows]')

// On form submit (main logic)
$('[data-hook~=edit-dataset]').on('submit', function (e) {
  e.preventDefault()
  var formData = $(e.currentTarget).serializeJSON({useIntKeysAsArrayIndex: true})
  var yaml = formatData(formData)
  saveFile(yaml, function (err, response) {
    if (err) {
      alert('error')
      console.error(err)
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

// Remove resource buttons
$(resourceRowsEl).on('click', '[data-hook~=remove-resource]', function (e) {
  if (window.confirm('Delete this resource?')) {
    $(e.currentTarget).closest('[data-hook~=resource-row]').remove()
  }
})

// Add resource button
$('[data-hook~=add-resource]').on('click', function (e) {
  resourceRowsEl.append(resourceRowTemplate)
})

// Initialize plugins
$('.select2').select2()
$('[data-toggle=tooltip]').tooltip()

// Format data object into YAML front-matter
function formatData (formData) {
  return '---\n' + jsyaml.safeDump(formData).trim() + '\n---'
}

// Saves a file to github
function saveFile (contents, callback) {
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
