import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../components/ModalForm';

function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadPromotions();
  }, [search]);

  const loadPromotions = () => {
    axios.get(`http://localhost:3001/api/promotions?search=${search}`)
      .then(res => setPromotions(res.data))
      .catch(err => console.error(err));
  };

  const handleSave = (data) => {
    const method = editItem ? 'put' : 'post';
    const url = editItem ? `http://localhost:3001/api/promotions/${editItem.promo_id}` : 'http://localhost:3001/api/promotions';
    axios[method](url, data)
      .then(() => {
        setShowModal(false);
        setEditItem(null);
        loadPromotions();
      })
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Xác nhận xóa khuyến mãi này?')) {
      axios.delete(`http://localhost:3001/api/promotions/${id}`)
        .then(() => loadPromotions())
        .catch(err => console.error(err));
    }
  };

  const fields = [
    { id: 'code', label: 'Mã khuyến mãi', required: true },
    { id: 'description', label: 'Mô tả' },
    { id: 'discount_type', label: 'Loại giảm', type: 'select', options: [
      { value: 'percentage', label: 'Phần trăm (%)' },
      { value: 'fixed', label: 'Số tiền cố định' }
    ], required: true },
    { id: 'discount_value', label: 'Giá trị giảm', type: 'number', required: true },
    { id: 'min_order_amount', label: 'Đơn tối thiểu', type: 'number' },
    { id: 'start_date', label: 'Ngày bắt đầu', type: 'date', required: true },
    { id: 'end_date', label: 'Ngày kết thúc', type: 'date', required: true },
    { id: 'is_active', label: 'Hoạt động', type: 'select', options: [
      { value: '1', label: 'Có' },
      { value: '0', label: 'Không' }
    ], required: true }
  ];

  return (
    <div>
      <h2>Quản lý Khuyến mãi</h2>
      <input
        type="text"
        placeholder="Tìm kiếm mã hoặc mô tả..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control mb-3"
      />
      <button className="btn btn-primary mb-3" onClick={() => { setEditItem(null); setShowModal(true); }}>
        Thêm khuyến mãi mới
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã</th>
            <th>Mô tả</th>
            <th>Loại</th>
            <th>Giá trị</th>
            <th>Đơn tối thiểu</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th>Số lần dùng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map(promo => (
            <tr key={promo.promo_id}>
              <td>{promo.promo_id}</td>
              <td>{promo.code}</td>
              <td>{promo.description}</td>
              <td>{promo.discount_type === 'percentage' ? '%' : 'VNĐ'}</td>
              <td>{promo.discount_value}</td>
              <td>{promo.min_order_amount || 0}</td>
              <td>{promo.start_date} → {promo.end_date}</td>
              <td>
                <span className={`badge ${promo.is_active ? 'bg-success' : 'bg-secondary'}`}>
                  {promo.is_active ? 'Hoạt động' : 'Tắt'}
                </span>
              </td>
              <td>{promo.usage_count || 0}</td>
              <td>
                <button className="btn btn-warning me-2 btn-sm" onClick={() => { setEditItem(promo); setShowModal(true); }}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(promo.promo_id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        title={editItem ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
        fields={fields}
        initialData={editItem || {}}
      />
    </div>
  );
}

export default PromotionsPage;