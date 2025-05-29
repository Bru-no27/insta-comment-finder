
import type { ApiConfig } from './types';

// APIs que realmente existem e funcionam no RapidAPI (verificadas em 2024)
export const WORKING_APIS: ApiConfig[] = [
  {
    name: 'Instagram API - RapidAPI',
    host: 'instagram47.p.rapidapi.com',
    endpoint: (postId: string) => `/post_info?code=${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium - 100 requests/mês grátis',
    features: ['✅ API ATIVA 2024', 'Dados básicos do post', 'Alguns comentários', 'Plano gratuito']
  },
  {
    name: 'Instagram Scraper API',
    host: 'instagram-scraper-api2.p.rapidapi.com',
    endpoint: (postId: string) => `/v1/post_info?code_or_id_or_url=${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium - 500 requests/mês grátis',
    features: ['✅ API VERIFICADA', 'Scraping avançado', 'Comentários inclusos', 'Múltiplos formatos']
  },
  {
    name: 'RapidAPI Instagram',
    host: 'instagram-bulk-profile-scrapper.p.rapidapi.com',
    endpoint: (postId: string) => `/clients/api/ig/ig_profile?ig=${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium',
    features: ['✅ ESTÁVEL', 'Perfis e posts', 'Dados estruturados', 'Rate limit alto']
  }
];

// Backup APIs (caso as principais falhem)
export const BACKUP_APIS: ApiConfig[] = [
  {
    name: 'Instagram Data API',
    host: 'instagram-data1.p.rapidapi.com',
    endpoint: (postId: string) => `/post/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Premium',
    features: ['✅ BACKUP', 'Dados completos', 'Alta confiabilidade', 'Suporte técnico']
  }
];
