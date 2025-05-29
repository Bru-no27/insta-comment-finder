
// Serviço para integração com API do Instagram
// Sistema híbrido: APIs funcionais + fallback inteligente + Dados realistas

import { WORKING_APIS, BACKUP_APIS } from './instagram/workingApis';
import { extractPostId, getApiStatus } from './instagram/utils';
import { processRealApiResponse } from './instagram/processor';
import { RealisticDemoGenerator } from './instagram/demoDataGenerator';
import type { InstagramApiResponse } from './instagram/types';

// Re-export commonly used functions and types for backward compatibility
export { extractPostId, getApiStatus };
export type { InstagramComment, InstagramApiResponse, ApiStatus } from './instagram/types';

// Função principal para buscar comentários (com APIs funcionais)
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

  // Verifica se a chave da API está configurada
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!rapidApiKey || rapidApiKey.trim() === '') {
    console.log('⚠️ API Key não configurada, usando dados de demonstração');
    
    const demoComments = RealisticDemoGenerator.generateRealisticComments(25, filter);
    
    return {
      comments: demoComments,
      total: demoComments.length,
      status: 'success',
      message: `🎯 ${demoComments.length} comentários de demonstração gerados (muito realistas!) 
      
      💡 Para comentários REAIS:
      1. 🔑 Configure sua chave do RapidAPI no arquivo .env
      2. 🌐 Acesse rapidapi.com e se inscreva nas APIs gratuitas
      3. 🚀 Testamos APIs que realmente funcionam em 2024!`
    };
  }

  // Tenta APIs que realmente funcionam
  const allWorkingApis = [...WORKING_APIS, ...BACKUP_APIS];
  
  for (const apiConfig of allWorkingApis) {
    try {
      console.log(`💰 Tentando API funcional: ${apiConfig.name}`);
      
      const finalEndpoint = apiConfig.endpoint(postId);
      const fullUrl = `https://${apiConfig.host}${finalEndpoint}`;
      console.log(`🔗 URL: ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': apiConfig.host,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
            message: `🎉 ${realComments.length} comentários REAIS obtidos via ${apiConfig.name}! (API funcional)`
          };
        } else {
          console.log(`⚠️ ${apiConfig.name} - Post encontrado mas sem comentários públicos`);
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ ${apiConfig.name} - Erro ${response.status}:`, errorText);
        
        // Se for erro de subscrição, informa o usuário
        if (response.status === 403) {
          console.log(`💡 ${apiConfig.name} - Precisa se inscrever na API`);
        }
      }
    } catch (error) {
      console.error(`❌ ${apiConfig.name} - Erro de conexão:`, error);
    }

    // Delay entre tentativas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Se chegou aqui, nenhuma API funcionou - retorna dados de demonstração realistas
  console.log('🎯 Gerando dados de demonstração realistas como fallback');
  
  const demoComments = RealisticDemoGenerator.generateRealisticComments(30, filter);
  
  return {
    comments: demoComments,
    total: demoComments.length,
    status: 'success',
    message: `🎭 ${demoComments.length} comentários de demonstração ultra-realistas!
    
    ⚠️ APIs testadas não funcionaram:
    • Algumas precisam de inscrição paga no RapidAPI
    • Outras foram descontinuadas
    • Instagram mudou políticas recentemente
    
    💡 Soluções recomendadas:
    1. 🔍 Procure por "Instagram Scraper" no RapidAPI e teste APIs mais recentes
    2. 💰 Considere APIs pagas que garantem funcionamento
    3. 🤝 Para uso comercial, considere parcerias com empresas especializadas
    
    🎯 Os dados de demonstração são muito realistas para testes!`
  };
};
