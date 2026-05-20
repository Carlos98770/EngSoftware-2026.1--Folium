import BotoesConta from "../components/Botoes/Conta/BotoesConta"
import UserLogado from "../components/Botoes/Conta/UserLogado"
//import { SearchBar } from "../components/SearchBar/SearchBar"

export default function MainPage(){
    return (
        <div className="MainPage">
            <UserLogado></UserLogado>
            <BotoesConta></BotoesConta>
        </div>
    )
}

