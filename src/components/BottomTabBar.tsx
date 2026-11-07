import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { resetFilters } from '../store/slices/filtersSlice';
import { axiosInstance } from '../api/axiosInstance';

export const BottomTabBar = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/users/logout');
    } catch (e) {
      console.error('Ошибка при выходе', e);
    } finally {
      localStorage.removeItem('token');
      dispatch(logout());
      dispatch(resetFilters());

      navigate('/feed');
    }
  };

  return (
    <div className="tab-bar">
      <NavLink to="/feed" className={({ isActive }) => `tab-item ${isActive ? 'active' : 'inactive'}`}>
        <span className="tab-icon">▦</span>
        <span>Лента</span>
      </NavLink>

      <NavLink to="/add" className={({ isActive }) => `tab-item ${isActive ? 'active' : 'inactive'}`}>
        <span className="tab-icon">＋</span>
        <span>Добавить</span>
      </NavLink>

      <NavLink to="/grid" className={({ isActive }) => `tab-item ${isActive ? 'active' : 'inactive'}`}>
        <span className="tab-icon">❖</span>
        <span>Плитка</span>
      </NavLink>

      {isAuthenticated ? (
        <div
          onClick={handleLogout}
          className="tab-item inactive"
          style={{ cursor: 'pointer' }}
        >
          <span>Выход</span>
        </div>
      ) : (
        <NavLink to="/login" className={({ isActive }) => `tab-item ${isActive ? 'active' : 'inactive'}`}>
          <span>Вход</span>
        </NavLink>
      )}
    </div>
  );
};
