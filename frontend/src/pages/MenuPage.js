import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../components/ModalForm';

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadMenuItems();
  }, [search]);

  const loadMenuItems = () => {
    axios.get(`http://localhost:3001/api/menu?search=${search}`)
      .then(res => setMenuItems(res.data))
      .catch(err => console.error(err));
  };

  const handleSave = (data) => {
    const method = editItem ? 'put' : 'post';
    const url = editItem ? `http://localhost:3001/api/menu/${editItem.item_id}` : 'http://localhost:3001/api/menu';
    axios[method](url, data)
      .then(() => {
        setShowModal(false);
        setEditItem(null);
        loadMenuItems();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa?')) {
      axios.delete(`http://localhost:3001/api/menu/${id}`)
        .then(() => loadMenuItems())
        .catch(err => console.error(err));
    }
  };

  const fields = [
    { id: 'name', label: 'Tên món', required: true },
    { id: 'description', label: 'Mô tả' },
    { id: 'price', label: 'Giá', type: 'number', required: true },
    { id: 'category', label: 'Danh mục', type: 'select', options: [
      { value: 'food', label: 'Món ăn' },
      { value: 'drink', label: 'Đồ uống' },
      { value: 'dessert', label: 'Tráng miệng' },
      { value: 'other', label: 'Khác' }
    ], required: true },
    { id: 'image_url', label: 'URL ảnh' },
    { id: 'is_available', label: 'Có sẵn', type: 'checkbox' }
  ];

  return (
    <div>
      <h2>Quản lý Thực đơn</h2>
      <input
        type="text"
        placeholder="Tìm kiếm tên món..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control mb-3"
      />
      <button className="btn btn-primary mb-3" onClick={() => { setEditItem(null); setShowModal(true); }}>
        Thêm món mới
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Có sẵn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.item_id}>
              <td>{item.item_id}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.category}</td>
              <td>{item.is_available ? 'Có' : 'Không'}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => { setEditItem(item); setShowModal(true); }}>Sửa</button>
                <button className="btn btn-danger" onClick={() => handleDelete(item.item_id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        title={editItem ? 'Sửa món' : 'Thêm món mới'}
        fields={fields}
        initialData={editItem || {}}
      />
    </div>
  );
}

export default MenuPage;