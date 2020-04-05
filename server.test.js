const supertest = require('supertest')
const app = require('./server')

const request = supertest(app)

test('GET projects', async done => {
  const response = await request.get('/projects')
  expect(response.status).toBe(200)
  expect(response.body.projects.length).toBe(0)
  done()
})