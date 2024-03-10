const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: 'HTML is easy',
      author: "test11",
      url: "http://testyt.com",
      likes:667
    },
    {
        title: 'HTML is easy222',
        author: "test2211",
        url: "http://testyt22.com",
        likes:0
      }
  ]

  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = initialBlogs.map((blog) => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })



test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Returns two blogs', async () => {
    const response = await api.get('/api/blogs')
    //console.log(response.body)
    assert.strictEqual(response.body.length,2)
})

after(async () => {
  await mongoose.connection.close()
})