export type User = {
  authenticated: boolean,
  userId: number,
  isAdmin: boolean
}

export type AuthContextData = {
  user?: User,
  setUser?: React.Dispatch<React.SetStateAction<User>>
}
