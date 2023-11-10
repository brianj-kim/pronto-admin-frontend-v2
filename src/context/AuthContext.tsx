import { ReactNode, createContext, useState } from "react";
import { AuthContextData, User } from "../lib/definitions";

type AuthProps = {
  children?: ReactNode
};

const AuthContext = createContext<AuthContextData>({
  user: {
    userId: 0,
    isAdmin: false,
    AccessToken: '',
    RefreshToken: ''
  },
  setUser: () => {}
});

const AuthProvider = ({ children }: AuthProps) => {
  const [user, setUser] = useState<User>({
    userId: 0,
    isAdmin: false,
    AccessToken: '',
    RefreshToken: ''
  });  

  return (
    <AuthContext.Provider value={{ user, setUser }} >
       {children}
    </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }