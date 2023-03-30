export default (data) => (
`<a href="${data.url}" class="list-group-item${data.selected ? ' active ' : ''} list-group-item-action d-flex justify-content-between align-items-center">
  ${data.title}
  <span>
    ${data.selected ? '<span class="badge bg-light text-dark rounded-pill"><i class="fa fa-times"></i></span>' : ''}
    ${data.selected ? '<span class="badge bg-light text-dark rounded-pill">' : '<span class="badge bg-primary rounded-pill">'}
      ${data.count}</span>
  </span>
</a>`
)
