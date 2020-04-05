const express = require('express')
const app = express()

let projects = []

app.get('/projects', async (req, res) => {
  res.json({ projects })
})

module.exports = app
