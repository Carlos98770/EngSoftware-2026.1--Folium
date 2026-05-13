import { body } from 'express-validator';

export const livroCreateValidator = [
    body('nome')
        .notEmpty().withMessage('O nome do livro é obrigatório'),

    body('editora')
        .notEmpty().withMessage('A editora é obrigatória'),

    body('quantidade_total')
        .isInt({ min: 1 }).withMessage('A quantidade total deve ser um número inteiro maior que 0'),

    body('comentario')
        .optional()
        .isLength({ max: 200 }).withMessage('O comentário pode ter no máximo 200 caracteres'),

    body('generos')
        .optional()
        .isArray().withMessage('Gêneros deve ser uma lista')
        .custom((generos) => {
            if (generos.some(g => typeof g !== 'string' || g.trim() === '')) {
                throw new Error('Cada gênero deve ser um texto não vazio');
            }
            return true;
        })
];

export const livroUpdateValidator = [
    body('nome').optional().notEmpty().withMessage('O nome não pode ser vazio'),
    body('editora').optional().notEmpty().withMessage('A editora não pode ser vazia'),
    body('quantidade_total').optional().isInt({ min: 1 }).withMessage('A quantidade total deve ser um número inteiro maior que 0'),
    body('comentario').optional().isLength({ max: 200 }).withMessage('O comentário pode ter no máximo 200 caracteres'),

    body('generos')
        .optional()
        .isArray().withMessage('Gêneros deve ser uma lista')
        .custom((generos) => {
            if (generos.some(g => typeof g !== 'string' || g.trim() === '')) {
                throw new Error('Cada gênero deve ser um texto não vazio');
            }
            return true;
        })
];
