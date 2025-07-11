const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { disabled } = require('../app');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});


// POST login (new version)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username, password);

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user_id = rows[0].user_id;
    req.session.role = rows[0].role;

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});


// Delete route
router.post('/logout',(req,res) => {
  req.session.destroy(err=>{
    if(err) {
      return res.status(500).json({error:'Logout Unsuccessful'});
    }
    res.clearCookie('connect.sid');
    res.json({message: 'Logout Successful!'})
  });
});


//Dogs route
router.get('/dogs', async(req,res) => {
  const owner_id = req.session.user_id;
  if(!owner_id) return res.status(401).json({error:'Not Logged In'}) ;

  try{
    const [rows]=await db.query(`SELECT dog_id, name FROM Dogs WHERE owner_id = ? `,[owner_id]) ;
    res.json(rows);
  } catch (error) {
    res.status(500).json({error: 'failed'}) ;
  }
})

// q16
router.get('/me', (req,res)=>{
  if(!req.session.user_id) {
    return res.status(401).json({error:'Not logged in '});
  }
  res.json({
    user_id: req.session.user_id,
    role: req.session.role
  }) ;
}) ;

module.exports = router;


//q17
router.get('/api/dog',async(req,res) => {
  try {
    const[rows] = await db.query(`SELECT dog_id, name, size, owner_id FROM Dogs`) ;
    res.json(rows);
  } catch (err){
    res.status(500).json({error:'Failed to fetch'});
  }
});