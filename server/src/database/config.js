import { Sequelize } from 'sequelize';

const dbPassword = process.env.DB_PASSWORD || process.env.DB_PASS || '';
const isTestEnv = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize(
    isTestEnv ? 'sqlite::memory:' : process.env.DB_NAME,
    process.env.DB_USER,
    dbPassword,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: isTestEnv ? 'sqlite' : 'mysql',
        logging: isTestEnv ? false : console.log,
        timezone: '-03:00',
    }
);

export async function connectDataBase() {
    await sequelize.authenticate();
    console.log(isTestEnv ? 'SQLite (Memória) conectado para testes!' : 'MySQL conectado!');
}

export default sequelize;