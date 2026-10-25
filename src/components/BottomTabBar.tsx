import { NavLink } from 'react-router-dom';

export const BottomTabBar = () => {
  return (
    <div className="tab-bar">
      <NavLink
        to="/feed"
        className={({ isActive }) => `tab-item ${isActive ? 'active' : 'inactive'}`}
      >
        <span className="tab-icon">▦</span>
        <span>Лента</span>
      </NavLink>

      <span className="tab-item inactive">
        <span className="tab-icon">＋</span>
        <span>Добавить</span>
      </span>

      <NavLink
        to="/grid"
        className={({ isActive }) => `tab-item ${isActive ? 'active' : 'inactive'}`}
      >
        <span className="tab-icon">❖</span>
        <span>Плитка</span>
      </NavLink>

      {}
      <span className="tab-item inactive">
        <span>Вход</span>
      </span>
    </div>
  );
};
