import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../../auth/AuthService"
import { accountService } from "../../../services/AccountService"
import type { RegistroUser } from "../../../models/RegistroUser"
import * as z from "zod"
import { toast } from "react-toastify"
import "./LoginForm.css"

type FormErros = {
    email: string,
    nome: string,
    senha: string,
    senhaConfirmacao: string
}

export default function RegisterForm(){
    const [formdata, setFormData] = useState({
        email: "",
        nome: "",
        senha: "",
        senhaConfirmacao: ""
    })

    const navigate = useNavigate()

    const onChangeFormData = (evt) => {
        const {id, value} = evt.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
    }

    const inputRefs = {
        emailRef: useRef<HTMLInputElement>(null),
        nomeRef: useRef<HTMLInputElement>(null),
        senhaRef: useRef<HTMLInputElement>(null),
        senhaConfirmRef: useRef<HTMLInputElement>(null),
    }
    
    const [erros, setErrors] = useState<FormErros>({
        email: "",
        nome: "",
        senha: "",
        senhaConfirmacao: ""
    })

    const registroInput = z.object({
            email: z.string().min(1,"O campo de email é obrigatório").max(100, "O email excede o limite de 100 caracteres")
            .refine((input) => input==="admin" || z.email().safeParse(input).success,
        "Email inválido"),
            nome: z.string().min(4, "O nome deve ter no minimo 4 caracters")
            .max(30, "O nome deve ter no máximo 30 caracteres"),
            senha: z.string().min(6, "A senha deve ter no minimo 6 caracteres")
            .max(50,"A senha excede o limite de 50 caracteres"),
            senhaConf: z.string().min(1, "A confirmação é obrigatória")
            .max(50,"A confirmação excede o limite de 50 caracteres")
    }).refine((input) => input.senha === input.senhaConf, "A senha e a confirmação não conferem")

    const validateForm = async(formdata) => {
        const validacao = registroInput.safeParse(formdata)

        if(!validacao.success){
            const registroErros = z.treeifyError(validacao.error) //.flatten().fieldErrors
            const mensagens: FormErros = {
            email: registroErros.properties.email?.errors[0] ?? "",
            nome: registroErros.properties.nome?.errors[0] ?? "",
            senha: registroErros.properties.senha?.errors[0] ?? "",
            senhaConfirmacao: registroErros.properties.senhaConf?.errors[0] ?? ""
        }
        setErrors(mensagens)
        return { valido: false, messagens: mensagens }
        }

    setErrors({ email: "", nome: "", senha: "", senhaConfirmacao: "" })
    return { valido: true, messagens: { email: "", nome: "", senha: "", senhaConfirmacao: "" } }
    }

    const formBlurs = async(evt) => {
        const { id, value } = evt.target
        setFormData(prev => {
        const updated = { ...prev, [id]: value }
            validateForm(updated)
            return updated
        })
    }

    const handleLoginClick = async() => {
        const { valido, messagens } = await validateForm(formdata)
        if(valido) {
            const user: RegistroUser = { "email": formdata.email, "nome": formdata.nome, "senha": formdata.senha}
            const result = await accountService.login(user)
            authService.saveToken(result.token)
            const nomeUsuario = await accountService.getUsername(result.id)
            authService.saveUser(nomeUsuario)
            toast("Registro feito com sucesso!", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
                type: "success",
                theme: "light"
            })
            if(result.admin){
                console.log("EhAdmin")
                navigate("/admin")
            } else {
                navigate("/main")
            }
        }
        else {
            toast("Campos preenchidos incorretamente.", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
                type: "error",
                theme: "light"
            })
            Object.keys(messagens).forEach(field => {
                if(messagens[field as keyof FormErros]){
                    setFormData(prev => ({
                        ...prev ,[field]:""
                    }))
                }
            })
        }
    }

    const mensagensErros = (erros: FormErros): string[] => {
        const errosMessagens = Object.values(erros).filter(msg => msg !== "")
        return errosMessagens
    }

    const messagens = mensagensErros(erros)

    return(
        <div className="MainContainer">
            <div className="LoginForm">
            <h1 className="LoginText">Login</h1>
            <form action="" id="formLogin">
            <h4>Entre na sua conta:</h4>
            <div className="EmailForm">
                <label htmlFor="email">Email:</label>
                <input id="email" type="text" value={formdata.email} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.emailRef}/>
            </div>
            <div className="SenhaForm">
                <label htmlFor="">Senha:</label>
                <input type="password" id="senha" value={formdata.senha} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.senhaRef}/>
            </div>
            </form>
            </div>
            <div className="ButtonsLoginForm">
                <span><button className="ConfirmLogin" onClick={handleLoginClick}>Login</button></span>
            </div>
            <div className="MensagensErros">
                {messagens.length > 0 && (
                    <div>
                        <ul>
                            {messagens.map((error) => (
                                <li>{error}</li>   
                            ))} 
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

