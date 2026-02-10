const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  }
});

// GET all
router.get('/', (req, res) => {
  db.query('SELECT * FROM MenuItems', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST - Thêm mới
router.post('/', upload.single('image'), (req, res) => {
  console.log('POST request received:', req.body, req.file); // Debug

  const { name, description, price, category, is_available } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
  }

  db.query(
    'INSERT INTO MenuItems (name, description, price, category, image_path, is_available) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description || null, price, category, image_path, is_available ? 1 : 0],
    (err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, message: 'Thêm thành công' });
    }
  );
});

// PUT - Sửa
router.put('/:id', upload.single('image'), (req, res) => {
  console.log('PUT request received:', req.body, req.file); // Debug

  const { name, description, price, category, is_available, existing_image_path } = req.body;
  let image_path = existing_image_path || null;

  if (req.file) {
    image_path = `/uploads/${req.file.filename}`;
  }

  const query = `
    UPDATE MenuItems 
    SET name = ?, description = ?, price = ?, category = ?, image_path = ?, is_available = ?
    WHERE item_id = ?
  `;
  const params = [name, description || null, price, category, image_path, is_available ? 1 : 0, req.params.id];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Không tìm thấy món' });
    res.json({ message: 'Cập nhật thành công' });
  });
});

// DELETE (giữ nguyên)
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM MenuItems WHERE item_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Xóa thành công' });
  });
});

module.exports = router;