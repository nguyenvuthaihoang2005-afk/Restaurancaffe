import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../components/ModalForm';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [search]);

  const loadOrders = () => {
    axios.get(`http://localhost:3001/api/orders?search=${search}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const handleSave = (data) => {
    const method = editItem ? 'put' : 'post';
    const url = editItem ? `http://localhost:3001/api/orders/${editItem.order_id}` : 'http://localhost:3001/api/orders';
    axios[method](url, data)
      .then(() => {
        setShowModal(false);
        setEditItem(null);
        loadOrders();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa đơn hàng này?')) {
      axios.delete(`http://localhost:3001/api/orders/${id}`)
        .then(() => loadOrders())
        .catch(err => console.error(err));
    }
  };

  const fields = [
    { id: 'user_id', label: 'ID Khách hàng', type: 'number', required: true },
    { id: 'table_id', label: 'ID Bàn', type: 'number' },
    { id: 'status', label: 'Trạng thái', type: 'select', options: [
      { value: 'pending', label: 'Chờ xử lý' },
      { value: 'preparing', label: 'Đang chuẩn bị' },
      { value: 'served', label: 'Đã phục vụ' },
      { value: 'completed', label: 'Hoàn thành' },
      { value: 'cancelled', label: 'Hủy' }
    ], required: true },
    { id: 'discount_amount', label: 'Giảm giá', type: 'number' }
  ];

  return (
    <div>
      <h2>Quản lý Đơn hàng</h2>
      <input
        type="text"
        placeholder="Tìm kiếm theo ID đơn hoặc tên khách..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control mb-3"
      />
      <button className="btn btn-primary mb-3" onClick={() => { setEditItem(null); setShowModal(true); }}>
        Thêm đơn hàng mới
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Bàn</th>
            <th>Thời gian</th>
            <th>Tổng tiền</th>
            <th>Giảm giá</th>
            <th>Thành tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.user_name || 'N/A'}</td>
              <td>{order.table_number || 'Mang về'}</td>
              <td>{new Date(order.order_time).toLocaleString('vi-VN')}</td>
              <td>{order.calculated_total || order.total_amount}</td>
              <td>{order.discount_amount}</td>
              <td>{order.final_amount}</td>
              <td>
                <span className={`badge ${order.status === 'completed' ? 'bg-success' : order.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <button className="btn btn-warning me-2 btn-sm" onClick={() => { setEditItem(order); setShowModal(true); }}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order.order_id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        title={editItem ? 'Sửa đơn hàng' : 'Thêm đơn hàng mới'}
        fields={fields}
        initialData={editItem || {}}
      />
    </div>
  );
}

export default OrdersPage;