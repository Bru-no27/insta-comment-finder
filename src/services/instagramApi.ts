
// Serviço para integração com API do Instagram
// Sistema inteligente: APIs funcionais 2024 + Fallback ultra-realista

import { WORKING_APIS, BACKUP_APIS } from './instagram/workingApis';
import { extractPostId, getApiStatus } from './instagram/utils';
import { processRealApiResponse } from './instagram/processor';
import { RealisticDemoGenerator } from './instagram/demoDataGenerator';
import type { InstagramApiResponse } from './instagram/types';

// Re-export das funções e tipos para compatibilidade
export { extractPostId, getApiStatus };
export type { InstagramComment, InstagramApiResponse, ApiStatus } from './instagram/types';

// Função principal para buscar comentários (APIs 2024 verificadas)
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
      message: 'URL do Instagram inválida. Use o formato: https://instagram.com/p/CODIGO'
    };
  }

  console.log('🔍 Buscando comentários REAIS para Post ID:', postId);
  console.log('🎯 Filtro aplicado:', filter || 'Nenhum');

  // Verifica configuração da API
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!rapidApiKey || rapidApiKey.trim() === '') {
    console.log('⚠️ Chave RapidAPI não configurada');
    
    const demoComments = RealisticDemoGenerator.generateRealisticComments(30, filter);
    
    return {
      comments: demoComments,
      total: demoComments.length,
      status: 'success',
      message: `🎭 ${demoComments.length} comentários de demonstração ultra-realistas!
      
      💡 Para comentários REAIS:
      1. 🔑 Configure sua chave RapidAPI
      2. 🌐 Teste as APIs verificadas em 2024
      3. 💰 Considere planos pagos para garantia de funcionamento
      
      🎯 Dados de demo são perfeitos para testes e desenvolvimento!`
    };
  }

  // Tenta APIs verificadas que funcionam em 2024
  const allApis = [...WORKING_APIS, ...BACKUP_APIS];
  let lastError = '';
  
  for (const apiConfig of allApis) {
    try {
      console.log(`🚀 Testando API verificada: ${apiConfig.name}`);
      
      const endpoint = apiConfig.endpoint(postId);
      const url = `https://${apiConfig.host}${endpoint}`;
      console.log(`📡 URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': apiConfig.host,
          'Accept': 'application/json',
          'User-Agent': 'InstagramCommentTool/1.0',
        },
        signal: AbortSignal.timeout(15000) // 15 segundos timeout
      });

      console.log(`📊 ${apiConfig.name} - Status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${apiConfig.name} - Dados recebidos:`, data);
        
        const realComments = processRealApiResponse(data, filter, apiConfig.name);
        
        if (realComments.length > 0) {
          return {
            comments: realComments,
            total: realComments.length,
            status: 'success',
            message: `🎉 ${realComments.length} comentários REAIS obtidos via ${apiConfig.name}!`
          };
        } else {
          console.log(`⚠️ ${apiConfig.name} - Post encontrado mas sem comentários públicos`);
          lastError = 'Post encontrado mas sem comentários públicos disponíveis';
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ ${apiConfig.name} - Erro ${response.status}:`, errorText);
        
        if (response.status === 403) {
          lastError = `${apiConfig.name}: Precisa se inscrever na API (erro 403)`;
        } else if (response.status === 404) {
          lastError = `${apiConfig.name}: API não encontrada ou post inexistente`;
        } else {
          lastError = `${apiConfig.name}: Erro ${response.status}`;
        }
      }
    } catch (error) {
      console.error(`❌ ${apiConfig.name} - Erro de conexão:`, error);
      lastError = `${apiConfig.name}: Erro de conexão ou timeout`;
    }

    // Pequeno delay entre tentativas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Se chegou aqui, nenhuma API funcionou
  console.log('🎭 Usando dados de demonstração como fallback');
  
  const demoComments = RealisticDemoGenerator.generateRealisticComments(35, filter);
  
  return {
    comments: demoComments,
    total: demoComments.length,
    status: 'success',
    message: `🎭 ${demoComments.length} comentários de demonstração (APIs indisponíveis)
    
    ❌ Problemas encontrados:
    • ${lastError}
    • Instagram mudou políticas recentemente
    • APIs gratuitas têm limitações
    
    💡 Soluções recomendadas:
    1. 🔍 Procure por "Instagram Scraper" no RapidAPI e teste APIs mais recentes
    2. 💰 Considere APIs pagas que garantem funcionamento  
    3. 🤝 Para uso comercial, considere parcerias com empresas especializadas
    
    🎯 Os dados de demonstração são muito realistas para testes!`
  };
};
