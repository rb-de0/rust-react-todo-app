import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { useState } from 'react'
import 'styles/main.css'
import Todo from 'models/Todo'

interface Props {
  todo: Todo
  onEditEnd: (body: string) => void
  onChangeCompleted: (completed: boolean) => void
  onDelete: () => void
}

const TodoListItem = (props: Props) => {
  const [body, setBody] = useState(props.todo.body)
  const [isEditing, setIsEditing] = useState(false)

  const onChangeText = (e: any) => {
    setBody(e.target.value)
  }

  const onChangeCompleted = (e: any) => {
    props.onChangeCompleted(e.target.checked)
  }

  const onEditStart = () => {
    setIsEditing(true)
  }

  const onEditEnd = () => {
    setIsEditing(false)
    props.onEditEnd(body)
  }

  return (
    <ListItem disableGutters className="todo-list-item-container">
      <Box className="todo-list-item" display="flex" alignItems="center">
        <Checkbox checked={props.todo.completed} onChange={(e) => onChangeCompleted(e)} color="primary" />
        <Box flexGrow={1}>
          {isEditing && <TextField defaultValue={body} fullWidth inputRef={(input) => input && input.focus()} onBlur={(_) => onEditEnd()} onChange={(e) => onChangeText(e)} />}
          {!isEditing && (
            <Button className="todo-list-item-name" variant="text" onClick={(_) => onEditStart()}>
              {props.todo.body}
            </Button>
          )}
        </Box>
        <Box display="flex" className="todo-edit-buttons">
          <IconButton onClick={(_) => props.onDelete()}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </ListItem>
  )
}

export default TodoListItem
