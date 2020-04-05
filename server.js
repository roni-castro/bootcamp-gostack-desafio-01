const express = require('express')
const app = express()

let projects = []

app.get('/projects', async (req, res) => {
  res.json({ projects })
})

app.get('/projects/:id', async (req, res) => {
  const project = projects.find(project => project.id === req.params.id)
  res.json(project)
})

module.exports = app
