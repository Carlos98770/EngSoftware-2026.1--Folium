import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../auth/AuthService"
import { LivroService } from "../../services/LivroService"
import * as z from "zod"
import { toast } from "react-toastify"
import "./AdicionarLivro.css"
import PageBackground from "../../components/pageBackground/PageBackground"

type FormErros = {
    nome: string
    editora: string
    comentario: string
    quantidade_total: string
    generos?: string
}

export default function AdicionarPage() {
    const navigate = useNavigate()
    const [formdata, setFormData] = useState({
        nome: "",
        editora: "",
        comentario: "",
        quantidade_total: 0,
        generos: [] as string[],
    })

    const [generosInput, setGenerosInput] = useState("")

    // CORREÇÃO: quantidade_total convertido para número imediatamente
    const onChangeFormData = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = evt.target
        setFormData(prev => ({
            ...prev,
            [id]: id === "quantidade_total" ? (value === "" ? 0 : Number(value)) : id === "generos" ? prev.generos : value,
        }))
    }

    const handleGenerosChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.target
        setGenerosInput(value)
        setFormData(prev => ({
            ...prev,
            generos: value.split(",").map((g: string) => g.trim()).filter((g: string) => g !== ""),
        }))
    }

    const inputRefs = {
        nomeRef: useRef<HTMLInputElement>(null),
        editoraRef: useRef<HTMLInputElement>(null),
        comentarioRef: useRef<HTMLInputElement>(null),
        quantidadeRef: useRef<HTMLInputElement>(null),
        generosRef: useRef<HTMLInputElement>(null),
    }

    const [erros, setErrors] = useState<FormErros>({
        nome: "",
        editora: "",
        comentario: "",
        quantidade_total: "",
    })

    const livroInput = z.object({
        nome: z.string().min(1, "O nome é obrigatório").max(255, "Nome excede 255 caracteres"),
        editora: z.string().min(1, "A editora é obrigatória").max(255, "Editora excede 255 caracteres"),
        comentario: z.string().max(200, "Comentário excede 200 caracteres").optional(),
        quantidade_total: z.coerce.number().min(1, "A quantidade deve ser maior que 0"),
        generos: z.array(z.string()).optional(),
    })

    const validateForm = async (data: typeof formdata) => {
        const validacao = livroInput.safeParse(data)

        if (!validacao.success) {
            const livroErros = z.treeifyError(validacao.error)
            const mensagens: FormErros = {
                nome: livroErros.properties.nome?.errors[0] ?? "",
                editora: livroErros.properties.editora?.errors[0] ?? "",
                comentario: livroErros.properties.comentario?.errors[0] ?? "",
                quantidade_total: livroErros.properties.quantidade_total?.errors[0] ?? "",
            }
            setErrors(mensagens)
            return { valido: false, mensagens }
        }

        setErrors({ nome: "", editora: "", comentario: "", quantidade_total: "" })
        return { valido: true, mensagens: { nome: "", editora: "", comentario: "", quantidade_total: "" } }
    }

    const formBlurs = async (evt: React.FocusEvent<HTMLInputElement>) => {
        const { id, value } = evt.target
        setFormData(prev => {
            const updated = {
                ...prev,
                [id]: id === "quantidade_total" ? (value === "" ? 0 : Number(value)) : id === "generos" ? prev.generos : value,
            }
            validateForm(updated)
            return updated
        })
    }

    const handleSubmitClick = async () => {
        try {
            const { valido } = await validateForm(formdata)
            console.log(authService.getUserId())

            if (!valido) {
                toast("Campos preenchidos incorretamente.", {
                    position: "top-right",
                    autoClose: 5000,
                    pauseOnHover: true,
                    type: "error",
                    theme: "light",
                })
                return
            }

            const quantidade = Number(formdata.quantidade_total)
            await LivroService.create({
                nome: formdata.nome,
                editora: formdata.editora,
                comentario: formdata.comentario,
                quantidade_total: quantidade,
                quantidade_disponivel: quantidade,
                generos: formdata.generos,
            })

            toast("Livro adicionado com sucesso!", {
                position: "top-right",
                autoClose: 2000,
                pauseOnHover: true,
                type: "success",
                theme: "light",
                onClose: () => navigate("/main"),
            })
        } catch (err) {
            console.error("Erro ao adicionar livro:", err)
            toast("Erro ao salvar o livro. Tente novamente.", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
                type: "error",
                theme: "light",
            })
        }
    }

    const mensagensErros = (e: FormErros): string[] =>
        Object.values(e).filter(msg => msg !== "")

    const mensagens = mensagensErros(erros)

    return (
        <>
            <PageBackground />

            <div className="AddBookPage">
                <div className="AddBookCard">

                    {/* Cabeçalho */}
                    <div className="AddBookHeader">
                        <button className="AddBookBackBtn" onClick={() => navigate("/main")} aria-label="Voltar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                        </button>
                        <div className="AddBookHeaderIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                        </div>
                        <div className="AddBookHeaderText">
                            <h1>Adicionar livro</h1>
                            <p>Preencha os dados do novo exemplar</p>
                        </div>
                    </div>

                    {/* Corpo */}
                    <div className="AddBookBody">

                        {/* Nome */}
                        <div className="FormGroup">
                            <label htmlFor="nome">Título</label>
                            <div className="InputWrap">
                                <svg className="InputIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="4 7 4 4 20 4 20 7" />
                                    <line x1="9" y1="20" x2="15" y2="20" />
                                    <line x1="12" y1="4" x2="12" y2="20" />
                                </svg>
                                <input
                                    id="nome"
                                    type="text"
                                    value={formdata.nome}
                                    placeholder="Ex: Dom Casmurro"
                                    onChange={onChangeFormData}
                                    onBlur={formBlurs}
                                    ref={inputRefs.nomeRef}
                                    className={erros.nome ? "input-error" : ""}
                                />
                            </div>
                        </div>

                        {/* Editora */}
                        <div className="FormGroup">
                            <label htmlFor="editora">Editora</label>
                            <div className="InputWrap">
                                <svg className="InputIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                <input
                                    id="editora"
                                    type="text"
                                    value={formdata.editora}
                                    placeholder="Ex: Companhia das Letras"
                                    onChange={onChangeFormData}
                                    onBlur={formBlurs}
                                    ref={inputRefs.editoraRef}
                                    className={erros.editora ? "input-error" : ""}
                                />
                            </div>
                        </div>

                        {/* Comentário */}
                        <div className="FormGroup">
                            <label htmlFor="comentario">
                                Comentário <span className="optional">(opcional)</span>
                            </label>
                            <div className="InputWrap no-icon">
                                <input
                                    id="comentario"
                                    type="text"
                                    value={formdata.comentario}
                                    placeholder="Observações sobre o livro..."
                                    onChange={onChangeFormData}
                                    onBlur={formBlurs}
                                    ref={inputRefs.comentarioRef}
                                    className={erros.comentario ? "input-error" : ""}
                                />
                            </div>
                        </div>

                        {/* Gêneros */}
                        <div className="FormGroup">
                            <label htmlFor="generos">
                                Gêneros <span className="optional">(separados por vírgula)</span>
                            </label>
                            <div className="InputWrap">
                                <svg className="InputIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                                <input
                                    id="generos"
                                    type="text"
                                    value={generosInput}
                                    placeholder="Ex: Romance, Ficção, Terror"
                                    onChange={handleGenerosChange}
                                    onBlur={formBlurs}
                                    ref={inputRefs.generosRef}
                                />
                            </div>
                            {formdata.generos.length > 0 && (
                                <div className="GenerosTags">
                                    {formdata.generos.map((g, i) => (
                                        <span key={i} className="GeneroTag">{g}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quantidade + dica */}
                        <div className="FormRowTwo">
                            <div className="FormGroup">
                                <label htmlFor="quantidade_total">Quantidade</label>
                                <div className="InputWrap">
                                    <svg className="InputIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                    <input
                                        id="quantidade_total"
                                        type="number"
                                        value={formdata.quantidade_total}
                                        placeholder="0"
                                        min={1}
                                        onChange={onChangeFormData}
                                        onBlur={formBlurs}
                                        ref={inputRefs.quantidadeRef}
                                        className={erros.quantidade_total ? "input-error" : ""}
                                    />
                                </div>
                            </div>

                            <div className="QuantityHint">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>Qtd. disponível será igual ao total</span>
                            </div>
                        </div>

                        <div className="FormDivider" />

                        {/* Botão */}
                        <button className="AddBookBtn" onClick={handleSubmitClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            Adicionar livro
                        </button>

                        {/* Erros */}
                        {mensagens.length > 0 && (
                            <div className="AddBookErrors">
                                <ul>
                                    {mensagens.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}