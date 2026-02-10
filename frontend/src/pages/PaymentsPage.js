import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../components/ModalForm';

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadPayments();
  }, [search]);

  const loadPayments = () => {
    axios.get(`http://localhost:3001/api/payments?search=${search}`)
      .then(res => setPayments(res.data))
      .catch(err => console.error(err));
  };

  const handleSave = (data) => {
    const method = editItem ? 'put' : 'post';
    const url = editItem ? `http://localhost:3001/api/payments/${editItem.payment_id}` : 'http://localhost:3001/api/payments';
    axios[method](url, data)
      .then(() => {
        setShowModal(false);
        setEditItem(null);
        loadPayments();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa thanh toán này?')) {
      axios.delete(`http://localhost:3001/api/payments/${id}`)
        .then(() => loadPayments())
        .catch(err => console.error(err));
    }
  };

  const fields = [
    { id: 'invoice_id', label: 'ID Hóa đơn', type: 'number', required: true },
    { id: 'payment_method', label: 'Phương thức', type: 'select', options: [
      { value: 'cash', label: 'Tiền mặt' },
      { value: 'credit_card', label: 'Thẻ tín dụng' },
      { value: 'bank_transfer', label: 'Chuyển khoản' },
      { value: 'mobile_wallet', label: 'Ví điện tử' }
    ], required: true },
    { id: 'amount_paid', label: 'Số tiền thanh toán', type: 'number', required: true },
    { id: 'transaction_id', label: 'Mã giao dịch' },
    { id: 'status', label: 'Trạng thái', type: 'select', options: [
      { value: 'pending', label: 'Chờ xử lý' },
      { value: 'success', label: 'Thành công' },
      { value: 'failed', label: 'Thất bại' }
    ], required: true }
  ];

  return (
    <div>
      <h2>Quản lý Thanh toán</h2>
      <input
        type="text"
        placeholder="Tìm kiếm theo ID thanh toán hoặc mã giao dịch..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control mb-3"
      />
      <button className="btn btn-primary mb-3" onClick={() => { setEditItem(null); setShowModal(true); }}>
        Thêm thanh toán mới
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Hóa đơn</th>
            <th>Phương thức</th>
            <th>Số tiền</th>
            <th>Ngày thanh toán</th>
            <th>Mã giao dịch</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(pay => (
            <tr key={pay.payment_id}>
              <td>{pay.payment_id}</td>
              <td>{pay.invoice_id}</td>
              <td>{pay.payment_method}</td>
              <td>{pay.amount_paid}</td>
              <td>{new Date(pay.payment_date).toLocaleString('vi-VN')}</td>
              <td>{pay.transaction_id || 'N/A'}</td>
              <td>
                <span className={`badge ${pay.status === 'success' ? 'bg-success' : pay.status === 'failed' ? 'bg-danger' : 'bg-warning'}`}>
                  {pay.status}
                </span>
              </td>
              <td>
                <button className="btn btn-warning me-2 btn-sm" onClick={() => { setEditItem(pay); setShowModal(true); }}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(pay.payment_id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        title={editItem ? 'Sửa thanh toán' : 'Thêm thanh toán mới'}
        fields={fields}
        initialData={editItem || {}}
      />
    </div>
  );
}

export default PaymentsPage;