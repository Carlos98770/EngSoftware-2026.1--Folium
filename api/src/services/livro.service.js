import Livro from "../models/livro.model.js";

class LivroService {
    async create(dados, userId) {
        const novoLivro = {
            ...dados,
            user_id: userId,
            quantidade_disponivel: dados.quantidade_total
        };
        return await Livro.create(novoLivro);
    }

    async findAll(page = 1, limit = 10, genero = null) {
        const skip = (page - 1) * limit;
        const filtro = genero ? { generos: genero } : {};

        const livros = await Livro.find(filtro)
            .populate("user_id", "nome email")
            .skip(skip)
            .limit(limit);

        const total = await Livro.countDocuments(filtro);

        return {
            data: livros,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findById(id) {
        const livro = await Livro.findById(id).populate("user_id", "nome email");
        if (!livro) {
            const erro = new Error("Livro não encontrado");
            erro.statusCode = 404;
            throw erro;
        }
        return livro;
    }

    async update(id, dados, userId, userRole) {
        const livro = await Livro.findById(id);
        if (!livro) {
            const erro = new Error("Livro não encontrado");
            erro.statusCode = 404;
            throw erro;
        }

        const isOwner = String(livro.user_id._id || livro.user_id) === String(userId);
        const isAdmin = userRole === "ADMIN";

        if (!isOwner && !isAdmin) {
            const erro = new Error("Operação não permitida: você não é o dono deste livro");
            erro.statusCode = 403;
            throw erro;
        }

        return await Livro.findByIdAndUpdate(id, dados, { new: true });
    }

    async delete(livroId, requesterId, requesterRole) {
        const livro = await Livro.findById(livroId);
        if (!livro) {
            const erro = new Error("Livro não encontrado");
            erro.statusCode = 404;
            throw erro;
        }

        const isOwner = String(livro.user_id) === String(requesterId);
        const isAdmin = requesterRole === "ADMIN";

        if (!isOwner && !isAdmin) {
            const erro = new Error("Acesso negado: você não é o dono deste livro");
            erro.statusCode = 403;
            throw erro;
        }

        await Livro.findByIdAndDelete(livroId);
    }
}

export default new LivroService();
