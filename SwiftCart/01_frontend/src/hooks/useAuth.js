import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/authSlice';
import { useNotification } from '../context/NotificationContext';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { addNotification } = useNotification();

  const handleLogin = (userData, token) => {
    dispatch(login({ user: userData, token }));
    addNotification(`Welcome back, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    dispatch(logout());
    addNotification('Logged out successfully', 'info');
  };

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
  };
};
