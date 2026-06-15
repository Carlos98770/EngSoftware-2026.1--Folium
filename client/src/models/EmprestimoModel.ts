export type EmprestimoStatus = "ATIVO" | "DEVOLVIDO" | "ATRASADO"

export type EmprestimoUsuario = {
    id: number
    nome: string
    email: string
}

export type EmprestimoLivro = {
    id: number
    nome: string
    editora: string
    comentario: string
    quantidade_total: number
    quantidade_disponivel: number
}

export type Emprestimo = {
    id: number
    livro_id: number
    dono_id: number
    receptor_id: number
    data_inicio: string
    data_fim: string
    data_devolucao: string | null
    status: EmprestimoStatus
    livro: EmprestimoLivro
    dono: EmprestimoUsuario
    receptor: EmprestimoUsuario
    created_at: string
    updated_at: string
}

export type CriarEmprestimoInput = {
    livro_id: number
    data_fim: string
    receptor_id: number
}