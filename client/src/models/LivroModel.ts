export type Livro = {
    nome: string,
    editora: string,
    comentario: string,
    quantidade_total: number,
    quantidade_disponivel: number,
    generos?: string[],
}