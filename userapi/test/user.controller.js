const { expect } = require('chai')
const userController = require('../src/controllers/user')
const db = require('../src/dbClient')

describe('User', () => {
  
  beforeEach(() => {
    // Clean DB before each test
    db.flushdb()
  })
  
  describe('Create', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'gabKz',
        firstname: 'Gabrielle',
        lastname: 'Korkmaz'
      }
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal('OK')
        done()
      })
    })

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Gabrielle',
        lastname: 'Korkmaz'
      }
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })

    it('avoid creating an existing user', (done)=> {
      const user = {
        username: 'gabKz',
        firstname: 'Gabrielle',
        lastname: 'Korkmaz'
      }
      // Create a user
      userController.create(user, () => {
        // Create the same user again
        userController.create(user, (err, result) => {
          expect(err).to.not.be.equal(null)
          expect(result).to.be.equal(null)
          done()
        })
      })
    })
  })

  describe('Get', ()=> {

    it('get a user by username', (done) => {
      const user = {
        username: 'gabKz',
        firstname: 'Gabrielle',
        lastname: 'Korkmaz'
      }
      // Create a user
      userController.create(user, () => {
        // Get an existing user
        userController.get(user.username, (err, result) => {
          expect(err).to.be.equal(null)
          expect(result).to.be.deep.equal({
            firstname: 'Gabrielle',
            lastname: 'Korkmaz'
          })
          done()
        })
      })
    })
  
    it('can not get a user when it does not exist', (done) => {
      userController.get('invalid', (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })
  
  })
})