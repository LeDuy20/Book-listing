import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NoPermitted";

const RoleBaseRoute = (props) => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const isCartRoute = window.location.pathname.startsWith("/cart");
  const isHistoryRoute = window.location.pathname.startsWith("/history");
  const user = useSelector((state) => state.account.user);
  const userRole = user.role;

  if (
    (isAdminRoute && userRole === "ADMIN") ||
    (isCartRoute && userRole === "USER") ||
    (isHistoryRoute && userRole === "USER")
  ) {
    return <>{props.children}</>;
  } else {
    return <NotPermitted />;
  }
};

const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  return (
    <>
      {isAuthenticated === true ? (
        <>
          <RoleBaseRoute>{props.children}</RoleBaseRoute>
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default ProtectedRoute;
