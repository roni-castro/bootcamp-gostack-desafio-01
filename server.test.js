const supertest = require('supertest')
const app = require('./server')

const request = supertest(app)

describe('GET /projects', () => {
  test('returns with json containing projects object', async done => {
    const response = await request.get('/projects')
    expect(response.status).toBe(200)
    expect(response.body.projects.length).toBe(0)
    done()
  })
})

describe('GET /projects/:id', () => {
  it('respond with json containing a single project', async done => {
    const response = await request.get('/projects/1')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(0)
    done()
  })
})
