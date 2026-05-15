import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../../auth/AuthService"
import { accountService } from "../../../services/AccountService"
import type { LoginUser } from "../../../models/LoginUser"
import * as z from "zod"
import { toast } from "react-toastify"
import "./LoginForm.css"

type FormErros = {
    email: string,
    senha: string
}

export default function RegisterForm(){
    const [formdata, setFormData] = useState({
        email: "",
        senha: ""
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
        senha: ""
    })

    const validateForm = async(formdata) => {
        const mensagensValidacao: FormErros = {
            email: "",
            senha: ""
        }
        if(formdata.email)

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
            const user: LoginUser = { "email": formdata.email, "senha": formdata.senha}
            const result = await accountService.login(user)
            authService.saveUser(result.email)
            authService.saveToken(result.token)
            toast("Login feito com sucesso!", {
                position: "top-right",
                autoClose: 5000,
                pauseOnHover: true,
                type: "success",
                theme: "light"
            })
            if(result.admin){
                navigate("/admin")
            } else {
                navigate("/login")
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