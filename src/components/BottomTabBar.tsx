import { NavLink } from 'react-router-dom';

export const BottomTabBar = () => {
  return (
    <div className="tab-bar">
      {/* Активные ссылки */}
      <NavLink
        to="/feed"
        className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
      >
        Лента
      </NavLink>

      {/* Неактивные кнопки (заглушки) */}
      <span className="tab-item disabled">Добавить</span>

      <NavLink
        to="/grid"
        className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}
      >
        Плитка
      </NavLink>

      <span className="tab-item disabled">Вход</span>
    </div>
  );
};
