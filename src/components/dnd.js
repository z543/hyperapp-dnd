import Sortable from 'sortablejs'

let _nextSibling

const _defaultSortableOptions = {
  group: 'share',
  sort: true,
  animation: 100,
}

function createSortable({ sortableOptions = {}, moveItemByIndex, group }) {
  function createInternalSortableOptions() {
    //let result = { ..._defaultSortableOptions, ...sortableOptions }
    let group_object = group ? { group } : {}
    let result = Object.assign({}, _defaultSortableOptions, sortableOptions, group_object)
    ;[
      'onChoose',
      'onStart',
      'onEnd',
      'onAdd',
      'onUpdate',
      'onSort',
      'onRemove',
      'onFilter',
      'onMove',
      'onClone',
    ].forEach(funName => {
      const eventHandler = sortableOptions[funName]
      result[funName] = function() {
        let evt = arguments[0]
        console.log(funName, evt)
        if (funName === 'onStart') {
          _nextSibling = evt.item.nextElementSibling
        } else if (funName === 'onAdd' || funName === 'onUpdate') {
        } else if (funName === 'onEnd') {
          // setTimeout to prevert flicker
          setTimeout(function() {
            evt.from.insertBefore(evt.item, _nextSibling)
          }, 0)
          
          moveItemByIndex({
            source_module: evt.from.dataset.module,
            oldIndex: evt.oldIndex,
            target_module: evt.to.dataset.module,
            newIndex: evt.newIndex,
          })
        }
        // if (evt.type === 'move') {
        //   const canMove = eventHandler ? eventHandler(arguments) : true
        //   return canMove
        // }

        //執行 props.sortableOptions 中設定的 function
        eventHandler && eventHandler.apply(this, arguments)
      }
    })
    return result
  }
  let _sortableOptions = createInternalSortableOptions(sortableOptions)
  let _sortableInstance = null
  return {
    init(el) {
      _sortableInstance = Sortable.create(el, _sortableOptions)
    },
    deinit() {
      _sortableInstance && _sortableInstance.destroy()
      _sortableInstance = null
    },
  }
}

export default createSortable
