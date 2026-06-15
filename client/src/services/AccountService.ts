import type { LoginUser } from "../models/LoginUser";
import type { RegistroUser } from "../models/RegistroUser";
import type { UserResponse } from "../models/UserResponse";
import { jwtDecode } from "jwt-decode";

const API_URL: string = "http://localhost:3000"

interface tokenParts {
  id: number,
  role: string,
  exp: Date
}

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("server.token") ?? ""}`
})

const registrar = async(user: RegistroUser): Promise<UserResponse> => {
  const response = await fetch(API_URL + "/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })

  if(response.status === 409){
    throw new Error("email ja esta sendo usado.")
  }
  if(!response.ok){
    throw new Error("Erro ao registrar")
  }

  return login({email: user.email, senha: user.senha})
  //const data = await response.json()
  //const id = data.id
  //const email = data.email
  //const { id, role } = tokenDecode(token)

  //return {"id": id, "token": token, "admin": false}
}

const login = async (user: LoginUser): Promise<UserResponse> => {
  //console.log(user.email, user.senha)
  const tokenResponse = await fetch(API_URL+"/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({"email": user.email, "senha": user.senha})
  })

  const data = await tokenResponse.json()
  const token = data.token
  const { id, role } = tokenDecode(token)

  if (!tokenResponse.ok) {
    throw new Error("Erro no login")
  }

  const isAdmin = role.includes("ADMIN")
  return {"id": id, "token": token, "admin": isAdmin}
}

const tokenDecode = (token: string): tokenParts => {
  const decodedToken = jwtDecode<tokenParts>(token)
  //console.log(decodedToken)
  //O SUB NÃO EXISTE NESSE TOKEN
  return {"id": decodedToken.id, "role": decodedToken.role, "exp": decodedToken.exp}
}

const getUsername = async (id: number) => {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "GET",
    headers: getHeaders(),
  })

  if(!response.ok){
    throw new Error("Erro ao encontrar um usuario")
  }

  const data = await response.json()
  console.log(data)
  return data.nome ?? ""
}

export const accountService = { login, registrar, getUsername }