import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../../../auth/AuthService"
import { accountService } from "../../../services/AccountService"
import type { User } from "../../../models/RegistroUser"
import { z } from "zod/mini"
import { toast } from "react-toastify"
import "./LoginForm.css"

type FormErrors = {
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
    }
    
    const [errors, setErrors] = useState<FormErrors>({
        email: "",
        nome: "",
        senha: "",
    })

    const validateForm = async(formdata) => {
        const validationsMessages: FormErrors = {
            email: "",
            nome: "",
            senha: "",
        }
        if(!formdata.nome){
            validationsMessages.nome = "Username is Required"
        } 
        else if(formdata.nome.length<=5){
            validationsMessages.nome = "Username must have more than 5 characters"
        } 
        else {
            validationsMessages.nome = ""
        }

        if(!formdata.senha){
            validationsMessages.senha = "Password is required"
        }
        else if(formdata.password.length<6){
            validationsMessages.senha = "Password must have more than 6 characters"
        }
        else {
            validationsMessages.senha = ""
        }

        if (!formdata.senhaConfirmacao) {
            validationsMessages.senhaConfirmacao = "Confirmation is required"
        }
        else if (formdata.passwordConfirmation !== formdata.password) {
            validationsMessages.senhaConfirmacao = "Passwords do not match"
        } else {
            validationsMessages.senhaConfirmacao = ""
        }
        setErrors(validationsMessages)

        const hasErrors = Object.values(validationsMessages).some(msg => msg !== "")
        console.log({valid: !hasErrors, messages: validationsMessages})
        return {valid: !hasErrors, messages: validationsMessages}
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
        const { valid, messages } = await validateForm(formdata)
        if(valid) {
            const user: User = { "email": formdata.email, "username": formdata.username,
                 "password": formdata.password}
            const result = await accountService.login(user)
            authService.saveUser(result.username)
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
                navigate("/login")
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
            Object.keys(messages).forEach(field => {
                if(messages[field as keyof FormErrors]){
                    setFormData(prev => ({
                        ...prev ,[field]:""
                    }))
                }
            })
        }
    }

    const displayMessages = (errors: FormErrors): string[] => {
        const errorsMessages = Object.values(errors).filter(msg => msg !== "")
        return errorsMessages
    }

    //FALTA RESETAR O INPUT QUE NÃO FUNCIONAR QUANDO APERTAR EM LOGIN(TALVEZ?)
    const messages = displayMessages(errors)

    return(
        <div className="MainContainer">
            <div className="LoginForm">
            <h1 className="LoginText">Login</h1>
            <form action="" id="formLogin">
            <h4>Enter your account:</h4>
            <div className="EmailForm">
                <label htmlFor="email">Email:</label>
                <input id="email" type="text" value={formdata.email} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.emailRef}/>
            </div>
            <div className="NameForm">
                <label htmlFor="name">Username:</label>
                <input id="username" type="text" value={formdata.username} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.usernameRef}/>
            </div>
            <div className="PasswordForm">
                <label htmlFor="">Password:</label>
                <input type="password" id="password" value={formdata.password} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.passwordRef}/>
            </div>
            <div className="PasswordConfirmForm">
                <label htmlFor="">Password confirmation:</label>
                <input type="password" id="senhaConfirmacao" value={formdata.senhaConfirmacao} onChange={onChangeFormData} onBlur={formBlurs} ref={inputRefs.passwordConfirmationRef}/>
            </div>
            </form>
            </div>
            <div className="ButtonsLoginForm">
                <span><button className="ConfirmLogin" onClick={handleLoginClick}>Login</button></span>
            </div>
            <div className="ErrorsDisplay">
                {messages.length > 0 && (
                    <div>
                        <ul>
                            {messages.map((error) => (
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