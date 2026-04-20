import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Toast from './components/Toast';
import { fetchMe } from './api/auth';
import useAuthStore from './store/useAuthStore';
import useToastStore from './store/useToastStore';

const App = () => {
  const { token, setAuth, logout } = useAuthStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    if (!token) return undefined;
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const data = await fetchMe();
        if (isMounted && data?.user) {
          setAuth(data.user, token);
        }
      } catch (err) {
        if (isMounted) {
          logout();
          showToast('Session expired, please log in again');
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, [token, setAuth, logout, showToast]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toast />
    </BrowserRouter>
  );
};

export default App;
