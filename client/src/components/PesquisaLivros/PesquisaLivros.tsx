import { useRef, useState } from "react";
import { PesquisaService } from "../../services/PesquisaService";
import LivroCard from "../Cards/LivroCard";
import "./PesquisaLivros.css"
import { toast } from "react-toastify";

type Livro = {
    id: number;
    nome: string;                 /* <-- Mudou de 'titulo' para 'nome' */
    quantidade_disponivel: number; /* <-- Mudou de 'disponivel: boolean' para 'quantidade_disponivel: number' */
    editora: string;
    comentario: string;
}
export default function PesquisaLivros() {
    const [busca, setBusca] = useState("");
    const [livros, setLivros] = useState<Livro[]>([]);
    const [carregando, setCarregando] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handlePesquisa = async () => {
        if (!busca.trim()) return;

        setCarregando(true);

        const resultado: Livro[] = await PesquisaService(busca);
        console.log("Dados que vieram da API:", resultado);

        if (resultado.length === 0) {
            toast("Livros não encontrados.", {
                position: "top-center",
                autoClose: 5000,
                pauseOnHover: true,
                type: "error",
                theme: "light"
            })
        } else {
            setLivros(resultado);
        }

        setCarregando(false);
    };

    return (
        <div className="PesquisaContainer">
            <div className="BarraPesquisa">
                <input
                    ref={inputRef}
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar livros..."
                />
                <button type="button" onClick={handlePesquisa} disabled={carregando}>
                    {carregando ? "Buscando..." : "Pesquisar"}
                </button>
            </div>

            {/* 2. Container onde os cards vão se alinhar */}
            <div className="LivrosGrid">
                {livros.map((livro, index) => (
                <LivroCard 
                key={livro.id ?? index} 
                titulo={livro.nome} // <-- Mapeia 'nome' para a propriedade 'titulo' do card
                disponivel={livro.quantidade_disponivel > 0} // <-- Se for > 0, passa true, senão false
                />
            ))}
            </div>
        </div>
    );
}