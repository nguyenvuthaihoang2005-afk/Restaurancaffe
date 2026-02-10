// frontend/src/pages/UsersPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../components/ModalForm'; // nếu bạn đã có component này

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/users?search=${search}`);
        setUsers(response.data);
      } catch (err) {
        console.error('Lỗi khi tải người dùng:', err);
        alert('Không thể tải danh sách người dùng. Backend có đang chạy không?');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;

  return (
    <div>
      <h2>Quản lý Người dùng</h2>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo tên, username, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="7" className="text-center">Không tìm thấy người dùng</td></tr>
          ) : (
            users.map(user => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.username}</td>
                <td>{user.full_name || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>{user.phone_number || '-'}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'staff' ? 'bg-warning' : 'bg-success'}`}>
                    {user.role === 'admin' ? 'Quản trị' : user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-warning me-2">Sửa</button>
                  <button className="btn btn-sm btn-danger">Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;