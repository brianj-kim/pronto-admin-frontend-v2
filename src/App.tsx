import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Menus from "./pages/Menus";
import Operations from "./pages/Operations";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { ModalProvider } from "./context/ModalProvider";

function App() {

  return (   
  <ModalProvider>
    <Routes >
      <Route element={<ProtectedRoute />} >
        <Route path='/admin/menus' element={<Menus />} />
      </Route>
      <Route path='/admin' element={<Home />} />
      <Route path='/admin/dashboard' element={<Dashboard />} />    
      <Route path='/admin/operations' element={<Operations />} />
      <Route path='/admin/orders' element={<Orders />} />
      <Route path='/admin/signup' element={<Signup />} />
      <Route path='/admin/login' element={<Login />} />
    
    </Routes>
  </ModalProvider>  
  )
}

export default App;
