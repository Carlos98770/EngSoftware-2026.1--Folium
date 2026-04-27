import emprestimoService from "../services/emp.service.js";

class EmprestimoController {
    async create(req, res, next) {
        try {
            const emprestimo = await emprestimoService.create(req.body, req.user.id);
            return res.status(201).json(emprestimo);
        } catch (error) {
            next(error);
        }
    }

    async devolver(req, res, next) {
        try {
            const emprestimo = await emprestimoService.devolver(
                req.params.id,
                req.user.id,
                req.user.role
            );
            return res.json(emprestimo);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const filtros = req.query;
            const emprestimos = await emprestimoService.findAll(filtros);
            return res.json(emprestimos);
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const emprestimo = await emprestimoService.findById(req.params.id);
            return res.json(emprestimo);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const emprestimo = await emprestimoService.updateStatus(
                req.params.id,
                req.body.status
            );
            return res.json(emprestimo);
        } catch (error) {
            next(error);
        }
    }
}

export default new EmprestimoController();
