const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all payments (join Invoices)
router.get('/', (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : '%';
  const query = `
    SELECT 
      p.payment_id, p.payment_method, p.amount_paid, p.payment_date, p.transaction_id, p.status,
      i.invoice_id, i.final_amount AS invoice_amount,
      o.order_id
    FROM Payments p
    JOIN Invoices i ON p.invoice_id = i.invoice_id
    JOIN Orders o ON i.order_id = o.order_id
    WHERE p.payment_id LIKE ? OR p.transaction_id LIKE ?
    ORDER BY p.payment_date DESC
  `;
  db.query(query, [search, search], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new payment
router.post('/', (req, res) => {
  const { invoice_id, payment_method, amount_paid, transaction_id, status } = req.body;
  const query = `
    INSERT INTO Payments (invoice_id, payment_method, amount_paid, transaction_id, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [invoice_id, payment_method, amount_paid, transaction_id || null, status || 'pending'], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId });
  });
});

// PUT update payment (thường cập nhật status thành 'success')
router.put('/:id', (req, res) => {
  const { payment_method, amount_paid, transaction_id, status } = req.body;
  const query = `
    UPDATE Payments
    SET payment_method = ?, amount_paid = ?, transaction_id = ?, status = ?
    WHERE payment_id = ?
  `;
  db.query(query, [payment_method, amount_paid, transaction_id || null, status, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy thanh toán' });
    res.json({ message: 'Cập nhật thanh toán thành công' });
  });
});

// DELETE payment
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Payments WHERE payment_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy thanh toán' });
    res.json({ message: 'Xóa thanh toán thành công' });
  });
});

module.exports = router;