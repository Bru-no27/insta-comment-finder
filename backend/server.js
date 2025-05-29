
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const InstagramScraper = require('./scrapers/InstagramScraper');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'instagram_scraper',
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW) || 900,
});

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.CORS_ORIGINS ? 
      process.env.CORS_ORIGINS.split(',') : 
      ['http://localhost:5173'];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors(corsOptions));
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
      throw new Error('Credenciais do bot não configuradas');
    }

    scraper = new InstagramScraper({
      username: process.env.BOT_USERNAME,
      password: process.env.BOT_PASSWORD,
      headless: process.env.NODE_ENV === 'production',
      maxComments: parseInt(process.env.MAX_COMMENTS) || 100,
      scrollDelay: parseInt(process.env.SCROLL_DELAY) || 2000
    });
    
    console.log('🤖 Instagram Scraper inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar scraper:', error.message);
  }
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    scraper: scraper ? 'initialized' : 'not_initialized'
  });
});

// Main scraping endpoint
app.post('/api/instagram-comments', rateLimitMiddleware, async (req, res) => {
  const { postUrl } = req.body;

  console.log('🚀 Nova requisição de scraping recebida');
  console.log('📱 Post URL:', postUrl);

  if (!postUrl) {
    return res.status(400).json({
      status: 'error',
      error: 'URL do post é obrigatória',
      message: 'Por favor, forneça uma URL válida do Instagram'
    });
  }

  // Validate Instagram URL
  if (!postUrl.includes('instagram.com')) {
    return res.status(400).json({
      status: 'error',
      error: 'URL inválida',
      message: 'Por favor, forneça uma URL válida do Instagram'
    });
  }

  if (!scraper) {
    console.log('🔄 Inicializando scraper...');
    await initializeScraper();
  }

  if (!scraper) {
    return res.status(500).json({
      status: 'error',
      error: 'Scraper não disponível',
      message: 'Sistema temporariamente indisponível. Tente novamente em alguns minutos.'
    });
  }

  try {
    const result = await scraper.scrapeComments(postUrl);
    
    console.log(`✅ Scraping concluído: ${result.comments.length} comentários`);
    
    res.json({
      status: 'success',
      comments: result.comments,
      totalFound: result.comments.length,
      timestamp: new Date().toISOString(),
      message: `✅ ${result.comments.length} comentários extraídos com sucesso!`,
      debug: {
        loginSuccess: result.loginSuccess,
        pageLoaded: result.pageLoaded,
        commentsFound: result.comments.length
      }
    });

  } catch (error) {
    console.error('❌ Erro no scraping:', error);
    
    res.status(500).json({
      status: 'error',
      error: error.message,
      message: 'Erro ao extrair comentários. Verifique se a URL está correta e a publicação é pública.',
      timestamp: new Date().toISOString(),
      debug: {
        loginSuccess: false,
        pageLoaded: false,
        commentsFound: 0
      }
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Encerrando servidor...');
  if (scraper) {
    await scraper.close();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Encerrando servidor...');
  if (scraper) {
    await scraper.close();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`📊 Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 10} req/${(process.env.RATE_LIMIT_WINDOW || 900) / 60}min`);
  
  // Initialize scraper on startup
  await initializeScraper();
});
