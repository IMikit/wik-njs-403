const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const { find, findIndex, filter } = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList
const articleListCollection = db.articleList

router.post('/:id', (req, res, next) => {
    if (!req.body.name) {
        return next(new BadRequestError('VALIDATION', 'Missing name'))
    }

    const name = req.body.name
    const id = +req.params.id

    const result = find(courseListCollection, { id })
    if (!result) {
        return next(new BadRequestError('NOT_FOUND', 'Id doesn\'t exist'))
    }

    const newArticle = {
        idCourse: id,
        name
    }
    articleListCollection.push(newArticle)
    res.json({
        data: newArticle
    })
})

router.get('/:id', (req, res, next) => {
    const idCourse = +req.params.id

    const exist = find(courseListCollection, { id: idCourse })
    if (!exist) {
        return next(new BadRequestError('NOT_FOUND', 'Id doesn\'t exist'))
    }
    const nb = find(articleListCollection, { idCourse })
    if (!nb) {
        return res.json({
            data: []
        })
    }

    const result = filter(articleListCollection, { idCourse })
    res.json({
        data: result
    })
})

module.exports = router