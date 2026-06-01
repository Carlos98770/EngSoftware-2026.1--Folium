import { useRef, useState } from "react";
import { PesquisaService } from "../../services/PesquisaService";

type Livro = {
    titulo: string,
    disponivel: boolean
}

export default function PesquisaLivros(){
    const [pesquisadata, setPesquisaData] = useState({
        titulo: "",
        disponivel: false
    })
    const [carregando, setCarregando] = useState(false)

    const inputRef = {
        pesquisaRef: useRef<HTMLInputElement>(null)
    }

    const handlePesquisa = async() => {
        const resultado: Livro[] = await PesquisaService(pesquisadata)
        if(resultado.empty){
            //toast não existe
        } else {
            //toast sucesso
            //Cards aparecem
        }
    }

    return(
        <div>
            <input type="text" ref={inputRef.pesquisaRef} value={pesquisadata}
            onChange={(data) => setPesquisaData(data.target.value)} placeholder="Buscar livros..."/>
            <button onClick={handlePesquisa} disabled={carregando}>
            {carregando ? "Buscando..." : "Pesquisar"}
            </button>
        </div>
    )
}