import { useRef, useState, useEffect, useCallback } from "react";
import { PesquisaService } from "../../services/PesquisaService";
import LivroCard from "../Cards/LivroCard";
import "./PesquisaLivros.css"
import { toast } from "react-toastify";

type Livro = {
    id: number;
    nome: string;                 
    quantidade_disponivel: number; 
    editora: string;
    comentario: string;
}

// Debounce utility function
const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return function(this: any, ...args: any[]) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
};

export default function PesquisaLivros() {
    const [busca, setBusca] = useState("");
    const [livros, setLivros] = useState<Livro[]>([]);
    const [carregando, setCarregando] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const handlePesquisa = useCallback(async (searchTerm: string) => {
        setCarregando(true);
        const resultado: Livro[] = await PesquisaService(searchTerm);
        console.log("Dados que vieram da API:", resultado);

        if (resultado.length === 0 && searchTerm !== "") { // Only show "not found" if there was a search term
            toast("Livros não encontrados.", {
                position: "top-center",
                autoClose: 5000,
                pauseOnHover: true,
                type: "error",
                theme: "light"
            })
        }
        setLivros(resultado);
        setCarregando(false);
    }, []);

    // Debounced version of handlePesquisa
    const debouncedPesquisa = useCallback(debounce(handlePesquisa, 500), [handlePesquisa]);

    useEffect(() => {
        // Initial load of all books when component mounts
        handlePesquisa(""); 
    }, [handlePesquisa]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBusca(value);
        debouncedPesquisa(value);
    };

    return (
        <div className="PesquisaContainer">
            <div className="PesquisaHero">
                <span className="PesquisaEyebrow">Folium</span>
                <h1 className="PesquisaTitulo">Encontre seu livro</h1>
                <p className="PesquisaSubtitulo">
                    Plataforma de gestão de empréstimos — cadastre livros, controle disponibilidade e gerencie empréstimos com facilidade.
                </p>
            </div>
            <div className="BarraPesquisa">
                <input
                    ref={inputRef}
                    type="text"
                    value={busca}
                    onChange={handleChange}
                    placeholder="Buscar livros..."
                />
                 {carregando && <p>Buscando...</p>}
            </div>

            <div className="LivrosGrid">
                {livros.slice(0, 4).map((livro, index) => (
                <LivroCard 
                key={livro.id ?? index} 
                id={livro.id}
                titulo={livro.nome} 
                disponivel={livro.quantidade_disponivel > 0} 
                descricao={livro.comentario}
                onDelete={(id) => setLivros(prev => prev.filter(l => l.id !== id))}
                />
            ))}
            </div>
        </div>
    );
}