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

// CORS configuration for production - ATUALIZADO
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de origens permitidas - incluindo o domínio da Lovable
    const allowedOrigins = process.env.CORS_ORIGINS ? 
      process.env.CORS_ORIGINS.split(',').map(url => url.trim()) : 
      [
        'https://0973a68e-4563-4112-80a7-e1d75a342f3f.lovableproject.com',
        'http://localhost:5173', 
        'https://lovable.dev'
      ];
    
    console.log('🌐 CORS Check:', {
      requestOrigin: origin,
      allowedOrigins: allowedOrigins,
      corsOriginsEnv: process.env.CORS_ORIGINS
    });
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ Origin not allowed:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      callback(new Error(`CORS: Origin ${origin} not allowed. Configure CORS_ORIGINS variable.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
  optionsSuccessStatus: 200
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
      console.log('⚠️ Credenciais do bot não configuradas - funcionalidade limitada');
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

// Root route - API status with detailed information - MELHORADO
app.get('/', (req, res) => {
  const status = {
    status: '✅ API FUNCIONANDO',
    service: 'Instagram Comment Finder',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    scraper: scraper ? '✅ Inicializado' : '⚠️ Não inicializado',
    cors: {
      configured: process.env.CORS_ORIGINS ? '✅ Configurado' : '⚠️ Usando padrão',
      origins: process.env.CORS_ORIGINS ? 
        process.env.CORS_ORIGINS.split(',').map(url => url.trim()) : 
        ['https://0973a68e-4563-4112-80a7-e1d75a342f3f.lovableproject.com', 'http://localhost:5173'],
      requestOrigin: req.get('Origin') || 'No origin header'
    },
    configuration: {
      botUsername: process.env.BOT_USERNAME ? '✅ Configurado' : '❌ Faltando',
      botPassword: process.env.BOT_PASSWORD ? '✅ Configurado' : '❌ Faltando',
      maxComments: process.env.MAX_COMMENTS || '100 (padrão)',
      rateLimit: `${process.env.RATE_LIMIT_MAX_REQUESTS || 10} req/${(process.env.RATE_LIMIT_WINDOW || 900) / 60}min`
    },
    endpoints: {
      health: 'GET /api/health',
      comments: 'POST /api/instagram-comments'
    },
    usage: {
      description: 'Esta é uma API REST para extrair comentários do Instagram',
      example: 'POST /api/instagram-comments com { "postUrl": "https://instagram.com/p/..." }'
    }
  };
  
  console.log('📊 Status da API consultado:', {
    ip: req.ip,
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  res.json(status);
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    scraper: scraper ? 'initialized' : 'not_initialized',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Main scraping endpoint
app.post('/api/instagram-comments', rateLimitMiddleware, async (req, res) => {
  const { postUrl } = req.body;

  console.log('🚀 Nova requisição de scraping recebida');
  console.log('📱 Post URL:', postUrl);
  console.log('🌐 Origin:', req.get('Origin'));
  console.log('🔍 User-Agent:', req.get('User-Agent'));

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
    const initialized = await initializeScraper();
    if (!initialized) {
      return res.status(500).json({
        status: 'error',
        error: 'Scraper não disponível',
        message: 'Credenciais do bot não configuradas. Configure BOT_USERNAME e BOT_PASSWORD.',
        debug: {
          BOT_USERNAME: process.env.BOT_USERNAME ? 'configured' : 'missing',
          BOT_PASSWORD: process.env.BOT_PASSWORD ? 'configured' : 'missing'
        }
      });
    }
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    error: 'Endpoint não encontrado',
    message: 'Verifique a documentação da API',
    availableEndpoints: [
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
    error: 'Erro interno do servidor',
    message: 'Algo deu errado. Tente novamente.'
  });
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

// Start server - MELHORADO
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 10} req/${(process.env.RATE_LIMIT_WINDOW || 900) / 60}min`);
  
  // Log CORS configuration
  const corsOrigins = process.env.CORS_ORIGINS ? 
    process.env.CORS_ORIGINS.split(',').map(url => url.trim()) : 
    ['https://0973a68e-4563-4112-80a7-e1d75a342f3f.lovableproject.com', 'http://localhost:5173'];
  
  console.log('🌐 CORS configurado para:', corsOrigins);
  
  // Initialize scraper on startup
  await initializeScraper();
  
  console.log('✅ API pronta para receber requisições');
  console.log(`📍 Teste: GET http://localhost:${PORT}/`);
  console.log(`🔗 URL pública: https://insta-comment-finder-production.up.railway.app/`);
});
