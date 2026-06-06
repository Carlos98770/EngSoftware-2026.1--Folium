import { Sequelize } from 'sequelize';

const dbPassword = process.env.DB_PASSWORD || process.env.DB_PASS || '';

const sequelize = new Sequelize(
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

export async function connectDataBase() {
    await sequelize.authenticate();
    console.log('MySQL conectado!');
}

export default sequelize;