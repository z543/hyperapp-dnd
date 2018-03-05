import { h } from 'hyperapp'
import createSortable from './dnd'

const DragableList = (props, children) => {
  let sortable = createSortable(props)
  return (
    <div
      class={props.class}
      data-module={props.module}
      oncreate={sortable.createHandler}
      ondestroy={sortable.destroyHandler}
    >
      {children}
    </div>
  )
}

export default DragableList
