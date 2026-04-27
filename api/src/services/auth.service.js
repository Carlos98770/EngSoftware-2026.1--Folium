import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

class AuthService {
    async login(email, senha) {
        const user = await User.findOne({ email });
        if (!user) {
            const erro = new Error("Credenciais inválidas");
            erro.statusCode = 401;
            throw erro;
        }

        const senhaValida = await bcrypt.compare(senha, user.senha_hash);
        if (!senhaValida) {
            const erro = new Error("Credenciais inválidas");
            erro.statusCode = 401;
            throw erro;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { senha_hash, ...userSemSenha } = user.toObject();
        return { user: userSemSenha, token };
    }

    async seedAdmin() {
        const adminExists = await User.findOne({ email: "admin" });
        if (adminExists) return;

        const senha_hash = await bcrypt.hash("senhasenhasenhaadminadminadmin", 8);
        await User.create({
            nome: "Administrador",
            email: "admin",
            senha_hash,
            role: "ADMIN"
        });
        console.log("✅ Usuário admin criado com sucesso");
    }
}

export default new AuthService();
