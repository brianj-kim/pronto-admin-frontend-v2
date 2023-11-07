import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Menus from "./pages/Menus";
import Operations from "./pages/Operations";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Home from "./pages/Home";

export const API_URL: string = 'http://localhost:3000/backend';

function App() {

  return (   
    
  <Routes >
    <Route path='/admin' element={<Home />} />
    <Route path='/admin/dashboard' element={<Dashboard />} />
    <Route path='/admin/menus' element={<Menus />} />
    <Route path='/admin/operations' element={<Operations />} />
    <Route path='/admin/orders' element={<Orders />} />
    <Route path='/admin/signup' element={<Signup />} />
    <Route path='/admin/login' element={<Login />} />
  
  </Routes>

  )
}

export default App;
