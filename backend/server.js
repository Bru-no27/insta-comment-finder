
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

// Log de todas as requisições
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, {
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent')?.substring(0, 50),
    ip: req.ip
  });
  next();
});

// CORS configurado
app.use(cors(corsConfig));
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

// Main scraping endpoint
app.post('/api/instagram-comments', rateLimitMiddleware, async (req, res) => {
  const { postUrl } = req.body;
  
  console.log('🚀 NOVA REQUISIÇÃO DE SCRAPING');
  console.log('📱 URL:', postUrl);
  console.log('🌐 Origin:', req.get('Origin'));

  if (!postUrl) {
    return res.status(400).json({
      status: 'error',
      error: 'URL do post é obrigatória'
    });
  }

  if (!postUrl.includes('instagram.com')) {
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

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Rota não encontrada:', req.path);
  res.status(404).json({
    status: 'error',
    error: 'Endpoint não encontrado'
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
  
  // Initialize scraper on startup
  await initializeScraper();
  
  console.log('📍 Teste direto: curl http://localhost:' + PORT + '/');
});
