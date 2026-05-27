import type { LoginUser } from "../models/LoginUser";
import type { RegistroUser } from "../models/RegistroUser";
import type { UserResponse } from "../models/UserResponse";
import { jwtDecode } from "jwt-decode";

const API_URL: string = "http://localhost:3000"

interface tokenParts {
  sub: string,
  role: string,
  exp: Date
}

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token") ?? ""}`
})

const registerUser = async(user: RegistroUser): Promise<UserResponse> => {
  const response = await fetch(API_URL + "/create", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(user)
  })

  if(response.status === 409){
    throw new Error("email ja esta sendo usado.")
  }
  if(!response.ok){
    throw new Error("Erro ao registrar")
  }

  return login(user)
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
  const { sub, role } = tokenDecode(token)

  if (!tokenResponse.ok) {
    throw new Error("Erro no login")
  }

  const isAdmin = role.includes("ADMIN")
  console.log(isAdmin)
  return {"email": sub, "token": token, "admin": isAdmin}
}

const tokenDecode = (token: string): tokenParts => {
  const decodedToken = jwtDecode<tokenParts>(token)
  //console.log(decodedToken)
  //O SUB NÃO EXISTE NESSE TOKEN
  return {"sub": decodedToken.sub, "role": decodedToken.role, "exp": decodedToken.exp}
}

export const accountService = { login, registerUser }