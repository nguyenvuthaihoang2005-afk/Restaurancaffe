const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all tables (hỗ trợ search theo table_number hoặc location)
router.get('/', (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : '%';
  const query = `
    SELECT table_id, table_number, capacity, location, is_available
    FROM Tables
    WHERE table_number LIKE ? OR location LIKE ?
  `;
  db.query(query, [search, search], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET one table by id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Tables WHERE table_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy bàn' });
    res.json(results[0]);
  });
});

// POST new table
router.post('/', (req, res) => {
  const { table_number, capacity, location, is_available } = req.body;
  if (!table_number || !capacity) {
    return res.status(400).json({ message: 'Thiếu table_number hoặc capacity' });
  }
  const query = `
    INSERT INTO Tables (table_number, capacity, location, is_available)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [table_number, capacity, location || null, is_available ? 1 : 0], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId, message: 'Thêm bàn thành công' });
  });
});

// PUT update table
router.put('/:id', (req, res) => {
  const { table_number, capacity, location, is_available } = req.body;
  const query = `
    UPDATE Tables
    SET table_number = ?, capacity = ?, location = ?, is_available = ?
    WHERE table_id = ?
  `;
  db.query(query, [table_number, capacity, location || null, is_available ? 1 : 0, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy bàn' });
    res.json({ message: 'Cập nhật bàn thành công' });
  });
});

// DELETE table
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Tables WHERE table_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy bàn' });
    res.json({ message: 'Xóa bàn thành công' });
  });
});

module.exports = router;