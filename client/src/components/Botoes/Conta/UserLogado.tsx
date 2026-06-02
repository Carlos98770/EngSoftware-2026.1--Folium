import { useEffect, useRef, useState } from "react";
import { authService } from "../../../auth/AuthService";
import { useNavigate } from "react-router-dom";
import "./BotaoLogado.css"

export default function UserLogado(){
    const userlogin = useState(false)
    const [menuAberto, setMenuAberto] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const nomeUsuario = authService.getUser()
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickFora = (evt: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(evt.target as Node)) {
        setMenuAberto(false)
      }
    }
    document.addEventListener("mousedown", handleClickFora)
    return () => document.removeEventListener("mousedown", handleClickFora)
    }, [])

    const handleSair = () => {
    authService.removeStoragedData()
    navigate("/login")
  }

  if (!authService.userLogged()) return null  // ← não renderiza se não estiver logado

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
        <button className="ItemMenu" onClick={() => navigate("/livro/adicionar")}>
          Adicione Livros
        </button>
        <button className="ItemMenu" onClick={() => navigate("/livro/alterar")}>
          Alterar Estoque
        </button>
        <button className="ItemMenu BotaoSair" onClick={handleSair}>
          Sair
        </button>
      </div>
    )}
  </div>
  )
}

