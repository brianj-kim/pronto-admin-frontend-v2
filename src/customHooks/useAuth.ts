import { useUser } from "./useUser";
import { useLocalStorage } from "./useLocalStorage";
import { useEffect } from "react";
import { Decode } from "../lib/decod";
import Actions from "../lib/actions";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, addUser, removeUser } = useUser();  
  const { decoder } = Decode();
  const { getItem } = useLocalStorage();
  const { checkExpired } = Actions();
  const token = getItem('AccessToken');

  if(token == '') navigate('/admin/login');

  const payload = decoder(token.split('.')[1]);
  payload['userId'] = payload['sub'];
  payload['isAdmin'] = payload['is_admin'];    
  delete payload['sub'];
  delete payload['is_admin'];  

  const auth = () => {
    if(checkExpired(payload.exp)) {
      addUser(payload);
    } else {
      //TODO
      // Add when access token expries 
      // Then take refresh token and re-authorize
      console.log('token has expired');
    }
  }

  const removeAuth = () => {
    removeUser();
  };

  useEffect(() => {
    auth();
  },[]);

  return { user, auth, removeAuth };
}