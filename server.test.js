const supertest = require('supertest')
const app = require('./server')
const uuid4 = require('uuid4')

describe('Projects', () => {
  let projects
  let request
  beforeEach(() => {
    projects = [{
      id: '1',
      title: 'Project 1',
      tasks: ['Nova tarefa']
    }]
    app.mockDb(projects)
    request = supertest(app)
  })

  describe('GET /projects', () => {
    test('returns with json containing projects object', async done => {
      const response = await request.get('/projects')
      expect(response.status).toBe(200)
      expect(response.body.projects.length).toBe(1)
      expect(response.body.projects[0]).toMatchObject(projects[0])
      done()
    })
  })

  describe('GET /projects/:id', () => {
    it('respond with json containing a single project', async done => {
      const response = await request.get('/projects/1')
      expect(response.status).toBe(200)
      expect(response.body.id).toBe('1')
      expect(response.body.tasks.length).toBe(1)
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
        title: 'Project created'
      }
      const response = await request.post('/projects').send(data)
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject(data)
      done()
    })
    it('respond with 201 created project with non valid props', async done => {
      const data = {
        id: uuid4(),
        title: 'Project created',
        tasks: ['task should not be created']
      }
      const response = await request.post('/projects').send(data)
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({id: data.id, title: data.title, tasks: [] })
      done()
    })
    it('respond with Bad Request if project already exists', async done => {
      const data = { id: '1', title: 'Title' }
      const response = await request.post('/projects').send(data)
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Project already exists')
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
  })
  describe('PUT /projects/:id', () => {
    it('respond with 200 updated project', async done => {
      const dataToUpdate = { title: 'Project updated' }
      const project = projects[0]
      const response = await request.put(`/projects/${project.id}`).send(dataToUpdate)
      expect(response.status).toBe(200)
      expect(response.body.id).toBe(project.id)
      expect(response.body.title).toBe(dataToUpdate.title)
      expect(response.body.tasks).toMatchObject(project.tasks)
      done()
    })
    describe('respond with Bad Request if not passed required fields', () => {
      test.each([
        [{ id: '11' }, 400],
        [{ tasks: [{}]}, 400],
        [{ id: 'id', tasks: []}, 400],
      ])('put with body %o should return %i', async (data, expectedStatus) => {
        const project = projects[0]
        const response = await request.put(`/projects/${project.id}`).send(data)
        expect(response.status).toBe(expectedStatus)
        expect(response.body.error).toBe('title is required')
      });
    })
    it('respond with 404 error when update project which id does not exists', async done => {
      const response = await request.get('/projects/0')
      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Project not found')
      done()
    })
  })
  describe('DELETE /projects/:id', () => {
    it('respond with 404 error when project does not exists', async done => {
      const response = await request.delete('/projects/0')
      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Project not found')
      done()
    })
    it('respond with empty body and 200', async done => {
      const project = projects[0]
      const response = await request.delete(`/projects/${project.id}`)
      expect(response.status).toBe(200)
      expect(response.body).toBe('')
      expect(projects.length).toBe(0)
      done()
    })
  })
  describe('POST /projects/:id/tasks', () => {
    it('respond with 201 created task', async done => {
      const data = { title: 'Task new' }
      const project = projects[0]
      const response = await request.post(`/projects/${project.id}/tasks`).send(data)
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        id: project.id,
        title: project.title,
        tasks: ['Nova tarefa', data.title]
      })
      done()
    })
    it('respond with 201 created project with non valid props', async done => {
      const data = {
        id: uuid4(),
        title: 'Task created',
        tasks: ['task should not be created']
      }
      const project = projects[0]
      const response = await request.post(`/projects/${project.id}/tasks`).send(data)
      expect(response.status).toBe(201)
      expect(response.body).toMatchObject({
        id: project.id,
        title: project.title,
        tasks: ['Nova tarefa', data.title]
      })
      done()
    })
    it('respond with 404 error when does not exists', async done => {
      const response = await request.post(`/projects/0/tasks`).send({ title: 'task'})
      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Project not found')
      done()
    })
    describe('respond with Bad Request if not passed required fields', () => {
      test.each([
        [{ id: '11' }, 400],
        [{ tasks: 'title'}, 400],
      ])('post with body %o should return %i', async (data, expectedStatus) => {
        const response = await request.post('/projects/1/tasks').send(data)
        expect(response.status).toBe(expectedStatus)
        expect(response.body.error).toBe('title is required')
      });
    })
  })
})
