// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import MenuPage from './pages/MenuPage';
import TablesPage from './pages/TablesPage';
import ReservationsPage from './pages/ReservationsPage';
import OrdersPage from './pages/OrdersPage';
import PromotionsPage from './pages/PromotionsPage';
import InvoicesPage from './pages/InvoicesPage';
import PaymentsPage from './pages/PaymentsPage';
import 'bootstrap/dist/css/bootstrap.min.css';

// Component Login (demo - bạn có thể nâng cấp sau)
function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Demo: Kiểm tra cứng (sau này thay bằng gọi API backend /api/login)
    if (username === 'admin' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({ username: 'admin', role: 'admin' }));
      onLoginSuccess();
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Đăng nhập Restaurants Cafe</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên đăng nhập</label>
            <input 
              type="text" 
              className="form-control" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('isLoggedIn'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <div className="d-flex">
          {/* Sidebar */}
          <nav className="sidebar bg-dark text-white vh-100 p-3" style={{ width: '250px' }}>
            <h4 className="text-center mb-4">Restaurants Cafe</h4>
            <ul className="nav flex-column">
              <li className="nav-item"><Link className="nav-link text-white" to="/">Trang chủ</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/users">Quản lý người dùng</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/menu">Thực đơn</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/tables">Quản lý bàn</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/reservations">Đặt bàn</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/orders">Đơn hàng</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/promotions">Khuyến mãi</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/invoices">Hóa đơn</Link></li>
              <li className="nav-item"><Link className="nav-link text-white" to="/payments">Thanh toán</Link></li>
              <li className="nav-item">
                <button className="nav-link text-white btn btn-link p-0" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </li>
            </ul>
          </nav>

          {/* Nội dung chính */}
          <main className="flex-grow-1 p-4 bg-light">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/tables" element={<TablesPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </Router>
  );
}

export default App;