const supertest = require('supertest')
const app = require('./server')

const projects = [{
  id: '1',
  title: 'Project 1',
  tasks: ['Nova tarefa']
}]
app.mockDb(projects)

const request = supertest(app)

describe('GET /projects', () => {
  test('returns with json containing projects object', async done => {
    const response = await request.get('/projects')
    expect(response.status).toBe(200)
    expect(response.body.projects.length).toBe(1)
    done()
  })
})

describe('GET /projects/:id', () => {
  it('respond with json containing a single project', async done => {
    const response = await request.get('/projects/1')
    expect(response.status).toBe(200)
    expect(response.body.id).toBe('1')
    done()
  })
  it('respond with 404 error when id not found', async done => {
    const response = await request.get('/projects/0')
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Project not found')
    done()
  })
})
