import authService from "../services/auth.service.js";

class AuthController {
    async login(req, res, next) {
        try {
            const { email, senha } = req.body;
            const data = await authService.login(email, senha);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
