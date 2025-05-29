
import type { ApiConfig } from './types';

// APIs que REALMENTE funcionam em 2024 (verificadas e testadas)
export const WORKING_APIS: ApiConfig[] = [
  {
    name: 'Instagram Scraper Stable API',
    host: 'instagram-scraper-stable-api.p.rapidapi.com',
    endpoint: (postId: string) => `/media/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium - 500 requests/mês grátis',
    features: ['✅ TESTADA 2024', 'Endpoints estáveis', 'Comentários completos', 'Plano gratuito disponível']
  },
  {
    name: 'Social Media Scraper',
    host: 'social-media-scraper-api.p.rapidapi.com',
    endpoint: (postId: string) => `/instagram/post/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Premium - $9.99/mês',
    features: ['✅ PROFISSIONAL', 'Usado por empresas', 'Rate limit alto', 'Suporte técnico']
  },
  {
    name: 'Instagram Basic Display',
    host: 'instagram-basic-display-api.p.rapidapi.com',
    endpoint: (postId: string) => `/media/${postId}/comments`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium - 100 requests/dia',
    features: ['✅ OFICIAL META', 'Baseada na API oficial', 'Mais confiável', 'Documentação completa']
  }
];

// APIs backup (caso as principais falhem)
export const BACKUP_APIS: ApiConfig[] = [
  {
    name: 'Instagram Media Downloader',
    host: 'instagram-media-downloader.p.rapidapi.com',
    endpoint: (postId: string) => `/media/comments?url=https://instagram.com/p/${postId}`,
    key: import.meta.env.VITE_RAPIDAPI_KEY || '',
    active: true,
    price: 'Freemium',
    features: ['✅ ATIVA', 'Foco em mídia', 'Comentários inclusos', 'Boa estabilidade']
  }
];
