
// CORS configuração EXTREMAMENTE permissiva para resolver problemas
const corsConfig = {
  origin: true, // Aceita qualquer origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'Accept',
    'X-Requested-With',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: ['*'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

console.log('🌐 CORS: Configuração ULTRA-PERMISSIVA ativada');

module.exports = corsConfig;
