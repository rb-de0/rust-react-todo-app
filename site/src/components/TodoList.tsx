import List from '@material-ui/core/List'
import React from 'react'
import TodoListItem from 'components/TodoListItem'
import Todo from 'models/Todo'
import 'styles/main.css'

interface Props {
  todoList: Todo[]
  onEditEnd: (todo: Todo, body: string) => void
  onChangeCompleted: (todo: Todo, completed: boolean) => void
  onDelete: (todo: Todo) => void
}

const TodoList = (props: Props) => {
  const list = props.todoList.map((t) => {
    return <TodoListItem key={t.id} todo={t} onEditEnd={(b) => props.onEditEnd(t, b)} onChangeCompleted={(c) => props.onChangeCompleted(t, c)} onDelete={() => props.onDelete(t)} />
  })

  return (
    <div className="todo-list">
      <List disablePadding>{list}</List>
    </div>
  )
}

export default TodoList
