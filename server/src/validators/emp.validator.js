import { body } from 'express-validator';

export const emprestimoCreateValidator = [
    body('livro_id')
        .isMongoId().withMessage('ID do livro inválido'),

    body('data_fim')
        .isISO8601().withMessage('Data final inválida (use o formato ANO-MES-DIA)')
        .custom((value) => {
            const dataFim = new Date(value);
            const hoje = new Date();
            if (dataFim <= hoje) {
                throw new Error('A data final deve ser posterior à data atual');
            }
            return true;
        })
];