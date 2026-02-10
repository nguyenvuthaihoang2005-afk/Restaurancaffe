const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all users
router.get('/', (req, res) => {
  db.query('SELECT user_id, username, full_name, email, role FROM Users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST new user (mẫu, thêm hash password thật)
router.post('/', (req, res) => {
  const { username, password_hash, email, full_name, role } = req.body;
  db.query('INSERT INTO Users (username, password_hash, email, full_name, role) VALUES (?, ?, ?, ?, ?)',
    [username, password_hash, email, full_name, role],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: results.insertId });
    });
});

// Tương tự cho PUT (update), DELETE
module.exports = router;