import BotoesConta from "../components/Botoes/Conta/BotoesConta"
import UserLogado from "../components/Botoes/Conta/UserLogado"
import PesquisaLivros from "../components/PesquisaLivros/PesquisaLivros"
import PageBackground from "../components/pageBackground/PageBackground"
//import { SearchBar } from "../components/SearchBar/SearchBar"

export default function MainPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f0f6ff", position: "relative", overflow: "hidden" }}>
      <PageBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <UserLogado />
        <BotoesConta />
        <PesquisaLivros />
      </div>
    </div>
  )
}

