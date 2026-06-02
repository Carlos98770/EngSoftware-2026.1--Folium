import { Navigate, Outlet } from "react-router-dom"
import { authService } from "../auth/AuthService"

const PrivateRoute = () => {
    const isAuthenticated = authService.adminLogged()
    if(isAuthenticated){
        return <Outlet/>
    }
    return <Navigate to="/login"></Navigate>
} 
export default PrivateRoute