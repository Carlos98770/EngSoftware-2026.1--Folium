import { useEffect, useRef, useState } from "react";
import { authService } from "../../auth/AuthService";
import { useNavigate } from "react-router-dom";

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
    <div className="BoataoLogado" ref={menuRef}>
      <button onClick={() => setMenuAberto(prev => !prev)}>
        {nomeUsuario}
      </button>

      {menuAberto && (
        <div>
          <button onClick={() => navigate("/conta")}>Minha conta</button>
          <button onClick={handleSair}>Sair</button>
        </div>
      )}
    </div>
  )
}

