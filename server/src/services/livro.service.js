import { Op } from 'sequelize'; // <-- Importação necessária para a busca por título
import sequelize from '../database/config.js';
import { Livro, User, Genero } from '../database/associations.js';

class LivroService {
    async create(dados, userId) {
        const { nome, editora, comentario, quantidade_total, generos = [] } = dados;

        const livro = await Livro.create({
            nome,
            editora,
            comentario,
            quantidade_total,
            quantidade_disponivel: quantidade_total,
            user_id: userId,
        });

        if (generos.length > 0) {
            const registros = await Promise.all(
                generos.map((nome) => Genero.findOrCreate({ where: { nome } }))
            );
            await livro.setGeneros(registros.map(([g]) => g));
        }

        return await this.findById(livro.id);
    }

    // <-- Adicionado o parâmetro 'busca' aqui
    async findAll(page = 1, limit = 10, genero = null, busca = null) {
        const offset = (page - 1) * limit;

        const where = {};
        
        if (busca) {
            where.nome = {
                [Op.substring]: busca 
            };
        }

        const include = [
            { model: User, as: 'dono', attributes: ['id', 'nome', 'email'] },
            { model: Genero, as: 'generos', attributes: ['id', 'nome'], through: { attributes: [] } },
        ];

        if (genero) {
            include[1].where = { nome: genero };
            include[1].required = true;
        }

        const { rows: data, count: total } = await Livro.findAndCountAll({
            where,
            include,
            distinct: true, 
            limit,
            offset,
        });

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id) {
        const livro = await Livro.findByPk(id, {
            include: [
                { model: User, as: 'dono', attributes: ['id', 'nome', 'email'] },
                { model: Genero, as: 'generos', attributes: ['id', 'nome'], through: { attributes: [] } },
            ],
        });
        if (!livro) {
            const erro = new Error('Livro não encontrado');
            erro.statusCode = 404;
            throw erro;
        }
        return livro;
    }

    async update(id, dados, userId, userRole) {
        const livro = await Livro.findByPk(id);
        if (!livro) {
            const erro = new Error('Livro não encontrado');
            erro.statusCode = 404;
            throw erro;
        }

        const isOwner = String(livro.user_id) === String(userId);
        const isAdmin = userRole === 'ADMIN';

        if (!isOwner && !isAdmin) {
            const erro = new Error('Operação não permitida: você não é o dono deste livro');
            erro.statusCode = 403;
            throw erro;
        }

        const { generos, ...camposSemGeneros } = dados;
        await livro.update(camposSemGeneros);

        if (generos !== undefined) {
            const registros = await Promise.all(
                generos.map((nome) => Genero.findOrCreate({ where: { nome } }))
            );
            await livro.setGeneros(registros.map(([g]) => g));
        }

        return await this.findById(id);
    }

    async delete(livroId, requesterId, requesterRole) {
        const livro = await Livro.findByPk(livroId);
        if (!livro) {
            const erro = new Error('Livro não encontrado');
            erro.statusCode = 404;
            throw erro;
        }

        const isOwner = String(livro.user_id) === String(requesterId);
        const isAdmin = requesterRole === 'ADMIN';

        if (!isOwner && !isAdmin) {
            const erro = new Error('Acesso negado: você não é o dono deste livro');
            erro.statusCode = 403;
            throw erro;
        }

        await livro.destroy();
    }
}

export default new LivroService();
