import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";

import { isAuthenticated } from "@/services/authStorage";

function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;