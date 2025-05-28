
import type { ApiConfig } from './types';

export const PREMIUM_APIS: ApiConfig[] = [
  {
    name: 'Instagram Scraper Stable API',
    host: 'instagram-scraper-stable-api.p.rapidapi.com',
    endpoint: (postId: string) => `/get_post_by_shortcode/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium - Plano Gratuito',
    features: ['✅ API VERIFICADA 2024', 'Plano gratuito disponível', 'Comentários reais', 'Endpoint estável']
  },
  {
    name: 'Instagram Bulk Profile Scrapper',
    host: 'instagram-bulk-profile-scrapper.p.rapidapi.com',
    endpoint: (postId: string) => `/media_info/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium',
    features: ['✅ API ATIVA', 'Scraper em massa', 'Dados completos', 'Comentários inclusos']
  },
  {
    name: 'Instagram Media Downloader',
    host: 'instagram-media-downloader.p.rapidapi.com',
    endpoint: (postId: string) => `/media/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium',
    features: ['✅ API FUNCIONAL', 'Download de mídia', 'Metadados inclusos', 'Comentários disponíveis']
  },
  {
    name: 'Social Media Scraper API',
    host: 'social-media-scraper-api.p.rapidapi.com',
    endpoint: (postId: string) => `/instagram/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium',
    features: ['✅ MULTIMÍDIA', 'Instagram + outros', 'Dados estruturados', 'Suporte a comentários']
  }
];
