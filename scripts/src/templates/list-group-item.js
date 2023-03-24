export default (data) => (
`<a href="${data.url}" class="list-group-item${data.selected ? ' active ' : ''} list-group-item-action d-flex justify-content-between align-items-center">
  ${data.title}
  <span>
    ${data.selected ? '<span class="badge bg-secondary rounded-pill"><i class="fa fa-times"></i></span>' : ''}
    <span class="badge bg-secondary rounded-pill">${data.count}</span>
  </span>
</a>`
)
