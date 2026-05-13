import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';

const LivroGenero = sequelize.define('LivroGenero', {
    livro_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    genero_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
}, {
    tableName: 'livro_generos',
    timestamps: false,
});

export default LivroGenero;