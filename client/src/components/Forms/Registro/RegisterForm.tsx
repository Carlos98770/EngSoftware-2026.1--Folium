import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../../auth/AuthService"
import { accountService } from "../../../services/AccountService"
import type { RegistroUser } from "../../../models/RegistroUser"
import * as z from "zod"
import { toast } from "react-toastify"
import "./RegistroForm.css"
import PageBackground from "../../pageBackground/PageBackground"

type FormErros = {
    email: string
    nome: string
    senha: string
    senhaConfirmacao: string
}

export default function RegisterForm() {
    const navigate = useNavigate()

    const [formdata, setFormData] = useState({
        email: "",
        nome: "",
        senha: "",
        senhaConfirmacao: ""
    })

    const [erros, setErrors] = useState<FormErros>({
        email: "",
        nome: "",
        senha: "",
        senhaConfirmacao: ""
    })

    const inputRefs = {
        emailRef: useRef<HTMLInputElement>(null),
        nomeRef: useRef<HTMLInputElement>(null),
        senhaRef: useRef<HTMLInputElement>(null),
        senhaConfirmRef: useRef<HTMLInputElement>(null),
    }

    const registroInput = z.object({
        email: z.string().min(1, "O campo de email é obrigatório").max(100, "O email excede o limite de 100 caracteres")
            .refine((input) => input === "admin" || z.email().safeParse(input).success, "Email inválido"),
        nome: z.string().min(4, "O nome deve ter no mínimo 4 caracteres")
            .max(30, "O nome deve ter no máximo 30 caracteres"),
        senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
            .max(50, "A senha excede o limite de 50 caracteres"),
        senhaConfirmacao: z.string().min(1, "A confirmação é obrigatória")
            .max(50, "A confirmação excede o limite de 50 caracteres")
    }).refine((input) => input.senha === input.senhaConfirmacao, "A senha e a confirmação não conferem")

    const validateForm = async (data: typeof formdata) => {
        const validacao = registroInput.safeParse(data)

        if (!validacao.success) {
            const registroErros = z.treeifyError(validacao.error)
            const mensagens: FormErros = {
                email: registroErros.properties.email?.errors[0] ?? "",
                nome: registroErros.properties.nome?.errors[0] ?? "",
                senha: registroErros.properties.senha?.errors[0] ?? "",
                senhaConfirmacao: registroErros.properties.senhaConfirmacao?.errors[0] ?? ""
            }
            setErrors(mensagens)
            return { valido: false, messagens: mensagens }
        }

        setErrors({ email: "", nome: "", senha: "", senhaConfirmacao: "" })
        return { valido: true, messagens: { email: "", nome: "", senha: "", senhaConfirmacao: "" } }
    }

    const onChangeFormData = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = evt.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const formBlurs = async (evt: React.FocusEvent<HTMLInputElement>) => {
        const { id, value } = evt.target
        setFormData(prev => {
            const updated = { ...prev, [id]: value }
            validateForm(updated)
            return updated
        })
    }

    const handleRegistroClick = async () => {
        const { valido, messagens } = await validateForm(formdata)

        if (!valido) {
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
            return
        }

        try {
            const user: RegistroUser = { nome: formdata.nome, email: formdata.email, senha: formdata.senha }
            const result = await accountService.registrar(user)

            authService.saveToken(result.token)
            const nomeUsuario = await accountService.getUsername(result.id)
            authService.saveUser(nomeUsuario)

            if (result.admin) {
                console.log("EhAdmin")
            }

            toast("Usuário cadastrado com sucesso!", {
                position: "top-right",
                autoClose: 2000,
                pauseOnHover: true,
                type: "success",
                theme: "light",
                onClose: () => navigate("/main")
            })
        } catch (error) {
            console.error("Erro no registro:", error)
            toast("Erro ao cadastrar usuário. Tente novamente.", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
                type: "error",
                theme: "light"
            })
        }
    }

    const mensagensErros = (e: FormErros): string[] =>
        Object.values(e).filter(msg => msg !== "")

    const mensagens = mensagensErros(erros)

    return (
        <>
            <PageBackground />

            <div className="RegistroPage">
                <div className="RegistroCard">

                    {/* Cabeçalho */}
                    <div className="RegistroHeader">
                        <button className="RegistroBackBtn" onClick={() => navigate("/main")} aria-label="Voltar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                        </button>
                        <div className="RegistroHeaderIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div className="RegistroHeaderText">
                            <h1>Registro</h1>
                            <p>Crie a sua conta</p>
                        </div>
                    </div>

                    {/* Corpo */}
                    <div className="RegistroBody">

                        {/* Email */}
                        <div className="FormGroup">
                            <label htmlFor="email">Email</label>
                            <div className="InputWrap">
                                <svg className="InputIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <input
                                    id="email"
                                    type="email"
                                    value={formdata.email}
                                    placeholder="Ex: seu@email.com"
                                    onChange={onChangeFormData}
                                    onBlur={formBlurs}
                                    ref={inputRefs.emailRef}
                                    className={erros.email ? "input-error" : ""}
                                />
                            </div>
                        </div>

                        {/* Nome */}
                        <div className="FormGroup">
                            <label htmlFor="nome">Nome</label>
                            <div className="InputWrap">
                                <svg className="InputIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    id="nome"
                                    type="text"
                                    value={formdata.nome}
                                    placeholder="Ex: João Silva"
                                    onChange={onChangeFormData}
                                    onBlur={formBlurs}
                                    ref={inputRefs.nomeRef}
                                    className={erros.nome ? "input-error" : ""}
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div className="FormGroup">
                            <label htmlFor="senha">Senha</label>
                            <div className="InputWrap">
                                <svg className="InputIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    id="senha"
                                    type="password"
                                    value={formdata.senha}
                                    placeholder="Mínimo 6 caracteres"
                                    onChange={onChangeFormData}
                                    onBlur={formBlurs}
                                    ref={inputRefs.senhaRef}
                                    className={erros.senha ? "input-error" : ""}
                                />
                            </div>
                        </div>

                        {/* Confirmar Senha */}
                        <div className="FormGroup">
                            <label htmlFor="senhaConfirmacao">Confirmar Senha</label>
                            <div className="InputWrap">
                                <svg className="InputIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12l2 2 4-4" />
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    id="senhaConfirmacao"
                                    type="password"
                                    value={formdata.senhaConfirmacao}
                                    placeholder="Repita a senha"
                                    onChange={onChangeFormData}
                                    onBlur={formBlurs}
                                    ref={inputRefs.senhaConfirmRef}
                                    className={erros.senhaConfirmacao ? "input-error" : ""}
                                />
                            </div>
                        </div>

                        <div className="FormDivider" />

                        {/* Botão */}
                        <button className="RegistroBtn" onClick={handleRegistroClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="20" y1="8" x2="20" y2="14" />
                                <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                            Registrar
                        </button>

                        {/* Erros */}
                        {mensagens.length > 0 && (
                            <div className="RegistroErrors">
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