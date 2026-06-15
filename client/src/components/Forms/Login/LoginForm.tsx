import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../../auth/AuthService"
import { accountService } from "../../../services/AccountService"
import type { LoginUser } from "../../../models/LoginUser"
import * as z from "zod"
import { toast } from "react-toastify"
import "./LoginForm.css"
import PageBackground from "../../pageBackground/PageBackground"

type FormErros = {
    email: string
    senha: string
}

export default function LoginForm() {
    const navigate = useNavigate()

    const [formdata, setFormData] = useState({
        email: "",
        senha: "",
    })

    const [erros, setErrors] = useState<FormErros>({
        email: "",
        senha: "",
    })

    const inputRefs = {
        emailRef: useRef<HTMLInputElement>(null),
        senhaRef: useRef<HTMLInputElement>(null),
    }

    const loginInput = z.object({
        email: z
            .string()
            .min(1, "O campo de email é obrigatório")
            .max(100, "O email excede o limite de 100 caracteres")
            .refine(
                (input) => input === "admin" || z.email().safeParse(input).success,
                "Email inválido"
            ),
        senha: z
            .string()
            .min(6, "A senha deve ter no mínimo 6 caracteres")
            .max(50, "A senha excede o limite de 50 caracteres"),
    })

    const validateForm = async (data: typeof formdata) => {
        const validacao = loginInput.safeParse(data)

        if (!validacao.success) {
            const loginErros = z.treeifyError(validacao.error)
            const mensagens: FormErros = {
                email: loginErros.properties.email?.errors[0] ?? "",
                senha: loginErros.properties.senha?.errors[0] ?? "",
            }
            setErrors(mensagens)
            return { valido: false, mensagens }
        }

        setErrors({ email: "", senha: "" })
        return { valido: true, mensagens: { email: "", senha: "" } }
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

        const handleLoginClick = async () => {
        authService.saveAdmin(false) // Limpa o status de administrador antes de qualquer login
        const { valido, mensagens } = await validateForm(formdata)

        if (!valido) {
            toast("Campos preenchidos incorretamente.", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
                type: "error",
                theme: "light",
            })
            Object.keys(mensagens).forEach(field => {
                if (mensagens[field as keyof FormErros]) {
                    setFormData(prev => ({ ...prev, [field]: "" }))
                }
            })
            return
        }

        try {
            const user: LoginUser = { email: formdata.email, senha: formdata.senha }
            const result = await accountService.login(user)

            authService.saveToken(result.token)
            authService.saveUserId(result.id)
            const nomeUsuario = await accountService.getUsername(result.id)
            authService.saveUser(nomeUsuario)

            if (result.admin) {
                authService.saveAdmin(true)
            }

            toast("Login feito com sucesso!", {
                position: "top-right",
                autoClose: 2000,
                pauseOnHover: true,
                type: "success",
                theme: "light",
                onClose: () => navigate("/main"),
            })
        } catch (err) {
            console.error("Erro no login:", err)
            toast("Email ou senha incorretos. Tente novamente.", {
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

            <div className="LoginPage">
                <div className="LoginCard">

                    {/* Cabeçalho */}
                    <div className="LoginHeader">
                        <button className="LoginBackBtn" onClick={() => navigate("/main")} aria-label="Voltar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                        </button>
                        <div className="LoginHeaderIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </div>
                        <div className="LoginHeaderText">
                            <h1>Entrar</h1>
                            <p>Acesse a sua conta</p>
                        </div>
                    </div>

                    {/* Corpo */}
                    <div className="LoginBody">

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
                                    type="text"
                                    value={formdata.email}
                                    placeholder="Ex: seu@email.com"
                                    onChange={onChangeFormData}
                                    onBlur={formBlurs}
                                    ref={inputRefs.emailRef}
                                    className={erros.email ? "input-error" : ""}
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

                        <div className="FormDivider" />

                        {/* Botão */}
                        <button className="LoginBtn" onClick={handleLoginClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            Entrar
                        </button>

                        {/* Erros */}
                        {mensagens.length > 0 && (
                            <div className="LoginErrors">
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