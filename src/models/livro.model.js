import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';

const Livro = sequelize.define('Livro', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    editora: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    comentario: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    quantidade_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantidade_disponivel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'livros',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Livro;