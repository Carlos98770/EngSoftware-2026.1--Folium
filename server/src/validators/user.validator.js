import { body } from "express-validator";

export const userCreateValidator = [
    body('nome')
        .notEmpty().withMessage('O nome é obrigatório')
        .isString().withMessage('O nome deve ser uma String'),

    body('email')
        .notEmpty().withMessage('Forneça um email válido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    body('senha')
        .isLength({min:5}).withMessage('A senha deve ter no mínimo 5 caracteres')
];

export const userUpdateValidator = [
    body('nome')
        .optional()
        .notEmpty().withMessage('O nome não pode ser vazio'),

    body('email')
        .optional()
        .isEmail().withMessage('Email inválido'),

    body('senha')
        .optional()
        .isLength({min:5 }).withMessage('A senha deve ter no mínimo 5 caracteres')
];