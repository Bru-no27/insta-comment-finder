
// Serviço para integração com API do Instagram
// Sistema híbrido: APIs pagas + fallback inteligente

import { PREMIUM_APIS } from './instagram/config';
import { extractPostId, getApiStatus } from './instagram/utils';
import { processRealApiResponse } from './instagram/processor';
import type { InstagramApiResponse } from './instagram/types';

// Re-export commonly used functions and types for backward compatibility
export { extractPostId, getApiStatus };
export type { InstagramComment, InstagramApiResponse, ApiStatus } from './instagram/types';

// Função principal para buscar comentários
export const fetchInstagramComments = async (
  postUrl: string,
  filter?: string
): Promise<InstagramApiResponse> => {
  const postId = extractPostId(postUrl);
  
  if (!postId) {
    return {
      comments: [],
      total: 0,
      status: 'error',
      message: 'URL do Instagram inválida'
    };
  }

  console.log('🔍 Buscando comentários REAIS para Post ID:', postId);
  console.log('🔍 Filtro aplicado:', filter);

  // Verifica status das APIs
  const apiStatus = getApiStatus();
  console.log('📊 Status das APIs:', apiStatus);

  // Verifica se a chave da API está configurada
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!rapidApiKey || rapidApiKey.trim() === '') {
    return {
      comments: [],
      total: 0,
      status: 'error',
      message: `❌ Chave do RapidAPI não configurada. 
      
      Para usar comentários reais:
      1. 🔑 Configure a variável de ambiente VITE_RAPIDAPI_KEY
      2. 📝 Adicione sua chave do RapidAPI no arquivo .env
      3. 🔄 Reinicie o servidor de desenvolvimento
      
      👉 Acesse rapidapi.com para obter sua chave gratuita!`
    };
  }

  // Tenta APIs REAIS (verificadas e funcionais)
  for (const apiConfig of PREMIUM_APIS) {
    if (!apiConfig.active || !rapidApiKey) {
      console.log(`⏭️ ${apiConfig.name} não configurada`);
      continue;
    }

    try {
      console.log(`💰 Tentando API REAL: ${apiConfig.name}`);
      
      const finalEndpoint = apiConfig.endpoint(postId);
      const fullUrl = `https://${apiConfig.host}${finalEndpoint}`;
      console.log(`🔗 URL completa: ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': apiConfig.host,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      console.log(`📡 ${apiConfig.name} - Status: ${response.status}`);
      console.log(`📡 ${apiConfig.name} - Headers:`, response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${apiConfig.name} - Dados REAIS recebidos:`, data);
        
        const realComments = processRealApiResponse(data, filter, apiConfig.name);
        
        if (realComments.length > 0) {
          return {
            comments: realComments,
            total: realComments.length,
            status: 'success',
            message: `✅ ${realComments.length} comentários REAIS obtidos via ${apiConfig.name} 🎉`
          };
        } else {
          console.log(`⚠️ ${apiConfig.name} - Post encontrado mas sem comentários ou comentários privados`);
          
          // Se encontrou o post mas sem comentários, retorna mensagem específica
          if (data.media || data.post || data.data) {
            return {
              comments: [],
              total: 0,
              status: 'success',
              message: `📱 Post encontrado via ${apiConfig.name}, mas não há comentários públicos ou comentários estão desabilitados`
            };
          }
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ ${apiConfig.name} - Erro ${response.status}:`, errorText);
        
        // Se é erro 403, explica sobre subscrição
        if (response.status === 403) {
          console.log(`🔐 ${apiConfig.name} - Necessário se inscrever na API`);
        }
      }
    } catch (error) {
      console.error(`❌ ${apiConfig.name} - Erro de conexão:`, error);
    }

    // Aguarda 1.5 segundos entre tentativas para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Se chegou aqui, nenhuma API funcionou
  return {
    comments: [],
    total: 0,
    status: 'error',
    message: `❌ Não foi possível obter comentários reais. Possíveis causas:
    
    1. 🔐 Você precisa se INSCREVER nas APIs do RapidAPI (muitas têm plano gratuito!)
    2. 🔒 A publicação pode ter comentários desabilitados
    3. 🔒 A publicação pode ser privada
    4. 🚫 A publicação pode não existir
    
    👉 Acesse rapidapi.com e se inscreva em uma das APIs listadas para comentários reais!`
  };
};
