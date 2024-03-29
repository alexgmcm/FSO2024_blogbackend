const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware');



blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{ username: 1, name: 1 })
  response.json(blogs)
  })

  blogsRouter.delete('/:id', middleware.userExtractor,async (request, response,next) => {
    try{
      const user = request.user
      const blogToDelete = await Blog.findById(request.params.id)
      if (!blogToDelete){
        return response.status(404).json({ error: 'resource not found' })
      }
      
      if ( blogToDelete.user.toString() === user.id.toString() ) {
      const result = await Blog.findByIdAndDelete(request.params.id)
      response.status(200).json(result)
      }
      else {
        response.status(200).json({error: "user does not have permission to delete this resource"})
      }
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
  
  blogsRouter.post('/',middleware.userExtractor, async (request, response, next) => {
    try{
    
    const user = request.user

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