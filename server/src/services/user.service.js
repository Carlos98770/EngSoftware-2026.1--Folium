import bcrypt from 'bcrypt';
import { User } from '../database/associations.js';

class UserService {
    async create({ nome, email, senha }) {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            const erro = new Error('Email já cadastrado!');
            erro.statusCode = 409;
            throw erro;
        }
        const senha_hash = await bcrypt.hash(senha, 8);
        const user = await User.create({ nome, email, senha_hash });
        const { senha_hash: _, ...userSemSenha } = user.toJSON();
        return userSemSenha;
    }

    async findAll() {
        return await User.findAll({
            attributes: { exclude: ['senha_hash'] },
        });
    }

    async findById(id) {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['senha_hash'] },
        });
        if (!user) {
            const erro = new Error('Usuário não encontrado');
            erro.statusCode = 404;
            throw erro;
        }
        return user;
    }

    async update(userId, loggedUserId, loggedUserRole, data) {
        const isOwner = String(userId) === String(loggedUserId);
        const isAdmin = loggedUserRole === 'ADMIN';

        if (!isOwner && !isAdmin) {
            const erro = new Error('Acesso negado: você não pode alterar este perfil');
            erro.statusCode = 403;
            throw erro;
        }

        if (data.role && !isAdmin) {
            const erro = new Error('Acesso negado: apenas administradores podem alterar roles');
            erro.statusCode = 403;
            throw erro;
        }

        if (data.senha) {
            data.senha_hash = await bcrypt.hash(data.senha, 8);
            delete data.senha;
        }

        await User.update(data, { where: { id: userId } });
        return await this.findById(userId);
    }

    async delete(targetUserId, requesterId, requesterRole) {
        if (String(targetUserId) !== String(requesterId) && requesterRole !== 'ADMIN') {
            const erro = new Error('Acesso negado: apenas o dono ou admin podem realizar esta ação');
            erro.statusCode = 403;
            throw erro;
        }
        await User.destroy({ where: { id: targetUserId } });
    }

    async promoteToAdmin(targetUserId) {
        const user = await User.findByPk(targetUserId);
        if (!user) {
            const erro = new Error('Usuário não encontrado');
            erro.statusCode = 404;
            throw erro;
        }
        await User.update({ role: 'ADMIN' }, { where: { id: targetUserId } });
        return await this.findById(targetUserId);
    }

    async demoteToUser(targetUserId) {
        const user = await User.findByPk(targetUserId);
        if (!user) {
            const erro = new Error('Usuário não encontrado');
            erro.statusCode = 404;
            throw erro;
        }
        await User.update({ role: 'USER' }, { where: { id: targetUserId } });
        return await this.findById(targetUserId);
    }
}

export default new UserService();