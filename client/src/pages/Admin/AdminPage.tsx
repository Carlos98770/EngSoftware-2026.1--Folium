import { useEffect, useState } from "react"
import { PesquisaService } from "../../services/PesquisaService"

type Livro = {
    id: number,
    nome: string,
    genero: string,
    disponibilidade: boolean
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
                //Alguma coisa
            } finally {
                setCarregando(false)
            }
        }
        dadosBanco()
    }, [])
    return(
        <div>
            <h1>DASHBOARD</h1>
        </div>
    )
}