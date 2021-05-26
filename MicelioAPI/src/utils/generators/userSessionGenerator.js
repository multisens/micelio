const { sign, verify } = require('jsonwebtoken')

const generateUserSession = (userId) => {
  return sign({}, 'abc', {
    expiresIn: '1d',
    subject: userId
  })
}

const decodeUserSession = token => {
  return verify(token, 'abc')
}

module.exports = {
  generateUserSession,
  decodeUserSession
}
