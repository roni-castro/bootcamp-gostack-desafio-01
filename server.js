const express = require('express')
const app = express()

app.use(express.json())
let numberOfRequestMade = 0

let projects = []

const mockDb = (projectsMock) => {
  projects = projectsMock
}

const checkNotFoundId = (req, res, next) => {
  const project = projects.find(project => project.id === req.params.id)
  if (!project) {
    return res.status(404).send({ error: 'Project not found' })
  }
  return next()
}

const checkDuplicateId = (req, res, next) => {
  const project = projects.find(project => project.id === req.body.id)
  if (project) {
    return res.status(400).send({ error: 'Project already exists' })
  }
  return next()
}

const checkRequiredCreateFields = (req, res, next) => {
  if (!req.body.title || !req.body.id) {
    return res.status(400).send({ error: 'title or id is missing' })
  }
  return next()
}

const checkRequiredTitleField = (req, res, next) => {
  if (!req.body.title) {
    return res.status(400).send({ error: 'title is required' })
  }
  return next()
}

app.use((req, res, next) => {
  numberOfRequestMade++
  console.log('Number of requests made: ', numberOfRequestMade)
  return next()
})

app.get('/projects', async (req, res) => {
  res.json({ projects })
})

app.get('/projects/:id', checkNotFoundId, async (req, res) => {
  const project = projects.find(project => project.id === req.params.id)
  res.json(project)
})

app.post('/projects', checkRequiredCreateFields, checkDuplicateId, async (req, res) => {
  const { id, title } = req.body
  const project = { id, title, tasks: [] }
  projects.push(project)
  res.status(201).json(project)
})

app.put('/projects/:id', checkRequiredTitleField, checkNotFoundId, async (req, res) => {
  const { title } = req.body
  const project = projects.find(p => p.id == req.params.id)
  project.title = title
  res.status(200).json(project)
})

app.delete('/projects/:id', checkNotFoundId, async (req, res) => {
  const index = projects.findIndex(project => project.id === req.params.id)
  projects.splice(index, 1)
  res.status(200).json()
})

app.post('/projects/:id/tasks', checkNotFoundId, checkRequiredTitleField, async (req, res) => {
  const { title } = req.body
  const project = projects.find(p => p.id === req.params.id)
  project.tasks.push(title)
  return res.status(201).json(project)
})

app.mockDb = mockDb

module.exports = app
