
// Configuração específica de CORS para resolver o problema
const corsConfig = {
  origin: function (origin, callback) {
    // Domínios permitidos - incluindo especificamente o da Lovable
    const allowedOrigins = [
      'https://0973a68e-4563-4112-80a7-e1d75a342f3f.lovableproject.com',
      'http://localhost:5173',
      'https://lovable.dev'
    ];
    
    console.log('🔍 CORS DEBUG:', {
      requestOrigin: origin,
      allowedOrigins: allowedOrigins,
      isAllowed: !origin || allowedOrigins.includes(origin)
    });
    
    // Permitir requests sem origin (Postman, apps mobile)
    if (!origin) {
      console.log('✅ Request sem origin permitido');
      return callback(null, true);
    }
    
    // Verificar se origin está na lista permitida
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Origin permitido:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origin NÃO permitido:', origin);
      console.log('📋 Origins permitidos:', allowedOrigins);
      callback(new Error(`CORS: Origin ${origin} não autorizado`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'X-Requested-With',
    'Accept'
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

module.exports = corsConfig;
