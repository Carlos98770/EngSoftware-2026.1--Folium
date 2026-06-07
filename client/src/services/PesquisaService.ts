const API_URL: string = "http://localhost:3000"

export const PesquisaService = async (titulo: string) => {
    const pesquisaResponse = await fetch(`${API_URL}/livros?titulo=${titulo}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })

    const data = await pesquisaResponse.json()
    return data.data
} 
//export PesquisaService