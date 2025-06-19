const generateToken = require('./generateToken');
const { generateAccessToken, generateRefreshToken } = require('./generateTokens');

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken
}; 