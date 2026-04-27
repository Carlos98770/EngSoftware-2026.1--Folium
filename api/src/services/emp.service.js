import mongoose from "mongoose";
import Emprestimo from "../models/emp.model.js";
import Livro from "../models/livro.model.js";

class EmprestimoService {
    async create(dados, userId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { livro_id, data_fim } = dados;
            const livro = await Livro.findById(livro_id).session(session);

            if (!livro) {
                const erro = new Error("Livro não encontrado");
                erro.statusCode = 404;
                throw erro;
            }
            if (livro.quantidade_disponivel < 1) {
                const erro = new Error("Livro indisponível no momento");
                erro.statusCode = 400;
                throw erro;
            }
            if (String(livro.user_id) === String(userId)) {
                const erro = new Error("Você não pode pegar seu próprio livro emprestado");
                erro.statusCode = 400;
                throw erro;
            }

            const novoEmprestimo = await Emprestimo.create([{
                livro_id,
                dono_id: livro.user_id,
                receptor_id: userId,
                data_inicio: new Date(),
                data_fim: new Date(data_fim),
                status: "ATIVO"
            }], { session });

            await Livro.findByIdAndUpdate(
                livro_id,
                { $inc: { quantidade_disponivel: -1 } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();
            return novoEmprestimo[0];
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async devolver(emprestimoId, userId, userRole) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const emprestimo = await Emprestimo.findById(emprestimoId).session(session);

            if (!emprestimo) {
                const erro = new Error("Empréstimo não encontrado");
                erro.statusCode = 404;
                throw erro;
            }

            const isReceptor = String(emprestimo.receptor_id) === String(userId);
            const isAdmin = userRole === "ADMIN";

            if (!isReceptor && !isAdmin) {
                const erro = new Error("Apenas o receptor ou um administrador podem realizar a devolução");
                erro.statusCode = 403;
                throw erro;
            }
            if (emprestimo.status === "DEVOLVIDO") {
                const erro = new Error("Este livro já foi devolvido");
                erro.statusCode = 400;
                throw erro;
            }

            emprestimo.status = "DEVOLVIDO";
            emprestimo.data_devolucao = new Date();
            await emprestimo.save({ session });

            await Livro.findByIdAndUpdate(
                emprestimo.livro_id,
                { $inc: { quantidade_disponivel: 1 } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();
            return emprestimo;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async findAll(filtros) {
        return await Emprestimo.find(filtros)
            .populate("livro_id", "nome")
            .populate("dono_id", "nome email")
            .populate("receptor_id", "nome email");
    }

    async findById(id) {
        const emprestimo = await Emprestimo.findById(id)
            .populate("livro_id", "nome")
            .populate("dono_id", "nome")
            .populate("receptor_id", "nome");
        if (!emprestimo) {
            const erro = new Error("Empréstimo não encontrado");
            erro.statusCode = 404;
            throw erro;
        }
        return emprestimo;
    }

    async updateStatus(emprestimoId, status) {
        const emprestimo = await Emprestimo.findById(emprestimoId);
        if (!emprestimo) {
            const erro = new Error("Empréstimo não encontrado");
            erro.statusCode = 404;
            throw erro;
        }
        emprestimo.status = status;
        return await emprestimo.save();
    }
}

export default new EmprestimoService();
