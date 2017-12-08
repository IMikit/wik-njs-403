const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const courseListFixture = require('../fixtures/courseList')

describe('CourselistController', () => {
  beforeEach(() => {
    courseListFixture.up()
  })
  afterEach(() => {
    courseListFixture.down()
  })

  describe('When I create a courseList (POST /course-lists)', () => {
    it('should reject with a 400 when no name is given', () => {
      return request(app).post('/course-lists').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })

    it('should reject when name is not unique', () => {
      return request(app)
        .post('/course-lists')
        .send({ name: 'Toto' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Name should be unique'
            }
          })
        })
    })

    it('should  succesfuly create a courseList', () => {
      const mockName = 'My New List'
      return request(app)
        .post('/course-lists')
        .send({ name: mockName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(mockName)
          const result = find(db.courseList, { name: mockName })
          result.should.not.be.empty
          result.should.eql({
            id: res.body.data.id,
            name: res.body.data.name
          })
        })
    })
  })

  describe('When I delete a courseList (DELETE /course-lists', () => {
    it('should reject when id doesn\'t exist', () => {
      return request(app)
        .delete('/course-lists/15')
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

    it('should succesfully delete a courseList', () => {
      const len = db.courseList.length
      return request(app)
        .delete('/course-lists/1')
        .then((res) => {
          res.status.should.equal(200)
          res.body.should.eql({
            message: 'Ok'
          })
          db.courseList.length.should.be.equal(len - 1)
          const result = find(db.courseList, { id: 1 })
          expect(result).to.be.undefined;
        })
    })
  })


  describe('When I get the courselists (GET on /course-lists', () => {
    it('should return a list of courselists', () => {
      return request(app)
        .get('/course-lists')
        .then((res) => {
          res.status.should.equal(200)
          res.body.data.should.eql(db.courseList)
        })
    })
    it('should return an empty array when there is no courselists', () => {
      courseListFixture.down()
      return request(app)
        .get('/course-lists')
        .then((res) => {
          res.status.should.equal(200)
          res.body.data.length.should.equal(0)
        })
    })
  })
})