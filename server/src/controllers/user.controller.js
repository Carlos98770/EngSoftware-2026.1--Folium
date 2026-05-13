import userService from "../services/user.service.js";

class UserController {
    async create(req, res, next) {
        try {
            const user = await userService.create(req.body);
            return res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

    async findAll(req, res, next) {
        try {
            const users = await userService.findAll();
            return res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async findById(req, res, next) {
        try {
            const user = await userService.findById(req.params.id);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const user = await userService.update(
                req.params.id,
                req.user.id,
                req.user.role,
                req.body
            );
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await userService.delete(req.params.id, req.user.id, req.user.role);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async promoteToAdmin(req, res, next) {
        try {
            const user = await userService.promoteToAdmin(req.params.id);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async demoteToUser(req, res, next) {
        try {
            const user = await userService.demoteToUser(req.params.id);
            return res.json(user);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
