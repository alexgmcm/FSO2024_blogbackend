const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const _ = require('lodash')


beforeEach(async () => {
    await User.deleteMany({})
  })


test('new user created successfully', async () => {
    const newUser = {"username":"test", "name":"test bot","password":"hunter2"}
    const response = await api.post('/api/users').send(newUser).expect(201)
    const submittedUser = response.body

    const getUsers = await api.get('/api/users')
    assert(getUsers.body.some((user) => _.isEqual(user,submittedUser) ))
})

test('username too short fails', async () => {
    const newUser = {"username":"te", "name":"test bot","password":"hunter2"}
    const response = await api.post('/api/users').send(newUser).expect(400)  
})

test('password too short fails', async () => {
    const newUser = {"username":"test", "name":"test bot","password":"hu"}
    const response = await api.post('/api/users').send(newUser).expect(400)  
})

test('user must be unique', async () => {
    const newUser = {"username":"test", "name":"test bot","password":"hunter2"}
    const newUser2 = {"username":"test", "name":"test bot2","password":"hunter22"}
    const response = await api.post('/api/users').send(newUser).expect(201)
    const response2 = await api.post('/api/users').send(newUser2).expect(400) 
})

after(async () => {
    await mongoose.connection.close()
  })