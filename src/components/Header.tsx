import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../pages/ui/button";
import clsx from "clsx";
import { useUser } from "../customHooks/useUser";
import { useLocalStorage } from "../customHooks/useLocalStorage";
import { API_URL, NavItemType } from "../lib/definitions";



const NavItemsList: NavItemType[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard"
  },

  {
    id: "menus",
    label: "Menus",
    path: "/admin/menus"
  },

  {
    id: "operations",
    label: "Operations",
    path: "/admin/operations"
  },

  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders"
  },
]

const NavItems = ({ showNavBar }: { showNavBar: boolean}) => {
  const { pathname } = useLocation();

  return (
    <div 
      className={`items-center justify-between w-full md:flex md:w-auto ${ showNavBar ? "" : "hidden" }`} 
      id="nav-items"
    >
      <ul className={`flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:space-x-8 md:mt-0 md:border-0 ${ showNavBar ? "border-none" : "border border-gray-100"}`} >
         { NavItemsList.map((item: NavItemType) => (
          <li
            className="text-white"
            key={item.id}
          >
            <Link to={item.path} 
              className={clsx(
                'cursor-pointer block pr-4 text-xs uppercase md:p-0 hover:text-lime-400 border-b-2 border-[#474747] hover:border-b-2 hover:border-lime-400',
                {
                  'text-lime-400 border-lime-400' : pathname === item.path
                },
              )}
            >{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Header = () => {
  const [showNavbar, setShowNavBar] = useState<boolean>(false);
  const { setItem, getItem } = useLocalStorage();
  const navigate = useNavigate();

  const { user, removeUser } = useUser();

  const logout = async (): Promise<void> => {
    await fetch(API_URL + '/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: getItem('RefreshToken') })
    })
      .then(res => res.json())
      .then(data => {
        if( data === 1) {
          removeUser();
          setItem('AccessToken', '');
          setItem('RefreshToken', '');
          navigate('/admin');
        }        
      })
      .catch ((err) => {
        console.error('Error', err);
      });
    
  }

  console.log( user );
  return (
    
  <nav className="bg-[#474747] fixed w-full z-10 top-0 left-0">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <Link to="/admin" className="flex items-center">
        <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Pronto Admin</span>
      </Link>
    
      <div className="flex md:order-2 gap-3">
        { user!.userId === 0 ? (
          <button 
            type="button" 
            className="text-lime-500 font-bold text-sm px-4 py-2 text-center mr-3 md:mr-0 uppercase"
            onClick={() => navigate('/admin/signup')}
           >
            Signup
          </button>
        ): null}        

        { user!.userId > 0 && user!.isAdmin ? (
          <Button 
            type="button"
            onClick={() => logout()}
          >
            LOGOUT
          </Button>
        ) : ( 
          <Button 
            type="button"            
            onClick={() => navigate('/admin/login')} 
          >
            LOGIN
          </Button> 
        )}
        
        <button 
          data-collapse-toggle="navbar-cta" 
          type="button" 
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
          aria-controls="navbar-cta" 
          aria-expanded="false"
          onClick={() => setShowNavBar(!showNavbar)}
          >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
      </div>

      <NavItems showNavBar={showNavbar} />

    </div>
  </nav>

  );
}

export default Header;