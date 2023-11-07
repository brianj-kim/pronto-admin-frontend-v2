import { ReactNode, createContext, useState } from "react";
import { AuthContextData, User } from "../type";

type AuthProps = {
  children?: ReactNode
}

const AuthContext = createContext<AuthContextData>({
  user: {
    authenticated: false,
    userId: 0,
    isAdmin: false
  },
  setUser: () => {}
})

const AuthProvider = ({ children }: AuthProps) => {
  const [user, setUser] = useState<User>({
    authenticated: false,
    userId: 0,
    isAdmin: false
  });  

  return (
    <AuthContext.Provider value={{ user, setUser }} >
       {children}
    </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }