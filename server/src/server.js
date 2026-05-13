import 'dotenv/config';
import app from './app.js';
import { connectDataBase } from './database/config.js';
import authService from './services/auth.service.js';

const PORT = process.env.PORT || 3000;

connectDataBase().then(async () => {
    await authService.seedAdmin();
    app.listen(PORT, () => {
        console.log(`Server rodando na porta: ${PORT}`);
    });
});
