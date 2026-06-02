import BotoesConta from "../components/Botoes/Conta/BotoesConta"
import UserLogado from "../components/Botoes/Conta/UserLogado"
import PesquisaLivros from "../components/PesquisaLivros/PesquisaLivros"
//import { SearchBar } from "../components/SearchBar/SearchBar"

export default function MainPage(){
    return (
        <div className="MainPage" style={{ backgroundColor: "#ffffff", minHeight: "100vh", width: "100%" }}>
            <UserLogado></UserLogado>
            <BotoesConta></BotoesConta>
            <PesquisaLivros></PesquisaLivros>
        </div>
    )
}

