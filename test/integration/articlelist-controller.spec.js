const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find, filter } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const articleListFixture = require('../fixtures/articleList')
const courseListFixture = require('../fixtures/courseList')

describe('ArticlelistController', () => {
    beforeEach(() => {
        articleListFixture.up()
        courseListFixture.up()
    })
    afterEach(() => {
        articleListFixture.down()
        courseListFixture.down()
    })

    describe('When I add an article to a courseList (POST /article-lists/:id)', () => {
        it('should reject with a 400 when no name is given', () => {
            return request(app)
                .post('/article-lists/1')
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'VALIDATION',
                            message: 'Missing name'
                        }
                    })
                })
        })

        it('should reject when id doesnt exist', () => {
            return request(app)
                .post('/article-lists/15')
                .send({ name: 'Toto' })
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'NOT_FOUND',
                            message: 'Id doesn\'t exist'
                        }
                    })
                })
        })

        it('should succesfuly add an article to a courseList', () => {
            const mockName = 'My New article'
            return request(app)
                .post('/article-lists/1')
                .send({ name: mockName })
                .then((res) => {
                    res.status.should.equal(200)
                    expect(res.body.data).to.be.an('object')
                    res.body.data.name.should.equal(mockName)
                    const result = find(db.articleList, { name: mockName })
                    result.should.not.be.empty
                    result.should.eql({
                        idCourse: res.body.data.idCourse,
                        name: res.body.data.name
                    })
                })
        })
    })
    describe('When I want to get articles of a courselist (GET /article-lists/:id)', () => {
        it('should reject when id doesnt exist', () => {
            return request(app)
                .get('/article-lists/15')
                .then((res) => {
                    res.status.should.equal(400)
                    res.body.should.eql({
                        error: {
                            code: 'NOT_FOUND',
                            message: 'Id doesn\'t exist'
                        }
                    })
                })
        })
        it('should return a list of articles', () => {
            const articles = filter(db.articleList, { idCourse: 1 })
            return request(app)
                .get('/article-lists/1')
                .then((res) => {
                    res.status.should.equal(200)
                    res.body.data.should.eql(articles)
                })
        })
        it('should return an empty array when there is no articles', () => {
            return request(app)
                .get('/article-lists/2')
                .then((res) => {
                    res.status.should.equal(200)
                    res.body.data.length.should.equal(0)
                })
        })
    })

    describe('When I want to put ok on an article', () => {
        xit('', () => {

        })
    })
})