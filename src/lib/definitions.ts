export const API_URL: string = 'http://localhost:3000/backend';

export type NavItemType = {
  id: string;
  label: string;
  path: string;
}

export type User = {
  userId: number;
  isAdmin: boolean;
  email: string;
  nickname: string;
}

export type AuthContextData = {
  user: User | null;
  setUser: (user: User) => void;
}
