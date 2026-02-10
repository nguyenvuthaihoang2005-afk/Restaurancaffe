import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../components/ModalForm';

function TablesPage() {
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadTables();
  }, [search]);

  const loadTables = () => {
    axios.get(`http://localhost:3001/api/tables?search=${search}`)
      .then(res => setTables(res.data))
      .catch(err => console.error(err));
  };

  const handleSave = (data) => {
    const method = editItem ? 'put' : 'post';
    const url = editItem ? `http://localhost:3001/api/tables/${editItem.table_id}` : 'http://localhost:3001/api/tables';
    axios[method](url, data)
      .then(() => {
        setShowModal(false);
        setEditItem(null);
        loadTables();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa bàn này?')) {
      axios.delete(`http://localhost:3001/api/tables/${id}`)
        .then(() => loadTables())
        .catch(err => console.error(err));
    }
  };

  const fields = [
    { id: 'table_number', label: 'Số bàn', required: true },
    { id: 'capacity', label: 'Sức chứa (người)', type: 'number', required: true },
    { id: 'location', label: 'Vị trí' },
    { id: 'is_available', label: 'Trạng thái', type: 'select', options: [
      { value: '1', label: 'Trống' },
      { value: '0', label: 'Đang sử dụng' }
    ], required: true }
  ];

  return (
    <div>
      <h2>Quản lý Bàn</h2>
      <input
        type="text"
        placeholder="Tìm kiếm số bàn hoặc vị trí..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control mb-3"
      />
      <button className="btn btn-primary mb-3" onClick={() => { setEditItem(null); setShowModal(true); }}>
        Thêm bàn mới
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Số bàn</th>
            <th>Sức chứa</th>
            <th>Vị trí</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tables.map(table => (
            <tr key={table.table_id}>
              <td>{table.table_id}</td>
              <td>{table.table_number}</td>
              <td>{table.capacity}</td>
              <td>{table.location || 'Chưa xác định'}</td>
              <td>
                <span className={`badge ${table.is_available ? 'bg-success' : 'bg-danger'}`}>
                  {table.is_available ? 'Trống' : 'Đang sử dụng'}
                </span>
              </td>
              <td>
                <button className="btn btn-warning me-2 btn-sm" onClick={() => { setEditItem(table); setShowModal(true); }}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(table.table_id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        title={editItem ? 'Sửa bàn' : 'Thêm bàn mới'}
        fields={fields}
        initialData={editItem || {}}
      />
    </div>
  );
}

export default TablesPage;