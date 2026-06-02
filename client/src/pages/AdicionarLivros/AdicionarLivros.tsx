import { useState, useRef } from "react"
import { authService } from "../../auth/AuthService"
import { LivroService } from "../../services/LivroService"
import * as z from "zod"
import { toast } from "react-toastify"
//import "./LoginForm.css"

type FormErros = {
    nome: string,
    editora: string,
    comentario: string,
    quantidade_total: string,
}

export default function AdicionarPage() {
    const [formdata, setFormData] = useState({
        nome: "",
        editora: "",
        comentario: "",
        quantidade_total: 0,
    })

    const onChangeFormData = (evt) => {
        const { id, value } = evt.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const inputRefs = {
        nomeRef: useRef<HTMLInputElement>(null),
        editoraRef: useRef<HTMLInputElement>(null),
        comentarioRef: useRef<HTMLInputElement>(null),
        quantidadeRef: useRef<HTMLInputElement>(null),
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
        console.log(authService.getUserId())
        if (valido) {
            await LivroService.create({ nome: formdata.nome, editora: formdata.editora, comentario: formdata.comentario
                , quantidade_total: formdata.quantidade_total, quantidade_disponivel: formdata.quantidade_total })
            toast("Livro adicionado com sucesso!", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
                type: "success",
                theme: "light"
            })
        } else {
            toast("Campos preenchidos incorretamente.", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
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

    const mensagensErros = (erros: FormErros): string[] => {
        return Object.values(erros).filter(msg => msg !== "")
    }

    const messagens = mensagensErros(erros)

    return (
        <div className="MainContainer">
            <div className="LoginForm">
                <h1 className="LoginText">Adicionar Livro</h1>
                <form action="" id="formLivro">
                    <h4>Preencha os dados do livro:</h4>
                    <div className="EmailForm">
                        <label htmlFor="nome">Nome:</label>
                        <input id="nome" type="text" value={formdata.nome} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.nomeRef} />
                    </div>
                    <div className="EmailForm">
                        <label htmlFor="editora">Editora:</label>
                        <input id="editora" type="text" value={formdata.editora} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.editoraRef} />
                    </div>
                    <div className="EmailForm">
                        <label htmlFor="comentario">Comentário:</label>
                        <input id="comentario" type="text" value={formdata.comentario} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.comentarioRef} />
                    </div>
                    <div className="SenhaForm">
                        <label htmlFor="quantidade_total">Quantidade:</label>
                        <input id="quantidade_total" type="number" value={formdata.quantidade_total} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.quantidadeRef} />
                    </div>
                </form>
            </div>
            <div className="ButtonsLoginForm">
                <span><button className="ConfirmLogin" onClick={handleSubmitClick}>Adicionar</button></span>
            </div>
            <div className="MensagensErros">
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
    )
}