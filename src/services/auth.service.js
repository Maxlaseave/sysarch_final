const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const login = (req, res) => {
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
};

const register = (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
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
      role: role || 'user' // Default role if not specified
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
};

module.exports = { login, register, users };