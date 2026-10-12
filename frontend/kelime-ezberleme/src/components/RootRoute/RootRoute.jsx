import { Navigate } from "react-router-dom";
import Landing from "../../pages/Landing/Landing";
import { getAuthToken } from "../../services/apiClient";

function RootRoute() {
  const token = getAuthToken();

  if (token) {
    return <Navigate to="/choose" replace />;
  }

  return <Landing />;
}

export default RootRoute;
