const express = require('express')
const app = express()

app.use(express.json())

let projects = []

const mockDb = (projectsMock) => {
  projects = projectsMock
}

const checkNotFoundId = (req, res, next) => {
  const project = projects.find(project => project.id === req.params.id)
  if (!project) {
    return res.status(404).send({ error: 'Project not found' })
  }
  next()
}

const checkRequiredFields = (req, res, next) => {
  if (!req.body.title || !req.body.id) {
    return res.status(400).send({ error: 'title or id is missing' })
  }
  next()
}

app.get('/projects', async (req, res) => {
  res.json({ projects })
})

app.get('/projects/:id', checkNotFoundId, async (req, res) => {
  const project = projects.find(project => project.id === req.params.id)
  res.json(project)
})

app.post('/projects', checkRequiredFields, async (req, res) => {
  const project = {tasks: [], ...req.body }
  projects.push(project)
  res.status(201).json(project)
})

app.mockDb = mockDb

module.exports = app
