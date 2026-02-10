// frontend/src/pages/Dashboard.js
// Trang chủ sau đăng nhập, hiển thị tổng quan và link nhanh đến các chức năng
import React from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  // Dữ liệu demo cho chart doanh thu (có thể fetch từ API /api/orders sau)
  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3'],
    datasets: [{
      label: 'Doanh thu (VNĐ)',
      data: [5000000, 7500000, 10000000],
      backgroundColor: 'rgba(118, 75, 162, 0.6)',
      borderColor: 'rgba(118, 75, 162, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Doanh thu hàng tháng' }
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Trang chủ - Chào mừng, Vũ Thái Hoàng!</h2>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Thực đơn</h5>
              <p className="card-text">Quản lý món ăn và đồ uống</p>
              <Link to="/menu" className="btn btn-primary">Truy cập</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Đơn hàng</h5>
              <p className="card-text">Xem và quản lý đơn hàng</p>
              <Link to="/orders" className="btn btn-primary">Truy cập</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Thanh toán</h5>
              <p className="card-text">Quản lý giao dịch thanh toán</p>
              <Link to="/payments" className="btn btn-primary">Truy cập</Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5 className="card-title">Hóa đơn</h5>
              <p className="card-text">Xem và in hóa đơn</p>
              <Link to="/invoices" className="btn btn-primary">Truy cập</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Quản lý Admin & Nhân viên</h5>
              <p>Xem danh sách người dùng với vai trò admin/staff</p>
              <Link to="/users" className="btn btn-secondary">Quản lý</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Thống kê nhanh</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Đơn hàng hôm nay: 15</li>
                <li className="list-group-item">Doanh thu hôm nay: 5.000.000 VNĐ</li>
                <li className="list-group-item">Bàn đang sử dụng: 4/10</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;