import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../components/ModalForm';

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, [search]);

  const loadInvoices = () => {
    axios.get(`http://localhost:3001/api/invoices?search=${search}`)
      .then(res => setInvoices(res.data))
      .catch(err => console.error(err));
  };

  const handleSave = (data) => {
    const method = editItem ? 'put' : 'post';
    const url = editItem ? `http://localhost:3001/api/invoices/${editItem.invoice_id}` : 'http://localhost:3001/api/invoices';
    axios[method](url, data)
      .then(() => {
        setShowModal(false);
        setEditItem(null);
        loadInvoices();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa hóa đơn này?')) {
      axios.delete(`http://localhost:3001/api/invoices/${id}`)
        .then(() => loadInvoices())
        .catch(err => console.error(err));
    }
  };

  const fields = [
    { id: 'order_id', label: 'ID Đơn hàng', type: 'number', required: true },
    { id: 'total_amount', label: 'Tổng tiền', type: 'number', required: true },
    { id: 'tax_amount', label: 'Thuế', type: 'number' },
    { id: 'status', label: 'Trạng thái', type: 'select', options: [
      { value: 'unpaid', label: 'Chưa thanh toán' },
      { value: 'paid', label: 'Đã thanh toán' },
      { value: 'refunded', label: 'Hoàn tiền' }
    ], required: true }
  ];

  return (
    <div>
      <h2>Quản lý Hóa đơn</h2>
      <input
        type="text"
        placeholder="Tìm kiếm theo ID hóa đơn hoặc ID đơn..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control mb-3"
      />
      <button className="btn btn-primary mb-3" onClick={() => { setEditItem(null); setShowModal(true); }}>
        Thêm hóa đơn mới
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Đơn hàng</th>
            <th>Ngày lập</th>
            <th>Tổng tiền</th>
            <th>Thuế</th>
            <th>Thành tiền</th>
            <th>Trạng thái</th>
            <th>Khách hàng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.invoice_id}>
              <td>{inv.invoice_id}</td>
              <td>{inv.order_id}</td>
              <td>{new Date(inv.invoice_date).toLocaleString('vi-VN')}</td>
              <td>{inv.total_amount}</td>
              <td>{inv.tax_amount || 0}</td>
              <td>{inv.final_amount}</td>
              <td>
                <span className={`badge ${inv.status === 'paid' ? 'bg-success' : inv.status === 'refunded' ? 'bg-warning' : 'bg-danger'}`}>
                  {inv.status === 'unpaid' ? 'Chưa TT' : inv.status === 'paid' ? 'Đã TT' : 'Hoàn tiền'}
                </span>
              </td>
              <td>{inv.user_name || 'N/A'}</td>
              <td>
                <button className="btn btn-warning me-2 btn-sm" onClick={() => { setEditItem(inv); setShowModal(true); }}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(inv.invoice_id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        title={editItem ? 'Sửa hóa đơn' : 'Thêm hóa đơn mới'}
        fields={fields}
        initialData={editItem || {}}
      />
    </div>
  );
}

export default InvoicesPage;