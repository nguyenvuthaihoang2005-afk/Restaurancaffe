const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all promotions (join OrderPromotions để xem đã áp dụng bao nhiêu)
router.get('/', (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : '%';
  const query = `
    SELECT 
      p.promo_id, p.code, p.description, p.discount_type, p.discount_value,
      p.min_order_amount, p.start_date, p.end_date, p.is_active,
      COUNT(op.order_promo_id) AS usage_count
    FROM Promotions p
    LEFT JOIN OrderPromotions op ON p.promo_id = op.promo_id
    WHERE p.code LIKE ? OR p.description LIKE ?
    GROUP BY p.promo_id
    ORDER BY p.start_date DESC
  `;
  db.query(query, [search, search], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST new promotion
router.post('/', (req, res) => {
  const { code, description, discount_type, discount_value, min_order_amount, start_date, end_date, is_active } = req.body;
  const query = `
    INSERT INTO Promotions (code, description, discount_type, discount_value, min_order_amount, start_date, end_date, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [code, description, discount_type, discount_value, min_order_amount || 0, start_date, end_date, is_active ? 1 : 0], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId });
  });
});

// PUT update promotion
router.put('/:id', (req, res) => {
  const { code, description, discount_type, discount_value, min_order_amount, start_date, end_date, is_active } = req.body;
  const query = `
    UPDATE Promotions
    SET code = ?, description = ?, discount_type = ?, discount_value = ?, min_order_amount = ?, start_date = ?, end_date = ?, is_active = ?
    WHERE promo_id = ?
  `;
  db.query(query, [code, description, discount_type, discount_value, min_order_amount || 0, start_date, end_date, is_active ? 1 : 0, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
    res.json({ message: 'Cập nhật khuyến mãi thành công' });
  });
});

// DELETE promotion
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Promotions WHERE promo_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
    res.json({ message: 'Xóa khuyến mãi thành công' });
  });
});

module.exports = router;