import User from '../models/user.model.js';
import Livro from '../models/livro.model.js';
import Genero from '../models/genero.model.js';
import LivroGenero from '../models/livroGenero.model.js';
import Emprestimo from '../models/emp.model.js';

// User -> Livro
User.hasMany(Livro, { foreignKey: 'user_id', as: 'livros' });
Livro.belongsTo(User, { foreignKey: 'user_id', as: 'dono' });

// Livro <-> Genero (N:N via livro_generos)
Livro.belongsToMany(Genero, {
    through: LivroGenero,
    foreignKey: 'livro_id',
    otherKey: 'genero_id',
    as: 'generos',
});
Genero.belongsToMany(Livro, {
    through: LivroGenero,
    foreignKey: 'genero_id',
    otherKey: 'livro_id',
    as: 'livros',
});

// Livro -> Emprestimo
Livro.hasMany(Emprestimo, { foreignKey: 'livro_id', as: 'emprestimos' });
Emprestimo.belongsTo(Livro, { foreignKey: 'livro_id', as: 'livro' });

// User -> Emprestimo (dono)
User.hasMany(Emprestimo, { foreignKey: 'dono_id', as: 'emprestimos_como_dono' });
Emprestimo.belongsTo(User, { foreignKey: 'dono_id', as: 'dono' });

// User -> Emprestimo (receptor)
User.hasMany(Emprestimo, { foreignKey: 'receptor_id', as: 'emprestimos_como_receptor' });
Emprestimo.belongsTo(User, { foreignKey: 'receptor_id', as: 'receptor' });

export { User, Livro, Genero, LivroGenero, Emprestimo };