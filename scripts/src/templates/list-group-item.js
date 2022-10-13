export default (data) => (
`<a href="${data.url}" class="list-group-item${data.selected ? ' active ' : ''}">
  <li class="d-flex justify-content-between align-items-center">${data.title}
  <span class="badge badge-primary badge-pill">${data.count}</span>
  ${data.selected ? '<span class="badge badge-primary badge-pill"><i class="fa fa-times"></i></span>' : ''}</li>
</a>`
)
