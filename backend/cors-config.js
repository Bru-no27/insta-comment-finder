
// CORS configuração específica para Lovable + debug
const corsConfig = {
  origin: function (origin, callback) {
    console.log('🌐 CORS: Origin recebido:', origin);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'https://id-preview--0973a68e-4563-4112-80a7-e1d75a342f3f.lovable.app',
      /^https:\/\/.*\.lovable\.app$/,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ];
    
    // Permitir requisições sem origin (Postman, curl, etc.)
    if (!origin) {
      console.log('✅ CORS: Permitindo requisição sem origin');
      return callback(null, true);
    }
    
    // Verificar se origin está na lista permitida
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      console.log('✅ CORS: Origin permitido:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin não permitido:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'Accept',
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: ['*'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

console.log('🌐 CORS: Configuração específica para Lovable ativada');

module.exports = corsConfig;
