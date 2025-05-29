
import type { ApiConfig } from './types';

// API PRINCIPAL RECOMENDADA - Instagram Scraper Stable API (GRATUITA)
export const PRIMARY_API: ApiConfig = {
  name: 'Instagram Scraper Stable API ⭐ RECOMENDADA',
  host: 'instagram-scraper-stable-api.p.rapidapi.com',
  endpoint: (postId: string) => `/media/${postId}`,
  key: import.meta.env.VITE_RAPIDAPI_KEY || '',
  active: true,
  price: '🆓 GRATUITO - 500 requests/mês',
  features: [
    '✅ MAIS ESTÁVEL 2024', 
    '🆓 Plano gratuito robusto (500 req/mês)', 
    '📋 Comentários completos inclusos', 
    '🔧 Endpoints testados e funcionais',
    '📚 Documentação sempre atualizada',
    '🏢 Confiável para desenvolvimento'
  ]
};

// APIs alternativas (caso a principal falhe)
export const BACKUP_APIS: ApiConfig[] = [
  {
    name: 'Social Media Scraper Pro',
    host: 'social-media-scraper-api.p.rapidapi.com',
    endpoint: (postId: string) => `/instagram/post/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Premium - $9.99/mês (com trial)',
    features: [
      '💼 Usado por empresas', 
      '⚡ Rate limit alto', 
      '🛡️ SLA garantido',
      '📞 Suporte técnico 24/7'
    ]
  },
  {
    name: 'Instagram Bulk Profile Scrapper',
    host: 'instagram-bulk-profile-scrapper.p.rapidapi.com',
    endpoint: (postId: string) => `/instagram/comments/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium - 100 requests gratuitas',
    features: [
      '📊 Especializada em perfis', 
      '🎯 Boa para scraping em massa', 
      '🔄 Endpoints atualizados'
    ]
  }
];

// Todas as APIs disponíveis (principal + backups)
export const ALL_APIS = [PRIMARY_API, ...BACKUP_APIS];

// Links úteis para configuração
export const SETUP_LINKS = {
  primaryApi: 'https://rapidapi.com/thetechguy32744/api/instagram-scraper-stable-api',
  rapidApiSignup: 'https://rapidapi.com/auth/sign-up',
  socialMediaScraper: 'https://rapidapi.com/socialmediascraper/api/social-media-scraper-api',
  bulkScrapper: 'https://rapidapi.com/sunnyskies91254/api/instagram-bulk-profile-scrapper'
};

// Instruções de configuração passo a passo
export const SETUP_INSTRUCTIONS = {
  step1: '1. Acesse: rapidapi.com/thetechguy32744/api/instagram-scraper-stable-api',
  step2: '2. Clique em "Subscribe to Test" e escolha o plano GRATUITO',
  step3: '3. Copie sua chave X-RapidAPI-Key da seção "Headers"',
  step4: '4. Cole a chave no campo VITE_RAPIDAPI_KEY do arquivo .env',
  step5: '5. Teste com qualquer URL do Instagram!'
};
