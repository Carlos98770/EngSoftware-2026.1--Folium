import { useRef, useState } from "react";
import { PesquisaService } from "../../services/PesquisaService";

export default function PesquisaLivros(){
    const [pesquisadata, setPesquisaData] = useState("")
    const onChangePesquisa = (evt) => {
        const {id, value} = evt.target
        setPesquisaData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const inputRef = {
        pesquisaRef: useRef<HTMLInputElement>(null)
    }

    const handlePesquisa = async(pesquisadata) => {
        const resultado: string[] = PesquisaService(pesquisadata)
        if(resultado.empty){
            //toast não existe
        } else {
            //toast sucesso
            //Cards aparecem
        }
    }

    return(
        <div>
            <input type="text" ref={inputRef.pesquisaRef}/>
        </div>
    )
}