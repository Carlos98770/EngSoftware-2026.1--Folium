import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../auth/AuthService";

const PublicRoute = () => {
    if(authService.getUser()){
        return <Navigate to="/main" replace />;
    }
    return <Outlet /> 
}
export default PublicRoute