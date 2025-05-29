
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
  duration: parseInt(process.env.RATE_LIMIT_WINDOW) || 900, // 15 minutes
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'https://lovableproject.com', /\.lovableproject\.com$/],
  credentials: true
}));
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
      error: 'Too many requests',
      retryAfter: secs
    });
  }
};

// Instância global do scraper
let scraper = null;

// Inicializar scraper
async function initializeScraper() {
  try {
    scraper = new InstagramScraper({
      username: process.env.BOT_USERNAME,
      password: process.env.BOT_PASSWORD,
      headless: process.env.NODE_ENV === 'production',
      maxComments: parseInt(process.env.MAX_COMMENTS) || 100,
      scrollDelay: parseInt(process.env.SCROLL_DELAY) || 2000
    });
    
    console.log('🤖 Instagram Scraper inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar scraper:', error);
  }
}

// Rotas
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    scraper: scraper ? 'initialized' : 'not_initialized'
  });
});

app.post('/api/test-comments', rateLimitMiddleware, async (req, res) => {
  const { postUrl, botCredentials } = req.body;

  console.log('🚀 Nova requisição de scraping recebida');
  console.log('📱 Post URL:', postUrl);

  if (!postUrl) {
    return res.status(400).json({
      error: 'URL do post é obrigatória',
      status: 'error'
    });
  }

  if (!scraper) {
    console.log('🔄 Inicializando scraper...');
    await initializeScraper();
  }

  try {
    const result = await scraper.scrapeComments(postUrl);
    
    console.log(`✅ Scraping concluído: ${result.comments.length} comentários`);
    
    res.json({
      status: 'success',
      comments: result.comments,
      totalFound: result.comments.length,
      timestamp: new Date().toISOString(),
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

// Inicializar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 10} req/${(process.env.RATE_LIMIT_WINDOW || 900000) / 1000}s`);
  
  // Inicializar scraper ao startar
  await initializeScraper();
});
