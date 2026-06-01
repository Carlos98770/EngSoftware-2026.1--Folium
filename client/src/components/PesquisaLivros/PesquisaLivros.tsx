import { useRef, useState } from "react";
import { PesquisaService } from "../../services/PesquisaService";

type Livro = {
    titulo: string;
    disponivel: boolean;
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

        if (resultado.length === 0) {
            // toast não existe
        } else {
            setLivros(resultado);
            // toast sucesso
        }

        setCarregando(false);
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar livros..."
            />
            <button onClick={handlePesquisa} disabled={carregando}>
                {carregando ? "Buscando..." : "Pesquisar"}
            </button>

            <div>
                {livros.map((livro, index) => (
                    <div key={index}>
                        <p>{livro.titulo}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}