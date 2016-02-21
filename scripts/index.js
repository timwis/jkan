$('.list-group[data-show]').each(function (listGroup) {
  var show = this.dataset.show
  var itemsToHide = $('.list-group-item:gt(' + (show-1) + ')', this)
  if (itemsToHide) {
    itemsToHide.hide()
    var showMoreButton = $('<a href="#" class="list-group-item">Show ' + itemsToHide.length + ' more...</a>')
    showMoreButton.on('click', function (e) {
      itemsToHide.show()
      $(this).off('click')
      $(this).remove()
      e.preventDefault()
    })
    $(this).append(showMoreButton)
  }
})