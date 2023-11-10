import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../customHooks/useAuth";

export default function ProtectedRoute () {
  const location = useLocation();
  const { user } = useAuth();

  return (
    (user!.isAdmin) ? <Outlet /> : <Navigate to='/admin/login' state={{from: location}} replace />
  );
}