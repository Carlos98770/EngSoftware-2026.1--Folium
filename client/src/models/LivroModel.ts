export type Livro = {
    id: number,
    nome: string,
    editora: string,
    comentario: string,
    quantidade_total: number,
    quantidade_disponivel: number,
    generos?: string[],
    user_id: number,
}