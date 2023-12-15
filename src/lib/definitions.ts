import { Dispatch, SetStateAction } from "react";

export const API_URL: string = 'http://gopronto.ca/backend';
export const HOME_URL: string = 'http://gopronto.ca';

export type NavItemType = {
  id: string;
  label: string;
  path: string;
}

export type User = {
  userId: number;
  isAdmin: boolean;
  username: string;
  accessToken: string;
}
export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  removeUser: () => void;
}

export type Auth = {
  user: User | null,
  accessToken: string
}

export type AuthContextState = {
  auth: Auth | null;
  setAuth: Dispatch<SetStateAction<Auth | null>>;
}

export type UserPayload = {
  sub: number;
  nickname: string;
  roles: string[];
  exp: number
}
export type MenuData = {
  "mid": number;
  "order": number;
  "title": string;
  "details": string;
  "image": string;
  "price": string;
  "isVeggie": boolean;
  "isSpicy": boolean;
}

export type CategoryData = {
  "cid": number;
  "order": number;
  "title": string;
  "details": string;
  "image": string;
  "menus": MenuData[] | null;
}

export interface IModal {
  onClose?: VoidFunction;
  visible?: boolean;
}

export type OpenModal<T> = (params: T) => void;