import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { API_URL, AuthContextProps, User } from "../lib/definitions";
import { useLocalStorage } from '../customHooks/useLocalStorage';
import { isExpired, tokenToUser } from '../lib/actions';

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getItem, removeItem } = useLocalStorage();
  const [user, setUser] = useState<User | null>(null);

  const removeUser = useCallback(() => {
    setUser(null);
    removeItem('isAuthenticated');
    removeItem('refreshExp');
  },[setUser, removeItem]);

  const isAuthenticated = getItem('isAuthenticated') === 'true' ? true : false;
  const refreshExp = Number(getItem('refreshExp'));

  useEffect(() => {
    const refreshFetch = async () => {
      if (isAuthenticated && isExpired(refreshExp)) {
        
        const response = await fetch(API_URL + '/refresh/', {
          method: 'GET',
          credentials: 'include'
        });

        // console.log(response);
        // return;
  
        if (response.status === 200) {
          const data = await response.json();
          if(!data.is_error) {
            setUser(tokenToUser(data.access_token));
          }
          return;
        }
        return;

      } else {
        // TODO:: delete everything and go to login page
        removeUser();
      }

      return;
    }

    refreshFetch();
  },[isAuthenticated, refreshExp, removeUser]);

  const contextValue: AuthContextProps = {
    user, 
    isAuthenticated, 
    setUser,
    removeUser
  }

  return (
    <AuthContext.Provider value={ contextValue } >
      { children }
    </AuthContext.Provider>
  )
}
