import {queryByHook, show, toggleVisibility} from '../util'

export default class {
  constructor (opts) {
    const resourceItems = queryByHook('resource-item', opts.el)

    // Resource details links
    resourceItems.forEach((resourceItem) => {
      const hasDetails = !!resourceItem.querySelector('table tr')
      if (hasDetails) {
        const showDetailsBtns = queryByHook('show-resource-details', resourceItem)
        show(showDetailsBtns)

        showDetailsBtns.forEach((btn) => {
          const details = queryByHook('resource-details', btn.parentNode)
          btn.addEventListener('click', (event) => {
            toggleVisibility(details)
            event.preventDefault()
          })
        })
      }
    })
  }
}
