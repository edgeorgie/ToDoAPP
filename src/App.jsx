import { useState, useEffect } from 'react'

const API = 'http://localhost:3001'

function App () {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState('')
  const [popupActive, setPopupActive] = useState(false)

  useEffect(() => {
    getTodos()
  }, [])

  const getTodos = () => {
    fetch(API + '/todos').then(res => res.json()).then(data => setTodos(data)).catch(err => console.log(err))
  }

  const addTodo = async () => {
    const data = await fetch(API + '/todo/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: task
      })
    }).then(res => res.json())

    setTodos([...todos, data])

    setPopupActive(false)
    setTask('')
  }

  const completeTodo = async (id) => {
    const data = await fetch(API + '/todo/complete/' + id).then(res => res.json())

    setTodos((todos) => todos.map((todo) => {
      if (todo._id === data._id) {
        todo.done = data.done
      }

      return todo
    }))
  }

  const deleteTodo = async (id) => {
    const data = await fetch(API + '/todo/delete/' + id, {
      method: 'DELETE'
    }).then(res => res.json)

    setTodos(todos => todos.filter((todo) => todo._id !== data.result._id))
  }

  return (
    <div className='App'>
      <h1>Welcome</h1>
      <h4>Your tasks</h4>

      <div className='todos'>
        {
          todos.length > 0 ? (
            todos.map(todo => (
              <div
                className={'todo ' + (todo.done ? 'is-complete' : '')}
                key={todo._id}
                onClick={() => completeTodo(todo._id)}
              >
                <div className='checkbox' />

                <div className='text'>{todo.text}</div>
                <div onClick={() => deleteTodo(todo._id)} className='delete-todo'>
                  X
                </div>
              </div>
            ))
          ) : (
            'No tasks yet'
          )
        }
      </div>

      <div onClick={() => setPopupActive(true)} className='addPopup'>
        +
      </div>

      {
        popupActive
          ? (
          <div className='popup'>
              <div onClick={() => setPopupActive(false)} className='closePopup'>X</div>
            <div className='content'>
              <h3>Add Task</h3>
                <input type='text' className='add-todo-input' placeholder='Write your tasks...' onChange={(e) => setTask(e.target.value)} 
              />

              <div onClick={addTodo} className='button'>
                Create Task
              </div>
            </div>
          </div>
        ) : (
            ''
        )
      }
    </div>
  )
}

export default App
