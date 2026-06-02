import { authService } from "../../../auth/AuthService";
import { useNavigate } from "react-router-dom";
import "./BotaoAdmin.css"

export default function(){
    const navigate = useNavigate()

    return(
        <div className="ContainerBotaoLogin">
            <button className="BotaoAdicionar" onClick={() => navigate("/admin/adicionar")}>Adicione Livros</button>
            <button className="BotaoAlterar" onClick={() => navigate("/admin/alterar")}>Alterar Estoque</button>
        </div>
    )
}