
import type { ApiConfig } from './types';

// APIs Profissionais Avançadas (baseadas na análise da Simpliers e similares)
export const ADVANCED_APIS: ApiConfig[] = [
  {
    name: 'Instagram Comments API Pro',
    host: 'instagram-comments-api.p.rapidapi.com',
    endpoint: (postId: string) => `/comments/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Premium - Usado por sites de sorteio',
    features: ['✅ API PROFISSIONAL', 'Comentários completos', 'Dados em tempo real', 'Anti-detecção avançado']
  },
  {
    name: 'Social Media API Premium',
    host: 'social-media-api-premium.p.rapidapi.com',
    endpoint: (postId: string) => `/instagram/post/${postId}/comments`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Premium',
    features: ['✅ USADO EM SORTEIOS', 'Bypass CloudFlare', 'Rate limit alto', 'Proxies residenciais']
  },
  {
    name: 'Instagram Scraper Professional',
    host: 'instagram-scraper-professional.p.rapidapi.com',
    endpoint: (postId: string) => `/media/${postId}/comments`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Professional',
    features: ['✅ GRADE EMPRESARIAL', 'Scraping em massa', 'Dados estruturados', 'SLA 99.9%']
  },
  {
    name: 'RapidAPI Instagram Pro',
    host: 'instagram-data-professional.p.rapidapi.com',
    endpoint: (postId: string) => `/v1/posts/${postId}/comments`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Enterprise',
    features: ['✅ ENTERPRISE GRADE', 'API oficial', 'Suporte 24/7', 'Documentação completa']
  }
];

// Configurações avançadas de scraping (baseadas na Simpliers)
export const SCRAPING_CONFIG = {
  // Headers que simulam navegador real
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ],
  
  // Headers adicionais para bypass de detecção
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Upgrade-Insecure-Requests': '1'
  },
  
  // Timeouts e retry configs
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 2000
};
