const { articleList } = require('../../data/db')

mockData = [
  { idCourse: 1, name: 'Article1' },
  { idCourse: 1, name: 'Article2' }
]

module.exports = {
  up: () => {
    articleList.splice(0)
    articleList.push.apply(articleList, mockData)
  },

  down: () => {
    articleList.splice(0)
  }
}