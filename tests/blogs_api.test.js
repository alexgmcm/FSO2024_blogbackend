const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)
const Blog = require('../models/blog')
const _ = require('lodash')

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

test('contains id field', async () => {
    const response = await api.get('/api/blogs')
    //console.log(response.body)
    const blog = response.body[0]
    assert(Object.keys(blog).includes("id"))
})

test('new blog created successfully', async () => {
    const newBlog = {"title":"posted blog", "author":"test bot","url":"http://test.com","likes":222}
    const response = await api.post('/api/blogs').send(newBlog).expect(201)
    const submittedBlog = response.body

    const getNewBlogs = await api.get('/api/blogs')
    assert(getNewBlogs.body.some((blog) => _.isEqual(blog,submittedBlog) ))
})

test('no likes default', async () => {
    const newBlog = {"title":"posted blog", "author":"test bot","url":"http://test.com"}
    const response = await api.post('/api/blogs').send(newBlog).expect(201)
    const submittedBlog = response.body

    const getNewBlogs = await api.get('/api/blogs')
    const newBlogInDatabase = getNewBlogs.body.filter((x) => x.id===submittedBlog.id)[0]
    //console.log(newBlogInDatabase)
    assert(newBlogInDatabase.likes===0)
} )

after(async () => {
  await mongoose.connection.close()
})