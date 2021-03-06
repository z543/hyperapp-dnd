import { h } from 'hyperapp'
import createSortable from './dnd'

const DragableList = (props, children) => {
  let sortable = createSortable(props)
  return (
    <div
      class={props.class}
      data-module={props.module}
      oncreate={sortable.init}
      ondestroy={sortable.deinit}
    >
      {children}
    </div>
  )
}

export default DragableList
