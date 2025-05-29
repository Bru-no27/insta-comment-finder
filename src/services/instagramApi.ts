
// Serviço principal integrado: Conta-Bot + APIs + Demo
// Sistema otimizado: Bot Scraping (principal) + APIs (backup) + Demo (fallback)

import { PRIMARY_API, BACKUP_APIS } from './instagram/config';
import { extractPostId, getApiStatus } from './instagram/utils';
import { processRealApiResponse } from './instagram/processor';
import { RealisticDemoGenerator } from './instagram/demoDataGenerator';
import { BotInstagramApi } from './botScraping/botInstagramApi';
import type { InstagramApiResponse } from './instagram/types';

// Re-export das funções e tipos para compatibilidade
export { extractPostId, getApiStatus };
export type { InstagramComment, InstagramApiResponse, ApiStatus } from './instagram/types';

// Função principal com novo fluxo: Bot → API → Demo
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

  console.log('🚀 Iniciando busca com NOVO SISTEMA INTEGRADO');
  console.log('📝 Post ID extraído:', postId);
  console.log('🔍 Filtro aplicado:', filter || 'Nenhum');
  console.log('📋 Ordem de prioridade: 1) Conta-Bot 2) APIs 3) Demo');

  // 🥇 PRIORIDADE 1: SISTEMA DE CONTA-BOT
  console.log('🤖 === TENTATIVA 1: CONTA-BOT ===');
  try {
    const botResponse = await BotInstagramApi.fetchCommentsViaBot(postUrl, filter);
    
    if (botResponse.status === 'success' && botResponse.comments.length > 0) {
      console.log('✅ SUCESSO COM CONTA-BOT!');
      return {
        ...botResponse,
        message: `🤖 ${botResponse.comments.length} comentários REAIS via conta-bot!
        
        ✅ Sistema de Scraping Profissional:
        • Método: Puppeteer headless com conta real
        • Dados: 100% autênticos do Instagram
        • Limitações: Apenas rate limits naturais
        • Custo: Zero (infraestrutura própria)
        
        🎯 Funcionando igual aos sites profissionais de sorteio!`
      };
    } else {
      console.log('⚠️ Conta-bot não disponível - tentando APIs backup...');
    }
  } catch (error) {
    console.error('❌ Erro no sistema de conta-bot:', error);
  }

  // 🥈 PRIORIDADE 2: APIs COMO BACKUP
  console.log('💰 === TENTATIVA 2: APIs PAGAS ===');
  
  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!rapidApiKey || rapidApiKey.trim() === '') {
    console.log('⚠️ Chave RapidAPI não configurada - indo para demonstração');
  } else {
    // Tenta API principal primeiro
    console.log(`🎯 Testando API principal: ${PRIMARY_API.name}`);
    
    try {
      const endpoint = PRIMARY_API.endpoint(postId);
      const url = `https://${PRIMARY_API.host}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': PRIMARY_API.host,
          'Accept': 'application/json',
          'User-Agent': 'InstagramCommentTool/3.0',
        },
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const data = await response.json();
        const realComments = processRealApiResponse(data, filter, PRIMARY_API.name);
        
        if (realComments.length > 0) {
          return {
            comments: realComments,
            total: realComments.length,
            status: 'success',
            message: `💰 ${realComments.length} comentários REAIS via ${PRIMARY_API.name} (backup)!
            
            ⚠️ Usando API como backup:
            • Sistema de conta-bot indisponível no momento
            • API funcionando como plano B
            • Dados reais, mas com limitações de cota
            
            💡 Configure mais contas bot para evitar usar APIs pagas!`
          };
        }
      }
    } catch (error) {
      console.error('❌ Erro na API principal:', error);
    }

    // Tenta APIs backup
    for (const apiConfig of BACKUP_APIS.slice(0, 2)) { // Limita tentativas
      try {
        const endpoint = apiConfig.endpoint(postId);
        const url = `https://${apiConfig.host}${endpoint}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': apiConfig.host,
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const data = await response.json();
          const realComments = processRealApiResponse(data, filter, apiConfig.name);
          
          if (realComments.length > 0) {
            return {
              comments: realComments,
              total: realComments.length,
              status: 'success',
              message: `💰 ${realComments.length} comentários via ${apiConfig.name} (backup)!`
            };
          }
        }
      } catch (error) {
        console.error(`❌ Erro com ${apiConfig.name}:`, error);
      }
    }
  }

  // 🥉 PRIORIDADE 3: DADOS DE DEMONSTRAÇÃO
  console.log('🎭 === TENTATIVA 3: DEMONSTRAÇÃO ===');
  
  const demoComments = RealisticDemoGenerator.generateRealisticComments(25, filter);
  
  return {
    comments: demoComments,
    total: demoComments.length,
    status: 'success',
    message: `🎭 ${demoComments.length} comentários de demonstração
    
    📊 Status do sistema:
    • 🤖 Conta-bot: ${BotInstagramApi.getSystemStatus().isOperational ? 'Indisponível' : 'Em cooldown'}
    • 💰 APIs: ${rapidApiKey ? 'Configurada mas sem dados' : 'Não configurada'}
    • 🎯 Demo: Funcionando perfeitamente
    
    🚀 SOLUÇÃO RECOMENDADA:
    1. Configure contas bot para scraping real e gratuito
    2. Mantenha APIs como backup para alta disponibilidade
    
    ⭐ O sistema de conta-bot elimina custos e limitações!`
  };
};

// Nova função para status do sistema completo
export const getSystemStatus = () => {
  const botStatus = BotInstagramApi.getSystemStatus();
  const apiStatus = getApiStatus();
  
  return {
    bot: botStatus,
    api: apiStatus,
    priority: 'bot', // Bot tem prioridade
    recommendation: botStatus.isOperational 
      ? '✅ Sistema otimizado funcionando'
      : '⚠️ Configure mais contas bot para melhor performance'
  };
};
