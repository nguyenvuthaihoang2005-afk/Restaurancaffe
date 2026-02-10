const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all orders (join OrderItems để tính tổng subtotal nếu cần)
router.get('/', (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : '%';
  const query = `
    SELECT 
      o.order_id, o.user_id, o.table_id, o.order_time, o.status, 
      o.total_amount, o.discount_amount, o.final_amount,
      u.full_name AS user_name,
      t.table_number,
      (SELECT SUM(subtotal) FROM OrderItems WHERE order_id = o.order_id) AS calculated_total
    FROM Orders o
    LEFT JOIN Users u ON o.user_id = u.user_id
    LEFT JOIN Tables t ON o.table_id = t.table_id
    WHERE o.order_id LIKE ? OR u.full_name LIKE ?
    ORDER BY o.order_time DESC
  `;
  db.query(query, [search, search], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new order
router.post('/', (req, res) => {
  const { user_id, table_id, status } = req.body;
  const query = `
    INSERT INTO Orders (user_id, table_id, status)
    VALUES (?, ?, ?)
  `;
  db.query(query, [user_id, table_id || null, status || 'pending'], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ order_id: results.insertId });
  });
});

// PUT update order (cập nhật status, discount, v.v.)
router.put('/:id', (req, res) => {
  const { status, discount_amount } = req.body;
  const query = `
    UPDATE Orders
    SET status = ?, discount_amount = ?
    WHERE order_id = ?
  `;
  db.query(query, [status, discount_amount || 0, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json({ message: 'Cập nhật đơn hàng thành công' });
  });
});

// DELETE order
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Orders WHERE order_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json({ message: 'Xóa đơn hàng thành công' });
  });
});

module.exports = router;