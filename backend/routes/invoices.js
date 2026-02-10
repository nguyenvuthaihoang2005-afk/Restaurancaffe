const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all invoices (join Orders)
router.get('/', (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : '%';
  const query = `
    SELECT 
      i.invoice_id, i.invoice_date, i.total_amount, i.tax_amount, i.final_amount, i.status,
      o.order_id, o.order_time, o.final_amount AS order_final,
      u.full_name AS user_name
    FROM Invoices i
    JOIN Orders o ON i.order_id = o.order_id
    LEFT JOIN Users u ON o.user_id = u.user_id
    WHERE i.invoice_id LIKE ? OR o.order_id LIKE ?
    ORDER BY i.invoice_date DESC
  `;
  db.query(query, [search, search], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new invoice
router.post('/', (req, res) => {
  const { order_id, total_amount, tax_amount, status } = req.body;
  const query = `
    INSERT INTO Invoices (order_id, total_amount, tax_amount, status)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [order_id, total_amount, tax_amount || 0, status || 'unpaid'], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId });
  });
});

// PUT update invoice (thường là cập nhật status thành 'paid')
router.put('/:id', (req, res) => {
  const { total_amount, tax_amount, status } = req.body;
  const query = `
    UPDATE Invoices
    SET total_amount = ?, tax_amount = ?, status = ?
    WHERE invoice_id = ?
  `;
  db.query(query, [total_amount, tax_amount || 0, status, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    res.json({ message: 'Cập nhật hóa đơn thành công' });
  });
});

// DELETE invoice
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Invoices WHERE invoice_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    res.json({ message: 'Xóa hóa đơn thành công' });
  });
});

module.exports = router;