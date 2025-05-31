
// Configuração CORS extremamente simples e permissiva para debug
const corsConfig = {
  origin: true, // Permite qualquer origin temporariamente para debug
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  optionsSuccessStatus: 200
};

console.log('🌐 CORS configurado de forma PERMISSIVA para debug');

module.exports = corsConfig;
