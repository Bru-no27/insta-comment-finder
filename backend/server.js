
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const InstagramScraper = require('./scrapers/InstagramScraper');
const corsConfig = require('./cors-config');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 INICIANDO SERVIDOR...');
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 PORT:', PORT);

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'instagram_scraper',
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW) || 900,
});

// Middleware simplificado
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// Log de todas as requisições com mais detalhes
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, {
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent')?.substring(0, 50),
    ip: req.ip,
    contentType: req.get('Content-Type')
  });
  next();
});

// CORS configurado ANTES de express.json
app.use(cors(corsConfig));

// Body parser DEPOIS do CORS
app.use(express.json({ limit: '10mb' }));

// Rate limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  try {
    const key = req.ip || 'default';
    await rateLimiter.consume(key);
    next();
  } catch (rejRes) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(secs));
    res.status(429).json({
      error: 'Muitas requisições. Tente novamente em alguns minutos.',
      retryAfter: secs
    });
  }
};

// Global scraper instance
let scraper = null;

// Initialize scraper
async function initializeScraper() {
  try {
    if (!process.env.BOT_USERNAME || !process.env.BOT_PASSWORD) {
      console.log('⚠️ Credenciais do bot não configuradas');
      return false;
    }

    scraper = new InstagramScraper({
      username: process.env.BOT_USERNAME,
      password: process.env.BOT_PASSWORD,
      headless: process.env.NODE_ENV === 'production',
      maxComments: parseInt(process.env.MAX_COMMENTS) || 100,
      scrollDelay: parseInt(process.env.SCROLL_DELAY) || 2000
    });
    
    console.log('🤖 Instagram Scraper inicializado');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar scraper:', error.message);
    return false;
  }
}

// OPTIONS handler para CORS preflight
app.options('*', (req, res) => {
  console.log('✅ OPTIONS request handled for:', req.path);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
  res.sendStatus(200);
});

// Root route - STATUS SIMPLIFICADO
app.get('/', (req, res) => {
  console.log('📍 ROOT ACCESS - enviando status');
  
  const status = {
    status: '✅ SERVIDOR ONLINE',
    service: 'Instagram Comment Finder',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    scraper: scraper ? 'Inicializado' : 'Não inicializado',
    cors: 'PERMISSIVO (debug)',
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/instagram-comments'
    ],
    config: {
      botUsername: process.env.BOT_USERNAME ? 'OK' : 'FALTANDO',
      botPassword: process.env.BOT_PASSWORD ? 'OK' : 'FALTANDO'
    }
  };
  
  res.json(status);
});

// Health check route
app.get('/api/health', (req, res) => {
  console.log('🏥 HEALTH CHECK');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Main scraping endpoint - GARANTINDO que seja POST
app.post('/api/instagram-comments', rateLimitMiddleware, async (req, res) => {
  console.log('🚀 POST /api/instagram-comments - REQUISIÇÃO RECEBIDA');
  console.log('📦 Body:', req.body);
  console.log('🌐 Headers:', req.headers);

  const { postUrl } = req.body;
  
  console.log('🚀 NOVA REQUISIÇÃO DE SCRAPING');
  console.log('📱 URL:', postUrl);
  console.log('🌐 Origin:', req.get('Origin'));

  if (!postUrl) {
    console.log('❌ URL do post não fornecida');
    return res.status(400).json({
      status: 'error',
      error: 'URL do post é obrigatória'
    });
  }

  if (!postUrl.includes('instagram.com')) {
    console.log('❌ URL inválida:', postUrl);
    return res.status(400).json({
      status: 'error',
      error: 'URL inválida - deve ser do Instagram'
    });
  }

  if (!scraper) {
    console.log('🔄 Inicializando scraper...');
    const initialized = await initializeScraper();
    if (!initialized) {
      return res.status(500).json({
        status: 'error',
        error: 'Credenciais do bot não configuradas',
        message: 'Configure BOT_USERNAME e BOT_PASSWORD no Railway'
      });
    }
  }

  try {
    console.log('⏳ Iniciando scraping...');
    const result = await scraper.scrapeComments(postUrl);
    
    console.log(`✅ Scraping concluído: ${result.comments.length} comentários`);
    
    res.json({
      status: 'success',
      comments: result.comments,
      totalFound: result.comments.length,
      timestamp: new Date().toISOString(),
      message: `${result.comments.length} comentários extraídos`
    });

  } catch (error) {
    console.error('❌ Erro no scraping:', error.message);
    
    res.status(500).json({
      status: 'error',
      error: error.message,
      message: 'Erro ao extrair comentários'
    });
  }
});

// Capturar tentativas de GET na rota POST
app.get('/api/instagram-comments', (req, res) => {
  console.log('❌ GET não permitido em /api/instagram-comments');
  res.status(405).json({
    status: 'error',
    error: 'Método GET não permitido. Use POST.',
    allowedMethods: ['POST']
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Rota não encontrada:', req.method, req.path);
  res.status(404).json({
    status: 'error',
    error: 'Endpoint não encontrado',
    availableRoutes: [
      'GET /',
      'GET /api/health', 
      'POST /api/instagram-comments'
    ]
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Erro não tratado:', error);
  res.status(500).json({
    status: 'error',
    error: 'Erro interno do servidor'
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('✅ Pronto para receber requisições');
  console.log('📍 Rotas disponíveis:');
  console.log('  GET  / - Status do servidor');
  console.log('  GET  /api/health - Health check');
  console.log('  POST /api/instagram-comments - Scraping de comentários');
  
  // Initialize scraper on startup
  await initializeScraper();
});
