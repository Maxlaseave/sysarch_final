const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const checkRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        logger.warn(`Unauthorized access attempt by ${req.user.username}`);
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };
  
  module.exports = { authenticateToken, checkRole };