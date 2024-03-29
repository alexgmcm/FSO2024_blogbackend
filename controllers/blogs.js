const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{ username: 1, name: 1 })
  response.json(blogs)
  })

  blogsRouter.delete('/:id', async (request, response,next) => {
    try{
    const result = await Blog.findByIdAndDelete(request.params.id)
    response.status(200).json(result)
    }
    catch(exception){
      next(exception)
    }
    })

  blogsRouter.put('/:id', async (request, response, next) => {
    try{
      const blog = request.body
      const result = await Blog.findByIdAndUpdate(request.params.id,blog,{new:true})
      response.status(200).json(result)
    } catch(exception){
      next(exception)
    }
  })
  
  blogsRouter.post('/', async (request, response, next) => {
    try{
    const users = await User.find({})
    const user = users[0] // use first user found
    const blog = new Blog({...request.body, user: user.id })
    const savedBlog = await blog.save()
    user.blogs=user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
    } catch(exception){
      next(exception)
    }
    
  })

  module.exports = blogsRouter