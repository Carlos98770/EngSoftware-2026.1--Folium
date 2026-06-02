import type { Livro } from "../models/LivroModel"

const API_URL: string = "http://localhost:3000"

const create = async (livro: Livro) => {
    const livroResponse = await fetch(API_URL+"/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({livro})
    })

    const data = await livroResponse.json()
    return data.data
} 

export const LivroService = { create }