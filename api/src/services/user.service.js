import bcrypt from "bcrypt";
import User from "../models/user.model.js";

class UserService {
    async create({ nome, email, senha }) {
        const userExists = await User.findOne({ email });
        if (userExists) {
            const erro = new Error("Email já cadastrado!");
            erro.statusCode = 409;
            throw erro;
        }
        const senha_hash = await bcrypt.hash(senha, 8);
        return await User.create({ nome, email, senha_hash });
    }

    async findAll() {
        return await User.find().select("-senha_hash");
    }

    async findById(id) {
        const user = await User.findById(id).select("-senha_hash");
        if (!user) {
            const erro = new Error("Usuário não encontrado");
            erro.statusCode = 404;
            throw erro;
        }
        return user;
    }

    async update(userId, loggedUserId, loggedUserRole, data) {
        const isOwner = String(userId) === String(loggedUserId);
        const isAdmin = loggedUserRole === "ADMIN";

        if (!isOwner && !isAdmin) {
            const erro = new Error("Acesso negado: você não pode alterar este perfil");
            erro.statusCode = 403;
            throw erro;
        }

        // Apenas admin pode promover/rebaixar roles
        if (data.role && !isAdmin) {
            const erro = new Error("Acesso negado: apenas administradores podem alterar roles");
            erro.statusCode = 403;
            throw erro;
        }

        if (data.senha) {
            data.senha_hash = await bcrypt.hash(data.senha, 8);
            delete data.senha;
        }

        return await User.findByIdAndUpdate(userId, data, { new: true }).select("-senha_hash");
    }

    async delete(targetUserId, requesterId, requesterRole) {
        if (String(targetUserId) !== String(requesterId) && requesterRole !== "ADMIN") {
            const erro = new Error("Acesso negado: apenas o dono ou admin podem realizar esta ação");
            erro.statusCode = 403;
            throw erro;
        }
        await User.findByIdAndDelete(targetUserId);
    }

    async promoteToAdmin(targetUserId) {
        const user = await User.findById(targetUserId);
        if (!user) {
            const erro = new Error("Usuário não encontrado");
            erro.statusCode = 404;
            throw erro;
        }
        return await User.findByIdAndUpdate(
            targetUserId,
            { role: "ADMIN" },
            { new: true }
        ).select("-senha_hash");
    }

    async demoteToUser(targetUserId) {
        const user = await User.findById(targetUserId);
        if (!user) {
            const erro = new Error("Usuário não encontrado");
            erro.statusCode = 404;
            throw erro;
        }
        return await User.findByIdAndUpdate(
            targetUserId,
            { role: "USER" },
            { new: true }
        ).select("-senha_hash");
    }
}

export default new UserService();
