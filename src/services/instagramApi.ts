
// Serviço para integração com API do Instagram
// Sistema híbrido: APIs pagas + fallback inteligente + Técnicas da Simpliers

import { PREMIUM_APIS } from './instagram/config';
import { ADVANCED_APIS } from './instagram/advancedConfig';
import { extractPostId, getApiStatus } from './instagram/utils';
import { processRealApiResponse } from './instagram/processor';
import { SimpliersInspiredScraper } from './instagram/simpliersTechniques';
import type { InstagramApiResponse } from './instagram/types';

// Re-export commonly used functions and types for backward compatibility
export { extractPostId, getApiStatus };
export type { InstagramComment, InstagramApiResponse, ApiStatus } from './instagram/types';

// Função principal para buscar comentários (com técnicas da Simpliers)
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

  console.log('🔍 Buscando comentários REAIS (técnicas da Simpliers) para Post ID:', postId);
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
      
      🎯 Para usar as mesmas técnicas de sites como Simpliers:
      1. 🔑 Configure a variável de ambiente VITE_RAPIDAPI_KEY
      2. 📝 Adicione sua chave do RapidAPI no arquivo .env
      3. 🔄 Reinicie o servidor de desenvolvimento
      4. 🚀 Acesse APIs profissionais como sites de sorteio usam
      
      👉 Acesse rapidapi.com para obter sua chave gratuita!`
    };
  }

  // 🚀 NOVA ABORDAGEM: Técnicas avançadas baseadas na Simpliers
  try {
    console.log('🎯 Tentando técnicas profissionais (baseadas na Simpliers)...');
    
    const advancedResult = await SimpliersInspiredScraper.fetchWithAdvancedTechniques(postId, filter);
    
    if (advancedResult.comments.length > 0) {
      return {
        comments: advancedResult.comments,
        total: advancedResult.comments.length,
        status: 'success',
        message: `🚀 SUCESSO! ${advancedResult.comments.length} comentários obtidos usando técnicas profissionais (baseadas em sites como Simpliers)`
      };
    }
  } catch (error) {
    console.error('❌ Erro nas técnicas avançadas:', error);
  }

  // Fallback para APIs básicas (sistema atual)
  console.log('📡 Tentando APIs básicas como fallback...');
  
  // Combina APIs básicas e avançadas
  const allApis = [...ADVANCED_APIS, ...PREMIUM_APIS];
  
  for (const apiConfig of allApis) {
    if (!apiConfig.active || !rapidApiKey) {
      console.log(`⏭️ ${apiConfig.name} não configurada`);
      continue;
    }

    try {
      console.log(`💰 Tentando API: ${apiConfig.name}`);
      
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

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${apiConfig.name} - Dados recebidos:`, data);
        
        const realComments = processRealApiResponse(data, filter, apiConfig.name);
        
        if (realComments.length > 0) {
          return {
            comments: realComments,
            total: realComments.length,
            status: 'success',
            message: `✅ ${realComments.length} comentários REAIS obtidos via ${apiConfig.name}`
          };
        } else {
          console.log(`⚠️ ${apiConfig.name} - Post encontrado mas sem comentários ou comentários privados`);
          
          if (data.media || data.post || data.data) {
            return {
              comments: [],
              total: 0,
              status: 'success',
              message: `📱 Post encontrado via ${apiConfig.name}, mas não há comentários públicos`
            };
          }
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ ${apiConfig.name} - Erro ${response.status}:`, errorText);
      }
    } catch (error) {
      console.error(`❌ ${apiConfig.name} - Erro de conexão:`, error);
    }

    // Delay entre tentativas
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Se chegou aqui, nenhuma API funcionou
  return {
    comments: [],
    total: 0,
    status: 'error',
    message: `❌ Não foi possível obter comentários reais usando técnicas profissionais.
    
    🎯 Para funcionar como sites de sorteio (Simpliers):
    1. 🔐 Você precisa se INSCREVER nas APIs profissionais do RapidAPI
    2. 💰 Muitas têm plano gratuito para começar
    3. 🚀 APIs empresariais têm taxa de sucesso muito maior
    
    👉 Sites como Simpliers usam APIs pagas para garantir acesso aos dados!`
  };
};
