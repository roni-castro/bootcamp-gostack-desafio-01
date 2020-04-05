const supertest = require('supertest')
const app = require('./server')
const uuid4 = require('uuid4')

const projectsDefault = [{
  id: '1',
  title: 'Project 1',
  tasks: ['Nova tarefa']
}]

describe('Projects', () => {
  let projects
  let request
  beforeEach(() => {
    projects = projectsDefault
    app.mockDb(projects)
    request = supertest(app)
  })

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

  describe('POST /projects', () => {
    it('respond with 201 created project', async done => {
      const data = {
        id: uuid4(),
        title: 'Project created',
        tasks: []
      }
      const response = await request.post('/projects').send(data)
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject(data)
      done()
    })
    describe('respond with Bad Request if not passed required fields', () => {
      test.each([
        [{ id: '11' }, 400],
        [{ title: 'title'}, 400],
        [{ title: 'title', tasks: []}, 400],
      ])('post with body %o should return %i', async (data, expectedStatus) => {
        const response = await request.post('/projects').send(data)
        expect(response.status).toBe(expectedStatus)
        expect(response.body.error).toBe('title or id is missing')
      });
    })
    it('respond with Bad Request if not passed required id field', async done => {
      const data = { title: 'title' }
      const response = await request.post('/projects').send(data)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('title or id is missing')
      done()
    })
  })
})
