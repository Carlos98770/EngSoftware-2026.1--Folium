import { DataTypes } from 'sequelize';
import sequelize from '../database/config.js';

const Emprestimo = sequelize.define('Emprestimo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    livro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dono_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    receptor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    data_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    data_fim: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    data_devolucao: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('ATIVO', 'DEVOLVIDO', 'ATRASADO'),
        defaultValue: 'ATIVO',
    },
}, {
    tableName: 'emprestimos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default Emprestimo;