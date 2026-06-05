import type { Livro } from "../models/LivroModel"

const API_URL: string = "http://localhost:3000"

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("server.token") ?? ""}`
})

const create = async (livro: Livro) => {
    const livroResponse = await fetch(API_URL+"/livros", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(livro)
    })

    const data = await livroResponse.json()
    return data.data
} 

const update = async (livro: Livro, id: number) => {
    const livroResponse = await fetch(`${API_URL}/livros/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(livro)
    })

    const data = await livroResponse.json()
    return data.data
} 

const deletar = async (id: number) => {
  const response = await fetch(`${API_URL}/livros/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })
  if (!response.ok) throw new Error("Erro ao deletar")
  return null
}

export const LivroService = { create, update, deletar }
