import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// Import DB & API routes
import { initDatabase } from './db/schema.js';
import webhookRouter, { setSocketIO } from './api/webhook.js';
import signalsRouter from './api/signals.js';
import analyticsRouter from './api/analytics.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
  },
});

// CORS & JSON
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));

// API routes
app.use('/webhook', webhookRouter);
app.use('/api/signals', signalsRouter);
app.use('/api/analytics', analyticsRouter);

// Static files (for dashboard, if served)
app.use(express.static(path.join(__dirname, '../public')));

// Attach Socket.io to webhook logic
setSocketIO(io);

app.get('/', (req, res) => {
  res.json({ status: '0xLuigi Dashboard Bot running', time: new Date().toISOString() });
});

// Init DB and start server
initDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
  });
  io.on('connection', (socket) => {
    console.log('🟢 Dashboard client connected');
    socket.on('disconnect', () => console.log('🔴 Dashboard client disconnected'));
  });
}).catch(err => {
  console.error('❌ DB error:', err);
  process.exit(1);
});
