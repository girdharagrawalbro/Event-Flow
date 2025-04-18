const express = require('express');
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// Protected route
router.post('/register', verifyToken, (req, res) => {
    const { event_id } = req.body;
    const userId = req.user.id;

    db.query(
        'INSERT INTO registrations (user_id, event_id) VALUES (?, ?)',
        [userId, event_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Event registration successful' });
        }
    );
});

router.get('/my-events', verifyToken, (req, res) => {
    const userId = req.user.id;

    db.query(
        `SELECT events.* FROM events 
     JOIN registrations ON events.id = registrations.event_id
     WHERE registrations.user_id = ?`,
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

module.exports = router;
