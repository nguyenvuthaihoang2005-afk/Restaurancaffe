const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all reservations (join Users và Tables, hỗ trợ search theo user hoặc table)
router.get('/', (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : '%';
  const query = `
    SELECT 
      r.reservation_id, r.reservation_time, r.number_of_guests, r.status, r.notes,
      u.full_name AS user_name, u.phone_number AS user_phone,
      t.table_number, t.capacity, t.location
    FROM Reservations r
    LEFT JOIN Users u ON r.user_id = u.user_id
    LEFT JOIN Tables t ON r.table_id = t.table_id
    WHERE u.full_name LIKE ? OR t.table_number LIKE ? OR r.status LIKE ?
    ORDER BY r.reservation_time DESC
  `;
  db.query(query, [search, search, search], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new reservation
router.post('/', (req, res) => {
  const { user_id, table_id, reservation_time, number_of_guests, status, notes } = req.body;
  const query = `
    INSERT INTO Reservations (user_id, table_id, reservation_time, number_of_guests, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [user_id, table_id, reservation_time, number_of_guests, status || 'pending', notes || null], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId });
  });
});

// PUT update reservation
router.put('/:id', (req, res) => {
  const { user_id, table_id, reservation_time, number_of_guests, status, notes } = req.body;
  const query = `
    UPDATE Reservations
    SET user_id = ?, table_id = ?, reservation_time = ?, number_of_guests = ?, status = ?, notes = ?
    WHERE reservation_id = ?
  `;
  db.query(query, [user_id, table_id, reservation_time, number_of_guests, status, notes || null, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    res.json({ message: 'Cập nhật đặt bàn thành công' });
  });
});

// DELETE reservation
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Reservations WHERE reservation_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    res.json({ message: 'Xóa đặt bàn thành công' });
  });
});

module.exports = router;