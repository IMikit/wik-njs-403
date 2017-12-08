const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const { find, findIndex } = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList
const articleListCollection = db.articleList

router.post('/', (req, res, next) => {
  if (!req.body.name) {
    return next(new BadRequestError('VALIDATION', 'Missing name'))
  }

  const name = req.body.name

  // Check for name uniqueness
  const result = find(courseListCollection, { name })
  if (result) {
    return next(new BadRequestError('VALIDATION', 'Name should be unique'))
  }

  const newCourseList = {
    id: courseListCollection.length + 1,
    name
  }

  courseListCollection.push(newCourseList)

  res.json({
    data: newCourseList
  })
})

router.delete('/:id', (req, res, next) => {
  const id = +req.params.id
  const index = findIndex(courseListCollection, { id })

  if (index === -1) {
    return next(new BadRequestError('NOT_FOUND', 'Id doesn\'t exist'))
  }

  courseListCollection.splice(index, 1)

  res.json({
    message: 'Ok'
  })
})

router.get('/', (req, res, next) => {
  res.json({
    data: courseListCollection
  })
})

module.exports = router