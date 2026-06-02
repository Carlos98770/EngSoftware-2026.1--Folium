import { useEffect, useState } from "react"
import { PesquisaService } from "../../services/PesquisaService"
import DashboardDisponivel from "../../components/Dashboards/DashboardDisponivel" 
import "./AdminPage.css"
import BotaoAdmin from "../../components/Botoes/Admin/BotaoAdmin"


type Livro = {
    id: number;
    nome: string;
    editora: string;
    comentario: string;
    quantidade_total: number;       
    quantidade_disponivel: number; 
    user_id: number;
}

export default function AdminPage(){
    const [livros, setLivros] = useState<Livro[]>([])
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const dadosBanco = async() => {
            try{
                const resultado = await PesquisaService("")
                setLivros(resultado)
            } catch(error) {
                console.error("Erro ao buscar livros para o admin:", error)
            } finally {
                setCarregando(false)
            }
        }
        dadosBanco()
    }, [])

    return (
        <div className="admin-page-container">
            <h1 className="admin-title">DASHBOARD</h1>

            <div className="dashboard-sunken-container">
                {carregando ? (
                    <p className="loading-text">Carregando gráficos...</p>
                ) : (
                    <DashboardDisponivel listaLivros={livros} />
                )}
            </div>

            <BotaoAdmin></BotaoAdmin>
        </div>
    )
}