const express = require('express')
const app = express()

let projects = []

const mockDb = (projectsMock) => {
  projects = projectsMock
}

const checkNotFoundId = (req, res, next) => {
  const project = projects.find(project => project.id === req.params.id)
  if(!project) {
    res.status(404).send({ error: 'Project not found'})
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

app.mockDb = mockDb

module.exports = app
