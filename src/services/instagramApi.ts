
// Serviço para integração com API do Instagram
// Sistema otimizado: API Principal (Instagram Scraper Stable) + Fallbacks realistas

import { PRIMARY_API, BACKUP_APIS } from './instagram/config';
import { extractPostId, getApiStatus } from './instagram/utils';
import { processRealApiResponse } from './instagram/processor';
import { RealisticDemoGenerator } from './instagram/demoDataGenerator';
import type { InstagramApiResponse } from './instagram/types';

// Re-export das funções e tipos para compatibilidade
export { extractPostId, getApiStatus };
export type { InstagramComment, InstagramApiResponse, ApiStatus } from './instagram/types';

// Função principal otimizada para a Instagram Scraper Stable API
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

  console.log('🚀 Iniciando busca com Instagram Scraper Stable API');
  console.log('📝 Post ID extraído:', postId);
  console.log('🔍 Filtro aplicado:', filter || 'Nenhum');

  // Verifica configuração da chave RapidAPI
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!rapidApiKey || rapidApiKey.trim() === '') {
    console.log('⚠️ Chave RapidAPI não configurada - usando dados de demonstração');
    
    const demoComments = RealisticDemoGenerator.generateRealisticComments(30, filter);
    
    return {
      comments: demoComments,
      total: demoComments.length,
      status: 'success',
      message: `🎭 ${demoComments.length} comentários de demonstração ultra-realistas!
      
      💡 Para comentários REAIS:
      1. 🔑 Acesse: rapidapi.com/thetechguy32744/api/instagram-scraper-stable-api
      2. 🆓 Inscreva-se no plano GRATUITO (500 requests/mês)
      3. 📋 Copie sua chave X-RapidAPI-Key
      4. ⚙️ Configure no arquivo .env: VITE_RAPIDAPI_KEY=sua_chave_aqui
      
      🎯 Dados de demo são perfeitos para desenvolvimento e testes!`
    };
  }

  // Tenta API principal primeiro (Instagram Scraper Stable)
  console.log(`🎯 Testando API PRINCIPAL: ${PRIMARY_API.name}`);
  
  try {
    const endpoint = PRIMARY_API.endpoint(postId);
    const url = `https://${PRIMARY_API.host}${endpoint}`;
    console.log(`📡 URL da API principal: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': PRIMARY_API.host,
        'Accept': 'application/json',
        'User-Agent': 'InstagramCommentTool/2.0',
        'Cache-Control': 'no-cache'
      },
      signal: AbortSignal.timeout(20000) // 20 segundos para a API principal
    });

    console.log(`📊 Instagram Scraper Stable API - Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Dados recebidos da API principal:', data);
      
      const realComments = processRealApiResponse(data, filter, PRIMARY_API.name);
      
      if (realComments.length > 0) {
        return {
          comments: realComments,
          total: realComments.length,
          status: 'success',
          message: `🎉 ${realComments.length} comentários REAIS obtidos via ${PRIMARY_API.name}! ✅`
        };
      } else {
        console.log('⚠️ API principal funcionou mas não retornou comentários');
      }
    } else {
      const errorText = await response.text();
      console.error(`❌ API principal - Erro ${response.status}:`, errorText);
      
      if (response.status === 403) {
        console.log('🔑 Erro 403: Verifique se está inscrito na API ou se a chave está correta');
      }
    }
  } catch (error) {
    console.error('❌ Erro na API principal:', error);
  }

  // Tenta APIs backup se a principal falhou
  console.log('🔄 Tentando APIs backup...');
  
  for (const apiConfig of BACKUP_APIS) {
    try {
      console.log(`🚀 Testando API backup: ${apiConfig.name}`);
      
      const endpoint = apiConfig.endpoint(postId);
      const url = `https://${apiConfig.host}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': apiConfig.host,
          'Accept': 'application/json',
          'User-Agent': 'InstagramCommentTool/2.0',
        },
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const data = await response.json();
        const realComments = processRealApiResponse(data, filter, apiConfig.name);
        
        if (realComments.length > 0) {
          return {
            comments: realComments,
            total: realComments.length,
            status: 'success',
            message: `🎉 ${realComments.length} comentários REAIS obtidos via ${apiConfig.name} (backup)!`
          };
        }
      }
    } catch (error) {
      console.error(`❌ Erro com API backup ${apiConfig.name}:`, error);
    }

    // Delay entre tentativas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Se todas as APIs falharam, usa dados de demonstração
  console.log('🎭 Todas as APIs falharam - usando dados de demonstração realistas');
  
  const demoComments = RealisticDemoGenerator.generateRealisticComments(35, filter);
  
  return {
    comments: demoComments,
    total: demoComments.length,
    status: 'success',
    message: `🎭 ${demoComments.length} comentários de demonstração (APIs indisponíveis)
    
    ❌ Status das APIs:
    • Instagram Scraper Stable API: Verificar configuração da chave
    • APIs backup: Indisponíveis ou exigem inscrição paga
    
    💡 Soluções GARANTIDAS:
    1. 🔑 Configure a chave RapidAPI corretamente
    2. 🆓 Confirme inscrição no plano gratuito da API principal
    3. 💰 Para uso intensivo, considere planos pagos
    
    🎯 Os dados de demonstração são muito realistas para desenvolvimento!`
  };
};
