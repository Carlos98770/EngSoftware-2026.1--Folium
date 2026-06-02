import { useState, useRef } from "react"
import { authService } from "../../auth/AuthService"
import { LivroService } from "../../services/LivroService"
import * as z from "zod"
import { toast } from "react-toastify"
import "./AlterarLivro.css"

type FormErros = {
    nome: string,
    editora: string,
    comentario: string,
    quantidade_total: string,
}

interface AdicionarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AlterarLivro({ isOpen, onClose }: AdicionarModalProps) {
    const [formdata, setFormData] = useState({
        nome: "",
        editora: "",
        comentario: "",
        quantidade_total: 0,
    })

    const [erros, setErrors] = useState<FormErros>({
        nome: "",
        editora: "",
        comentario: "",
        quantidade_total: "",
    })

    const inputRefs = {
        nomeRef: useRef<HTMLInputElement>(null),
        editoraRef: useRef<HTMLInputElement>(null),
        comentarioRef: useRef<HTMLInputElement>(null),
        quantidadeRef: useRef<HTMLInputElement>(null),
    }

    if (!isOpen) return null;

    const onChangeFormData = (evt) => {
        const { id, value } = evt.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const livroInput = z.object({
        nome: z.string().min(1, "O nome é obrigatório").max(255, "Nome excede 255 caracteres"),
        editora: z.string().min(1, "A editora é obrigatória").max(255, "Editora excede 255 caracteres"),
        comentario: z.string().max(200, "Comentário excede 200 caracteres").optional(),
        quantidade_total: z.coerce.number().min(1, "A quantidade deve ser maior que 0"),
    })

    const validateForm = async (formdata) => {
        const validacao = livroInput.safeParse(formdata)
        if (!validacao.success) {
            const livroErros = z.treeifyError(validacao.error)
            const mensagens: FormErros = {
                nome: livroErros.properties.nome?.errors[0] ?? "",
                editora: livroErros.properties.editora?.errors[0] ?? "",
                comentario: livroErros.properties.comentario?.errors[0] ?? "",
                quantidade_total: livroErros.properties.quantidade_total?.errors[0] ?? "",
            }
            setErrors(mensagens)
            return { valido: false, messagens: mensagens }
        }
        setErrors({ nome: "", editora: "", comentario: "", quantidade_total: ""})
        return { valido: true, messagens: { nome: "", editora: "", comentario: "", quantidade_total: ""} }
    }

    const formBlurs = async (evt) => {
        const { id, value } = evt.target
        setFormData(prev => {
            const updated = { ...prev, [id]: value }
            validateForm(updated)
            return updated
        })
    }

    const handleSubmitClick = async () => {
        const { valido, messagens } = await validateForm(formdata)
        if (valido) {
            const user_id = authService.getUserId()
            await LivroService.update({ 
                nome: formdata.nome, 
                editora: formdata.editora, 
                comentario: formdata.comentario, 
                quantidade_total: formdata.quantidade_total, 
                quantidade_disponivel: formdata.quantidade_total
            }, user_id)
            
            toast("Livro alterado com sucesso!", {
                position: "top-right",
                autoClose: 5000,
                type: "success",
                theme: "light"
            })
            onClose(); // Fecha o modal após o sucesso
        } else {
            toast("Campos preenchidos incorretamente.", {
                position: "top-right",
                autoClose: 5000,
                type: "error",
                theme: "light"
            })
            Object.keys(messagens).forEach(field => {
                if (messagens[field as keyof FormErros]) {
                    setFormData(prev => ({ ...prev, [field]: "" }))
                }
            })
        }
    }

    const messagens = Object.values(erros).filter(msg => msg !== "")

    return (
        <div className="ModalOverlay" onClick={onClose}>
            <div className="AddBookCard" onClick={(e) => e.stopPropagation()}>
                <button className="ModalCloseBtn" onClick={onClose}>&times;</button>
                <h1 className="AddBookTitle">Alterar Livro</h1>
                
                <form action="" id="formLivro">
                    <h4>Preencha os dados do livro:</h4>
                    
                    <div className="FormGroup">
                        <label htmlFor="nome">Nome:</label>
                        <input id="nome" type="text" value={formdata.nome} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.nomeRef} />
                    </div>
                    
                    <div className="FormGroup">
                        <label htmlFor="editora">Editora:</label>
                        <input id="editora" type="text" value={formdata.editora} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.editoraRef} />
                    </div>
                    
                    <div className="FormGroup">
                        <label htmlFor="comentario">Comentário:</label>
                        <input id="comentario" type="text" value={formdata.comentario} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.comentarioRef} />
                    </div>
                    
                    <div className="FormGroup">
                        <label htmlFor="quantidade_total">Quantidade:</label>
                        <input id="quantidade_total" type="number" value={formdata.quantidade_total} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.quantidadeRef} />
                    </div>
                </form>

                <div className="AddBookActions">
                    <button className="AddBookBtn" onClick={handleSubmitClick}>Alterar</button>
                </div>

                <div className="AddBookErrors">
                    {messagens.length > 0 && (
                        <div>
                            <ul>
                                {messagens.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}