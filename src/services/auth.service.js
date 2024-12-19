const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const register = [
  body('username')
    .isAlphanumeric().withMessage('Username is invalid'),
  body('password')
    .trim()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  body('email')
    .trim()
    .isEmail().withMessage('Email must be a valid email')
    .normalizeEmail().toLowerCase(),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email, role } = req.body;

    try {
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create new user
      const newUser = {
        id: uuidv4(),
        username,
        password: hashedPassword,
        email,
        role: role || 'user'
      };

      users.push(newUser);

      logger.info(`User ${username} registered successfully`);
      res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser.id, username: newUser.username, role: newUser.role }
      });
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
];


const login = [
  body('username').isAlphanumeric().withMessage('Username is invalid'),
  body('password')
    .trim()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

 
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = users.find(u => u.username === username);

      if (user && bcrypt.compareSync(password, user.password)) {
        const accessToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role
          },
          JWT_SECRET,
          { expiresIn: '2h' }
        );

        logger.info(`User ${username} logged in successfully`);
        return res.json({ accessToken, user: { id: user.id, username: user.username, role: user.role } });
      }

      logger.warn(`Failed login attempt for user ${username}`);
      res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
];

module.exports = { register, login, users };
