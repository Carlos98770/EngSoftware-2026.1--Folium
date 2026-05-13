import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import testRouter from './routes/test.route.js';
import userRouter from './routes/user.route.js';
import livroRouter from './routes/livro.route.js';
import empRouter from './routes/emp.route.js';
import authRouter from './routes/auth.route.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use(testRouter);
app.use(userRouter);
app.use(livroRouter);
app.use(empRouter);
app.use(authRouter);

app.use(errorMiddleware);

export default app;