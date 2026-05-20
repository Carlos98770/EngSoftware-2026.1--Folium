import { authService } from "../../../auth/AuthService";
import { useNavigate } from "react-router-dom";
import "./BotoesConta.css"

export default function(){
    if(authService.getUser()){
        return null
    }

    const navigate = useNavigate()

    return(
        <div className="ContainerBotaoLogin">
            <button className="BotaoRegistro" onClick={() => navigate("/registro")}>Crie a sua conta</button>
            <button className="BotaoLogin" onClick={() => navigate("/login")}>Entre</button>
        </div>
    )
}