import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const [, token] = authHeader.split(" ");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        return next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
}

export function adminMiddleware(req, res, next) {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Acesso negado: requer permissão de administrador" });
    }
    return next();
}
