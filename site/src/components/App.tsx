import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'
import axios from 'axios'
import { plainToClass } from 'class-transformer'
import React, { useEffect, useState } from 'react'
import TodoList from 'components/TodoList'
import Todo from 'models/Todo'
import 'styles/main.css'

const initialTodoList: Todo[] = []

const App = () => {
  const [newTodoBody, setNewTodoBody] = useState('')
  const [todoList, setTodoList] = useState(initialTodoList)

  useEffect(() => {
    fetchTodoList()
  }, [])

  const fetchTodoList = () => {
    axios
      .get('http://127.0.0.1:8080/api/todos')
      .then((response) => {
        const todoList = plainToClass(Todo, response.data as Todo[])
        setTodoList(todoList)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const onChangeTodoBody = (e: any) => {
    setNewTodoBody(e.target.value)
  }

  const addTodo = () => {
    axios
      .post(`http://127.0.0.1:8080/api/todos`, {
        body: newTodoBody,
      })
      .then((_) => {
        setNewTodoBody('')
        fetchTodoList()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const onEditEnd = (todo: Todo, body: string) => {
    axios
      .post(`http://127.0.0.1:8080/api/todos/${todo.id}`, {
        body: body,
      })
      .then((_) => {
        fetchTodoList()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const onChangeCompleted = (todo: Todo, completed: boolean) => {
    axios
      .post(`http://127.0.0.1:8080/api/todos/${todo.id}/complete`, {
        completed: completed,
      })
      .then((_) => {
        fetchTodoList()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const onDelete = (todo: Todo) => {
    axios
      .delete(`http://127.0.0.1:8080/api/todos/${todo.id}`)
      .then((_) => {
        fetchTodoList()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify="center">
            <div className="todo-list-container">
              <Box display="flex" mt={2} mb={1}>
                <Box mr={2} flexGrow={1}>
                  <TextField value={newTodoBody} onChange={(e) => onChangeTodoBody(e)} fullWidth size="small" variant="outlined" />
                </Box>
                <IconButton onClick={(_) => addTodo()}>
                  <AddIcon />
                </IconButton>
              </Box>
              <TodoList todoList={todoList} onEditEnd={(t, b) => onEditEnd(t, b)} onChangeCompleted={(t, c) => onChangeCompleted(t, c)} onDelete={(t) => onDelete(t)} />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default App
