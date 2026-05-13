import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';

const Genero = sequelize.define('Genero', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'generos',
    timestamps: false,
});

export default Genero;