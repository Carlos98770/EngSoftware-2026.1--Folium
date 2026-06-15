import { Navigate, Outlet } from "react-router-dom"
import { authService } from "../auth/AuthService"

const PrivateRoute = () => {
    const isAuthenticated = authService.userLogged()
    if(isAuthenticated){
        return <Outlet/>
    }
    return <Navigate to="/login"></Navigate>
} 
export default PrivateRoute