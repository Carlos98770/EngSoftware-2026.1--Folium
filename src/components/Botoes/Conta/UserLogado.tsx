import { useEffect, useRef, useState } from "react";
import { authService } from "../../../auth/AuthService";
import { useNavigate } from "react-router-dom";
import "./BotaoLogado.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UserLogado(){
    //const userlogin = useState(false)
    const [menuAberto, setMenuAberto] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const nomeUsuario = authService.getUser()
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickFora = (evt: MouseEvent) => {
        if(menuRef.current && !menuRef.current.contains(evt.target as Node)) {
        setMenuAberto(false)
      }
    }
    document.addEventListener("mousedown", handleClickFora)
    return () => document.removeEventListener("mousedown", handleClickFora)
    }, [])

    const handleSair = () => {
    authService.removeStoragedData()
    console.log()
    navigate("/main")
  }

  if(!authService.userLogged()){
    return null
  }   

  return (
    <div className="ContainerUsuario" ref={menuRef}>
    <button className="BotaoLogado" onClick={() => setMenuAberto(prev => !prev)}>
      {nomeUsuario} <span className="SetaMenu">▼</span>
    </button>

    {menuAberto && (
      <div className="MenuOpcoes">
        <button className="ItemMenu" onClick={() => navigate("/conta")}>
          Minha conta
        </button>
        <button className="ItemMenu BotaoSair" onClick={handleSair}>
          Sair
        </button>
      </div>
    )}
  </div>
  )
}

