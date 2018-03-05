import { h, app } from 'hyperapp'
import DragableList from './components/dragableList'

const state = {
  count: 0,
  items1: [
    { title: 'foo', count: 0, key: '0' },
    { title: 'foo', count: 0, key: '1' }
  ],
  items2: [
    { title: 'bar', count: 0, key: '2' },
    { title: 'bar', count: 0, key: '3' },
    { title: 'bar', count: 0, key: '4' }
  ]
}

const actions = {
  moveItemByIndex: ({
    source_module,
    oldIndex,
    target_module,
    newIndex
  }) => state => {
    var source_item = state[source_module][oldIndex]
    var newSourceItems = state[source_module].filter((item, index) => {
      return oldIndex !== index
    })

    var items =
      source_module === target_module ? newSourceItems : state[target_module]
    var newTargetItems = items.reduce((result, item, index) => {
      if (newIndex === index) {
        result.push(source_item)
        result.push(item)
      } else {
        result.push(item)
      }
      return result
    }, [])
    if (newIndex >= newTargetItems.length) newTargetItems.push(source_item)

    return source_module === target_module
      ? {
          [source_module]: newTargetItems
        }
      : {
          [source_module]: newSourceItems,
          [target_module]: newTargetItems
        }
  },
  add_count: ({ module, key }) => state => ({
    [module]: state[module].map(
      (item, idx) =>
        item.key === key
          ? Object.assign({}, item, { count: item.count + 1 })
          : item
    )
  })
}

const sortableOptions = {
  group: 'share',
  sort: true,
  animation: 100
}

var counter = 0
const ListItem = props => {
  let { title, key, count } = props.data

  return (
    <div class={'card ' + props.class} data-key={key} key={key}>
      {title} key: {key}, count: {count}{' '}
      <button onclick={() => props.onadd({ module: props.module, key: key })}>
        +
      </button>{' '}
      {counter++}
    </div>
  )
}

const view = (state, actions) => {
  //console.log('view()...', state.items1, state.items2)
  return (
    <div oncreate={init}>
      List 1
      <DragableList
        class="drag_region"
        module="items1"
        group="foo"
        sortableOptions={sortableOptions}
        moveItemByIndex={actions.moveItemByIndex}
      >
        {state.items1.map(item => (
          <ListItem
            class="card1"
            data={item}
            module="items1"
            onadd={actions.add_count}
          />
        ))}
      </DragableList>
      List 2
      <DragableList
        class="drag_region"
        module="items2"
        group="foo"
        sortableOptions={sortableOptions}
        moveItemByIndex={actions.moveItemByIndex}
      >
        {state.items2.map(item => (
          <ListItem
            class="card2"
            data={item}
            module="items2"
            onadd={actions.add_count}
          />
        ))}
      </DragableList>
      Debug
      <div>
        <textarea>{JSON.stringify(state, null, 2)}</textarea>
      </div>
    </div>
  )
}

function init() {
  console.log('init()...')
}

var appActions = app(state, actions, view, document.getElementById('app'))

// setTimeout(()=>appActions.move_item({
//   source_list_id:"1",
//   source_key:"0",
//   target_list_id:"1",
//   target_key:null,
// }),3000)
// dragula([document.querySelector('.c1'), document.querySelector('.c2')])
