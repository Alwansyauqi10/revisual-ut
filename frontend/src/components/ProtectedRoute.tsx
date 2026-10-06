import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router";
import { useEffect } from "react";

import {
  clearAuth,
  getTokenExpiration,
  isAuthenticated,
  isTokenExpired,
} from "@/services/authStorage";

function ProtectedRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  const authenticated = isAuthenticated();
  const expired = isTokenExpired();

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    const expiration = getTokenExpiration();

    if (!expiration) {
      return;
    }

    const remainingTime =
      expiration - Date.now();

    if (remainingTime <= 0) {
      clearAuth();

      navigate("/admin/login", {
        replace: true,
      });

      return;
    }

    const timeout = window.setTimeout(() => {
      clearAuth();

      navigate("/admin/login", {
        replace: true,
      });
    }, remainingTime);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [authenticated, navigate]);

  if (!authenticated || expired) {
    if (expired) {
      clearAuth();
    }

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