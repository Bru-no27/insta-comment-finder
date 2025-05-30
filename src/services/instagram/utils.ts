
import { PRIMARY_API, BACKUP_APIS } from './config';
import type { ApiStatus } from './types';

// Função para extrair ID da publicação do URL
export const extractPostId = (url: string): string | null => {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/, // Posts normais
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/, // Reels
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/, // IGTV
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

// Status da configuração das APIs
export const getApiStatus = (): ApiStatus => {
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  const isKeyConfigured = Boolean(rapidApiKey && rapidApiKey.trim() !== '');
  
  const allApis = [PRIMARY_API, ...BACKUP_APIS];
  const configuredApis = allApis.filter(api => 
    isKeyConfigured && api.active
  );
  
  return {
    totalApis: allApis.length,
    configuredApis: configuredApis.length,
    isConfigured: isKeyConfigured,
    availableApis: allApis.map(api => ({
      name: api.name,
      price: api.price,
      features: api.features,
      isConfigured: isKeyConfigured && api.active
    }))
  };
};

// Função para formatar timestamp
export const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) {
    const now = new Date();
    const randomHours = Math.floor(Math.random() * 72);
    const commentTime = new Date(now.getTime() - (randomHours * 60 * 60 * 1000));
    const diffHours = Math.floor((now.getTime() - commentTime.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'agora';
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return diffDays < 30 ? `${diffDays}d` : `${Math.floor(diffDays / 30)}mês`;
  }
  
  try {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'agora';
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d`;
    
    return `${Math.floor(diffDays / 30)}mês`;
  } catch {
    return 'recente';
  }
};
