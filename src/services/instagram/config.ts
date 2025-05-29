
import type { ApiConfig } from './types';

// Configuração das APIs mais promissoras para 2024
export const PREMIUM_APIS: ApiConfig[] = [
  {
    name: 'Instagram Scraper Stable API ⭐',
    host: 'instagram-scraper-stable-api.p.rapidapi.com',
    endpoint: (postId: string) => `/media/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium - 500 requests/mês grátis',
    features: [
      '✅ MAIS ESTÁVEL 2024', 
      'Endpoints testados', 
      'Comentários completos', 
      'Plano gratuito robusto',
      'Documentação atualizada'
    ]
  },
  {
    name: 'Social Media Scraper Pro',
    host: 'social-media-scraper-api.p.rapidapi.com',
    endpoint: (postId: string) => `/instagram/post/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Premium - $9.99/mês',
    features: [
      '✅ USADO POR EMPRESAS', 
      'Rate limit alto', 
      'Suporte técnico', 
      'SLA garantido',
      'APIs sempre atualizadas'
    ]
  }
];

// URLs úteis para o usuário encontrar APIs funcionais
export const USEFUL_LINKS = {
  rapidApiSearch: 'https://rapidapi.com/search/instagram%20scraper',
  instagramScraperStable: 'https://rapidapi.com/stable-api/api/instagram-scraper-stable-api',
  socialMediaScraper: 'https://rapidapi.com/social-media-api/api/social-media-scraper-api',
  instagramBasicDisplay: 'https://rapidapi.com/meta/api/instagram-basic-display'
};
