import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
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