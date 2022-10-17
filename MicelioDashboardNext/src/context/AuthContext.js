import { createContext, useEffect, useState } from 'react';
import Api from '../services/Api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Api.get('/user')
      .then((response) => {
        setUser(response.data.data);

      })
      .catch(() => {
        setUser(null);

      });
  }, []);

  return <AuthContext.Provider value={{ user, setUser}}>{children}</AuthContext.Provider>;
};
