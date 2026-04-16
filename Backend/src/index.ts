import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';

import { testDatabaseConnection } from './db/database';
import './models';
import auleRoutes from './routes/aule.routes';
import prenotazioniRoutes from './routes/prenotazioni.routes';
import classiRoutes from './routes/classe.routes';
import utentiRoutes from './routes/utente.routes';
import authRoutes from './routes/auth.routes';
import { errorMiddleware, notFoundHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/request-logger.middleware';
import { initWebSocket } from './websocket';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(requestLogger);

app.get('/', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend Prenotazione Aule attivo', version: '1.1.0' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/aule', auleRoutes);
app.use('/api/v1/prenotazioni', prenotazioniRoutes);
app.use('/api/v1/classi', classiRoutes);
app.use('/api/v1/utenti', utentiRoutes);

app.use(notFoundHandler);
app.use(errorMiddleware);

const PORT = Number(process.env.PORT || 3000);

async function bootstrap(): Promise<void> {
  try {
    await testDatabaseConnection();

    initWebSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server avviato su http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Impossibile avviare il backend:', error);
    process.exit(1);
  }
}

void bootstrap();