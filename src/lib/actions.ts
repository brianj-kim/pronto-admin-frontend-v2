import { API_URL, CategoryData, MenuData, UpdateOrdersDTO } from "./definitions";

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
    username: result.nickname,
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

export const updateMenuState = async (
  m: MenuData,
  c: CategoryData,
  cs: CategoryData[],
  setCategories: React.Dispatch<React.SetStateAction<CategoryData[] | null>>
): Promise<void> => {
  let newMenus: MenuData[];
  if (c!.menus!.length === 0) {
    newMenus = [...c!.menus!, m];
  } else {
    newMenus = c!.menus!.map((mp) => {
      if (mp.mid === m.mid) {
        return m;
      }
      return mp;
    });
  }

  const newCategory = { ...c, menus: newMenus };

  const newCategories = cs.map((cp) => {
    if (cp.cid === c.cid) {
      return newCategory;
    }
    return cp;
  });

  setCategories(newCategories);
};

export const reorderCategories = async (
  newOrders: UpdateOrdersDTO[]
  
  ): Promise<void> => {
  try {
    const res = await fetch(API_URL + '/sorts/', {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({cond: 'category', orders: newOrders})
    });

    if(!res.ok) {
      throw new Error(`HTTP error, Status: ${res.status}`)
    }

    const data = await res.json();

    console.log(data);
  
  } catch (err) {
    console.error('Fetch erro', err);
  }   
}

export const reorderMenus = async (
  newOrders: UpdateOrdersDTO[]
): Promise<void> => {
  try {
    const res = await fetch(API_URL + '/sorts/', {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({cond: 'menu', orders: newOrders})
    });

    if(!res.ok) {
      throw new Error(`HTTP error, Status: ${res.status}`)
    }

    const data = await res.json();

    console.log(data);
  } catch (err) {
    console.error('Fetch error', err);
  }
}