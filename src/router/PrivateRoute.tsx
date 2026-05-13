import { Navigate } from "react-router-dom"
import { authService } from "../auth/AuthService"

const PrivateRoute = ({component: Component, ...props}) => {
    const isAuthenticated = authService.adminLogged()
    if(isAuthenticated){
        return <Component/>
    }
    return <Navigate to="/"></Navigate>
} 
export default PrivateRoute