const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Todo = require('./models/Todo')
const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(
  'mongodb+srv://todomaster:todomaster123@cluster0.2njxt.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => console.log('Connected to MongoDB!')).catch((err) => console.log(err))

app.get('/todos', async (req, res) => {
  const todos = await Todo.find()

  res.json(todos)
})

app.get('/todo/complete/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)

  todo.done = !todo.done

  todo.save()

  res.json(todo)
})

app.post('/todo/new', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })

  todo.save()

  res.json(todo)
})

app.put('/todo/update/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id)

  todo.text = req.body.text

  todo.save()
  res.json(todo)
})

app.delete('/todo/delete/:id', async (req, res) => {
  const result = await Todo.findOneAndDelete(req.params.id)

  res.json({ result })
})

app.listen(3001, () => {
  console.log('Listening on port 3001')
})
