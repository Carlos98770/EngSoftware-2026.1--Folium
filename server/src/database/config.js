import { Sequelize } from 'sequelize';

const isTestEnv = process.env.NODE_ENV === 'test';
const dbPassword = process.env.DB_PASSWORD || process.env.DB_PASS || '';

let sequelize;

if (isTestEnv) {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    });
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        dbPassword,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql',
            logging: console.log,
            timezone: '-03:00',
        }
    );
}

export async function connectDataBase() {
    await sequelize.authenticate();
    console.log(isTestEnv ? 'SQLite (Memória) conectado para testes!' : 'MySQL conectado!');
}

export default sequelize;