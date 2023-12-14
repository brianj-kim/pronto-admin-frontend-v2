
export const urlDecode = (url: string): string => {
  url.replace(/-/g, "+")
      .replace(/_/g, "/");

  return url;
}

export const jwtDecode = (token: string) => {
  return JSON.parse(atob(urlDecode(token)));
}

export const isExpired = (ex: number) => {
  return ex < Math.floor(Date.now() / 1000);
}

export const tokenToUser = (token: string) => {
  const result = jwtDecode(token.split('.')[1]);

  return {
    userId: result.sub,      
    username: result.nikcname,
    isAdmin: result.roles.includes('root-admin'),
    accessToken: token
  };
}

export const isAdmin = (userRoles: string[]): boolean => {
  return userRoles.includes('root-admin');
}

export const isTokenExpired = (token: string): boolean => {
  const payload = jwtDecode(token.split('.')[1]);
  return isExpired(payload.exp);
}