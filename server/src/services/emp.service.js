import sequelize from '../database/config.js';
import { Emprestimo, Livro, User } from '../database/associations.js';
import { Op } from 'sequelize';

const includeCompleto = [
    { model: Livro, as: 'livro', attributes: ['id', 'nome', 'editora', 'comentario', 'quantidade_total', 'quantidade_disponivel'] },
    { model: User, as: 'dono', attributes: ['id', 'nome', 'email'] },
    { model: User, as: 'receptor', attributes: ['id', 'nome', 'email'] },
];

class EmprestimoService {
    async create(dados, userId) {
        const { livro_id, data_fim } = dados;

        const t = await sequelize.transaction();
        try {
            const livro = await Livro.findByPk(livro_id, { transaction: t, lock: true });

            if (!livro) {
                const erro = new Error('Livro não encontrado');
                erro.statusCode = 404;
                throw erro;
            }
            if (livro.quantidade_disponivel < 1) {
                const erro = new Error('Livro indisponível no momento');
                erro.statusCode = 400;
                throw erro;
            }
            if (String(livro.user_id) === String(userId)) {
                const erro = new Error('Você não pode pegar seu próprio livro emprestado');
                erro.statusCode = 400;
                throw erro;
            }

            const emprestimo = await Emprestimo.create({
                livro_id,
                dono_id: livro.user_id,
                receptor_id: userId,
                data_inicio: new Date(),
                data_fim: new Date(data_fim),
                status: 'ATIVO',
            }, { transaction: t });

            await livro.decrement('quantidade_disponivel', { by: 1, transaction: t });

            await t.commit();
            return await this.findById(emprestimo.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async devolver(emprestimoId, userId, userRole) {
        const t = await sequelize.transaction();
        try {
            const emprestimo = await Emprestimo.findByPk(emprestimoId, { transaction: t, lock: true });

            if (!emprestimo) {
                const erro = new Error('Empréstimo não encontrado');
                erro.statusCode = 404;
                throw erro;
            }

            const isReceptor = String(emprestimo.receptor_id) === String(userId);
            const isAdmin = userRole === 'ADMIN';

            if (!isReceptor && !isAdmin) {
                const erro = new Error('Apenas o receptor ou um administrador podem realizar a devolução');
                erro.statusCode = 403;
                throw erro;
            }
            if (emprestimo.status === 'DEVOLVIDO') {
                const erro = new Error('Este livro já foi devolvido');
                erro.statusCode = 400;
                throw erro;
            }

            await emprestimo.update({
                status: 'DEVOLVIDO',
                data_devolucao: new Date(),
            }, { transaction: t });

            await Livro.increment('quantidade_disponivel', {
                by: 1,
                where: { id: emprestimo.livro_id },
                transaction: t,
            });

            await t.commit();
            return await this.findById(emprestimoId);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async findAll(filtros = {}) {
        const where = {};
        if (filtros.status) where.status = filtros.status;
        if (filtros.receptor_id) where.receptor_id = filtros.receptor_id;
        if (filtros.dono_id) where.dono_id = filtros.dono_id;

        return await Emprestimo.findAll({ where, include: includeCompleto });
    }

    async findById(id) {
        const emprestimo = await Emprestimo.findByPk(id, { include: includeCompleto });
        if (!emprestimo) {
            const erro = new Error('Empréstimo não encontrado');
            erro.statusCode = 404;
            throw erro;
        }
        return emprestimo;
    }

    async updateStatus(emprestimoId, status) {
        const emprestimo = await Emprestimo.findByPk(emprestimoId);
        if (!emprestimo) {
            const erro = new Error('Empréstimo não encontrado');
            erro.statusCode = 404;
            throw erro;
        }
        await emprestimo.update({ status });
        return await this.findById(emprestimoId);
    }

    async getAcervoAvailability() {
        const totalBooks = await Livro.sum('quantidade_total');
        const availableBooks = await Livro.sum('quantidade_disponivel');
        return { totalBooks, availableBooks };
    }

    async getMostRentedBooks() {
        const mostRented = await Emprestimo.findAll({
            attributes: [
                'livro_id',
                [sequelize.fn('COUNT', sequelize.col('livro_id')), 'rentCount']
            ],
            group: ['livro_id'],
            order: [[sequelize.literal('rentCount'), 'DESC']],
            limit: 5,
            include: [{
                model: Livro,
                as: 'livro',
                attributes: ['nome', 'editora']
            }]
        });
        return mostRented;
    }

    async getRentalsStatus() {
        const rentalsStatus = await Emprestimo.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('status')), 'count']
            ],
            group: ['status']
        });
        return rentalsStatus;
    }

    async getActiveClients() {
        const activeClients = await Emprestimo.findAll({
            attributes: [
                'receptor_id',
                [sequelize.fn('COUNT', sequelize.col('receptor_id')), 'rentalCount']
            ],
            group: ['receptor_id'],
            order: [[sequelize.literal('rentalCount'), 'DESC']],
            limit: 5,
            include: [{
                model: User,
                as: 'receptor',
                attributes: ['nome', 'email']
            }]
        });
        return activeClients;
    }

    async getOverdueReturns() {
        const overdueReturns = await Emprestimo.findAll({
            where: {
                data_devolucao: null,
                data_fim: {
                    [Op.lt]: new Date() 
                },
                status: {
                    [Op.ne]: 'DEVOLVIDO' 
                }
            },
            include: includeCompleto
        });
        return overdueReturns;
    }
}

export default new EmprestimoService();