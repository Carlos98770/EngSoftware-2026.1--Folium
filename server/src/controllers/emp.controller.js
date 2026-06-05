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

    async getAcervoAvailability(req, res, next) {
        try {
            const availability = await emprestimoService.getAcervoAvailability();
            return res.json(availability);
        } catch (error) {
            next(error);
        }
    }

    async getMostRentedBooks(req, res, next) {
        try {
            const mostRented = await emprestimoService.getMostRentedBooks();
            return res.json(mostRented);
        } catch (error) {
            next(error);
        }
    }

    async getRentalsStatus(req, res, next) {
        try {
            const rentalsStatus = await emprestimoService.getRentalsStatus();
            return res.json(rentalsStatus);
        } catch (error) {
            next(error);
        }
    }

    async getActiveClients(req, res, next) {
        try {
            const activeClients = await emprestimoService.getActiveClients();
            return res.json(activeClients);
        } catch (error) {
            next(error);
        }
    }

    async getOverdueReturns(req, res, next) {
        try {
            const overdueReturns = await emprestimoService.getOverdueReturns();
            return res.json(overdueReturns);
        } catch (error) {
            next(error);
        }
    }
}

export default new EmprestimoController();
