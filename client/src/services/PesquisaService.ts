import type { Livro } from "../models/LivroModel"

const API_URL: string = "http://localhost:3000"

export const PesquisaService = async (livro: Livro) => {
    const pesquisaResponse = await fetch(API_URL + "/livros?titulo=${livro}", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    const data = await pesquisaResponse.json()
    return data
} 
//export PesquisaService