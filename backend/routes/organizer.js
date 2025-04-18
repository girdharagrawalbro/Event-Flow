const express = require('express');
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-event', verifyToken, (req, res) => {
  const { title, description, date, location } = req.body;
  const userId = req.user.id;

  db.query(
    'INSERT INTO events (title, description, date, location, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, date, location, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Event created' });
    }
  );
});

module.exports = router;
