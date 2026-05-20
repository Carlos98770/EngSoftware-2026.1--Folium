import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../../auth/AuthService"
import { accountService } from "../../../services/AccountService"
import type { User } from "../../../models/UserModel"
import { z } from "zod/mini"
import { toast } from "react-toastify"
import "./LoginForm.css"

type FormErros = {
    email: string,
    nome: string,
    senha: string,
}

export default function RegisterForm(){
    const [formdata, setFormData] = useState({
        email: "",
        nome: "",
        senha: "",
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
    }
    
    const [erros, setErrors] = useState<FormErros>({
        email: "",
        nome: "",
        senha: "",
    })

    const validateForm = async(formdata) => {
<<<<<<< Updated upstream
        const mensagensValidacao: FormErros = {
            email: "",
            nome: "",
            senha: "",
=======
        const validacao = loginInput.safeParse(formdata)

        if(!validacao.success){
            const loginErros = z.treeifyError(validacao.error) 
            const mensagens: FormErros = {
            email: loginErros.properties.email?.errors[0] ?? "", 
            senha: loginErros.properties.senha?.errors[0] ?? ""
>>>>>>> Stashed changes
        }
        if(!formdata.nome){
            mensagensValidacao.nome = "O nome de usuário é obrigatório"
        } 
        else if(formdata.nome.length<=5){
            mensagensValidacao.nome = "O nome precisa ter mais de 5 caracteres"
        } 
        else {
            mensagensValidacao.nome = ""
        }

        if(!formdata.senha){
            mensagensValidacao.senha = "A senha é obrigatória"
        }
        else if(formdata.senha.length<6){
            mensagensValidacao.senha = "A senha precisa ter mais de 6 caracteres"
        }
        else {
            mensagensValidacao.senha = ""
        }

        setErrors(mensagensValidacao)

        const temErros = Object.values(mensagensValidacao).some(msg => msg !== "")
        console.log({valido: !temErros, messagens: mensagensValidacao})
        return {valido: !temErros, messagens: mensagensValidacao}
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
            const user: User = { "email": formdata.email, "nome": formdata.nome,
                 "senha": formdata.senha}
            const result = await accountService.login(user)
            authService.saveUser(result.nome)
            authService.saveToken(result.token)
            toast("Login feito com sucesso!", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
                type: "success",
                theme: "dark"
            })
            if(result.admin){
                navigate("/admin")
            } else {
                navigate("/home")
            }
        }
        else {
            toast("Campos preenchidos incorretamente.", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
                type: "error",
                theme: "dark"
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

    //FALTA COLOCAR AS VALIDACOES DO EMAIL
    //FALTA USAR O ZOD
    //FALTA SE CONECTAR COM A API(MOGOOSE ENV)
    //FALTA RESETAR O INPUT QUE NÃO FUNCIONAR QUANDO APERTAR EM LOGIN(TALVEZ?)
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
            <div className="NomeForm">
                <label htmlFor="name">Nome:</label>
                <input id="nome" type="text" value={formdata.nome} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.nomeRef}/>
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

/**
 * const usernameConstraint: boolean = !!(errors.username.length)
        const passwordConstraint: boolean = !!(errors.password.length)
        const passwordConfirmationConstraint: boolean = !!(errors.passwordConfirmation.length)
        
        if(passwordConstraint || passwordConfirmationConstraint || usernameConstraint){
            displayMessages(errors)
        }
        return null
 */