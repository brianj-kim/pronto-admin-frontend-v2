import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../pages/ui/button";
import clsx from "clsx";
import { NavItemType } from "../lib/definitions";
import { useAuth } from "../customHooks/useAuth";

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
                'cursor-pointer block pr-4 text-xs uppercase my-3 md:my-0 md:p-0 hover:text-lime-400 border-b-2 border-[#474747] hover:border-b-2 hover:border-lime-400',
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
  const navigate = useNavigate();

  const location = useLocation();

  const { user, removeUser } = useAuth();

  useEffect(() => {
    if(user && !(user.isAdmin) ) {
      removeUser();
    }
    // console.log(user);
  },[user, removeUser]);

  return (
    
  <nav className="bg-[#474747] fixed w-full z-10 top-0 left-0">
    <div className="w-xl lg:w-11/12 flex flex-wrap items-center justify-between mx-auto p-4">
      <Link to="/admin" className="flex items-center">
        <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Pronto Admin</span>
      </Link>
    
      <div className="flex md:order-2 gap-3 items-center">
        { !user ? (
          <button 
            type="button" 
            className={
              `font-bold text-xs px-2 h-6 uppercase rounded-md
              ${location.pathname.split('/')[location.pathname.split('/').length-1] === 'signup' ? `bg-lime-500 text-gray-700` : `text-lime-500 border border-lime-500`}
              `
            }
            onClick={() => navigate('/admin/signup')}
           >
            Signup
          </button>
        ): null}        

        { user && user!.isAdmin ? (
          <Button 
            type="button"
            onClick={() => removeUser()}
          >
            LOGOUT
          </Button>
        ) : ( 
          <button 
            type="button"            
            onClick={() => navigate('/admin/login')} 
            className={
              `font-bold text-xs px-2 py-1 text-center sm:mr-0 uppercase
              ${location.pathname.split('/')[location.pathname.split('/').length-1] === 'signup' ? `bg-[#474747] rounded-md border border-lime-500 text-lime-500` :
               'bg-lime-500 text-gray-700 border-0 rounded-md'
            }  
            `}
          >
            LOGIN
          </button> 
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
