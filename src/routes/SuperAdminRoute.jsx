import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* Restringe rotas que exigem o papel superadmin
   Admin comum é redirecionado de volta à listagem de produtos. */
export default function SuperAdminRoute() {
  const { isAuthenticated, isSuperAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isSuperAdmin) {
    return <Navigate to="/admin/produtos" replace />;
  }

  return <Outlet />;
}
