import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../components/ModalForm';

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadReservations();
  }, [search]);

  const loadReservations = () => {
    axios.get(`http://localhost:3001/api/reservations?search=${search}`)
      .then(res => setReservations(res.data))
      .catch(err => console.error(err));
  };

  const handleSave = (data) => {
    const method = editItem ? 'put' : 'post';
    const url = editItem ? `http://localhost:3001/api/reservations/${editItem.reservation_id}` : 'http://localhost:3001/api/reservations';
    axios[method](url, data)
      .then(() => {
        setShowModal(false);
        setEditItem(null);
        loadReservations();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa đặt bàn này?')) {
      axios.delete(`http://localhost:3001/api/reservations/${id}`)
        .then(() => loadReservations())
        .catch(err => console.error(err));
    }
  };

  const fields = [
    { id: 'user_id', label: 'ID Khách hàng', type: 'number', required: true },
    { id: 'table_id', label: 'ID Bàn', type: 'number', required: true },
    { id: 'reservation_time', label: 'Thời gian đặt', type: 'datetime-local', required: true },
    { id: 'number_of_guests', label: 'Số người', type: 'number', required: true },
    { id: 'status', label: 'Trạng thái', type: 'select', options: [
      { value: 'pending', label: 'Chờ xác nhận' },
      { value: 'confirmed', label: 'Đã xác nhận' },
      { value: 'cancelled', label: 'Đã hủy' },
      { value: 'completed', label: 'Hoàn thành' }
    ], required: true },
    { id: 'notes', label: 'Ghi chú' }
  ];

  return (
    <div>
      <h2>Quản lý Đặt bàn</h2>
      <input
        type="text"
        placeholder="Tìm kiếm theo tên khách hoặc số bàn..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control mb-3"
      />
      <button className="btn btn-primary mb-3" onClick={() => { setEditItem(null); setShowModal(true); }}>
        Thêm đặt bàn mới
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Số bàn</th>
            <th>Thời gian</th>
            <th>Số người</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res.reservation_id}>
              <td>{res.reservation_id}</td>
              <td>{res.user_name || 'N/A'} ({res.user_phone || ''})</td>
              <td>{res.table_number} ({res.capacity} người)</td>
              <td>{new Date(res.reservation_time).toLocaleString('vi-VN')}</td>
              <td>{res.number_of_guests}</td>
              <td>
                <span className={`badge ${res.status === 'confirmed' ? 'bg-success' : res.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}>
                  {res.status === 'pending' ? 'Chờ' : res.status === 'confirmed' ? 'Xác nhận' : res.status === 'cancelled' ? 'Hủy' : 'Hoàn thành'}
                </span>
              </td>
              <td>
                <button className="btn btn-warning me-2 btn-sm" onClick={() => { setEditItem(res); setShowModal(true); }}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(res.reservation_id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        title={editItem ? 'Sửa đặt bàn' : 'Thêm đặt bàn mới'}
        fields={fields}
        initialData={editItem || {}}
      />
    </div>
  );
}

export default ReservationsPage;