import type { Emprestimo, CriarEmprestimoInput, EmprestimoStatus } from "../models/EmprestimoModel"

const API_URL: string = "http://localhost:3000"

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("server.token") ?? ""}`,
})

const findAll = async (filtros?: { status?: EmprestimoStatus; receptor_id?: number; dono_id?: number }): Promise<Emprestimo[]> => {
    const params = new URLSearchParams()
    if (filtros?.status) params.append("status", filtros.status)
    if (filtros?.receptor_id) params.append("receptor_id", String(filtros.receptor_id))
    if (filtros?.dono_id) params.append("dono_id", String(filtros.dono_id))

    const url = `${API_URL}/emprestimos${params.toString() ? `?${params}` : ""}`
    const response = await fetch(url, { headers: getHeaders() })
    if (!response.ok) throw new Error("Erro ao buscar empréstimos")
    return await response.json()
}

const findById = async (id: number): Promise<Emprestimo> => {
    const response = await fetch(`${API_URL}/emprestimos/${id}`, { headers: getHeaders() })
    if (!response.ok) throw new Error("Empréstimo não encontrado")
    return await response.json()
}

const create = async (dados: CriarEmprestimoInput): Promise<Emprestimo> => {
    const response = await fetch(`${API_URL}/emprestimos`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(dados),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message ?? "Erro ao criar empréstimo")
    return data
}

const devolver = async (id: number): Promise<Emprestimo> => {
    const response = await fetch(`${API_URL}/emprestimos/${id}/return`, {
        method: "POST",
        headers: getHeaders(),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message ?? "Erro ao devolver empréstimo")
    return data
}

const updateStatus = async (id: number, status: EmprestimoStatus): Promise<Emprestimo> => {
    const response = await fetch(`${API_URL}/emprestimos/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message ?? "Erro ao atualizar status")
    return data
}

export const EmprestimoService = { findAll, findById, create, devolver, updateStatus }