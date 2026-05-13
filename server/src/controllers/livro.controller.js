import livroService from "../services/livro.service.js";

class LivroController {
    async create(req, res, next) {
        try {
            const livro = await livroService.create(req.body, req.user.id);
            return res.status(201).json(livro);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const genero = req.query.genero || null;
            const resultado = await livroService.findAll(page, limit, genero);
            return res.json(resultado);
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const livro = await livroService.findById(req.params.id);
            return res.json(livro);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const livro = await livroService.update(
                req.params.id,
                req.body,
                req.user.id,
                req.user.role
            );
            return res.json(livro);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await livroService.delete(req.params.id, req.user.id, req.user.role);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new LivroController();
