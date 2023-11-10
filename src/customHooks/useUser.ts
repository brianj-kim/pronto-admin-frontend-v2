import { useContext } from "react";
import { AuthContextData, User } from "../lib/definitions";
import { AuthContext } from "../context/AuthContext";
import { useLocalStorage } from "./useLocalStorage";

export const useUser = () => {
  const { user, setUser } = useContext<AuthContextData>(AuthContext);
  const { initStorage } = useLocalStorage();
  const addUser = (user: User) => {
    setUser(user);
  }

  const removeUser = (): void => {
    setUser({
      userId: 0,
      isAdmin: false,
      email: '',
      nickname: ''
    });
    
    initStorage();
  }

  return { user, addUser, removeUser }
}