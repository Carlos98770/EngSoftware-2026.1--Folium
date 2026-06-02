import { authService } from "../../../auth/AuthService";
import { useNavigate } from "react-router-dom";
import "./BotaoAdmin.css"

export default function(){
    if(authService.getUser()){
        return null
    }

    const navigate = useNavigate()

    return(
        <div className="ContainerBotaoLogin">
            <button className="BotaoAdicionar" onClick={() => navigate("/adicionar")}>Adicione Livros</button>
            <button className="BotaoAlterar" onClick={() => navigate("/alterar")}>Alterar Estoque</button>
        </div>
    )
}