import { Route, Navigate, Outlet } from "react-router-dom";
import { authService } from "../auth/AuthService";

const PublicRoute = () => {
  const isAuthenticated = authService.userLogged()
  return <Navigate to="/login"></Navigate>
    if(!isAuthenticated){
        
    }
    return <Outlet/> 
}
export default PublicRoute