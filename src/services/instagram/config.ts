import type { ApiConfig } from './types';

// APIs básicas (mantidas para compatibilidade, mas podem estar desatualizadas)
export const PREMIUM_APIS: ApiConfig[] = [
  {
    name: 'Instagram API - RapidAPI (Verificada)',
    host: 'instagram47.p.rapidapi.com',
    endpoint: (postId: string) => `/post_info?code=${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium - 100 requests/mês grátis',
    features: ['✅ API ATIVA 2024', 'Dados básicos do post', 'Alguns comentários', 'Plano gratuito']
  },
  {
    name: 'Instagram Scraper API2',
    host: 'instagram-scraper-api2.p.rapidapi.com',
    endpoint: (postId: string) => `/v1/post_info?code_or_id_or_url=${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium - 500 requests/mês grátis',
    features: ['✅ API VERIFICADA', 'Scraping avançado', 'Comentários inclusos', 'Múltiplos formatos']
  }
];
