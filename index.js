const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.use(express.json()) //json parser middleware for req.body

//I had used .env file to store the mongodb uri and the port number but
//to make it simple i included the uri here
const url = "mongodb+srv://Wondirad:1058984211Ww@cluster0.jqfkdio.mongodb.net/taskManagerApp?retryWrites=true&w=majority&appName=Cluster0"
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    completed: {type: Boolean, default:false},
})

//so when the data is returned to the front end(rest client in my case)
// the id will be nicely formated and we wont have _v(of the db)
taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Task = mongoose.model('Task', taskSchema)


app.get("/", (request, response) => {
  response.send("<h1>Welcome to the task manager API</h1>");
});

app.get('/api/tasks', (request, response) => {
  Task.find({}).then((tasks) => {
    response.json(tasks)
    console.log(JSON.stringify(tasks)) //print the result
  })
})

app.delete('/api/tasks/:id', (request, response, next) => {
  Task.findByIdAndDelete(request.params.id)
    .then((delTask) => {
      if (!delTask) {
        response.status(404).end()
        console.log("task id not found")
      }
      response.status(204).end()
        console.log("task deleted successfully")    
    })
    .catch((error) => next(error))
})

app.post('/api/tasks', (request, response, next) => {
  const body = request.body

  const task = new Task({
      title: body.title,
      description: body.description,
      completed: body.completed,
    })

    task
      .save()
      .then((savedTask) => {
        response.json(savedTask)
        console.log("what the saved task looks like", savedTask)
      })
      .catch((error) => next(error))
  })


app.put('/api/tasks/:id', (request, response, next) => {
  const { completed } = request.body

Task.findByIdAndUpdate(
    request.params.id,
    { completed: completed }
  )
    .then((updatedTask) => {
      if (!updatedTask) {
        console.log("task not found");
        return response.status(404).end();
      }
      response.json(updatedTask);
    })
    .catch((error) => next(error));
})


const errorHandler = (error, request, response, next) => {
  console.log('Error message: ', error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ errorMsgToFrontEnd: error.message })
  }
  //incase of server error like 500 pass it to express
  next(error)
}
app.use(errorHandler)

const port = 3001

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
