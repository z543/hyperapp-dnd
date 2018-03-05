import Sortable from 'sortablejs'

let _nextSibling

const _defaultSortableOptions = {
  group: 'share',
  sort: true,
  animation: 100
}

function createSortable({ sortableOptions = {}, moveItemByIndex, group }) {
  function createInternalSortableOptions() {
    //let result = { ..._defaultSortableOptions, ...sortableOptions }
    let group_object = group ? { group } : {}
    let result = Object.assign(
      {},
      _defaultSortableOptions,
      sortableOptions,
      group_object
    )
    //let keys = Object.keys(result)
    //keys.forEach(key => {
    ;['onStart', 'onAdd', 'onUpdate', 'onEnd'].forEach(funName => {
      let value = result[funName]
      result[funName] = function() {
        let evt = arguments[0]
        console.log(funName, evt)
        if (funName === 'onStart') {
          _nextSibling = evt.item.nextElementSibling
          // let list = this.el
          // _activeComponent = this
        } else if (funName === 'onAdd' || funName === 'onUpdate') {
          // evt.item.parentNode.removeChild(evt.item)
          evt.from.insertBefore(evt.item, _nextSibling)
        } else if (funName === 'onEnd') {
          moveItemByIndex({
            source_module: evt.from.dataset.module,
            oldIndex: evt.oldIndex,
            target_module: evt.to.dataset.module,
            newIndex: evt.newIndex
          })
        } else {
        }
        //執行 props.sortableOptions 中設定的 function
        sortableOptions[funName] &&
          sortableOptions[funName].apply(this, arguments)
      }
    })
    return result
  }
  let _sortableOptions = createInternalSortableOptions(sortableOptions)
  let _sortableInstance = null
  return {
    createHandler(el) {
      _sortableInstance = Sortable.create(el, _sortableOptions)
    },
    destroyHandler() {
      _sortableInstance && _sortableInstance.destroy()
      _sortableInstance = null
    }
  }
}

export default createSortable
