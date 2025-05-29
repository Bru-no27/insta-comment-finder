
import type { InstagramApiResponse } from '../instagram/types';
import { BotPoolManager } from './botPoolManager';
import { PuppeteerScraper } from './puppeteerScraper';
import { extractPostId } from '../instagram/utils';

export class BotInstagramApi {
  private static botManager = BotPoolManager.getInstance();

  public static async fetchCommentsViaBot(
    postUrl: string,
    filter?: string
  ): Promise<InstagramApiResponse> {
    console.log('🤖 Iniciando busca via sistema de conta-bot...');
    
    const postId = extractPostId(postUrl);
    if (!postId) {
      return {
        comments: [],
        total: 0,
        status: 'error',
        message: 'URL do Instagram inválida'
      };
    }

    // Verifica status do pool de bots
    const poolStatus = this.botManager.getPoolStatus();
    console.log(`📊 Status do pool: ${poolStatus.available}/${poolStatus.total} bots disponíveis`);

    if (poolStatus.available === 0) {
      return {
        comments: [],
        total: 0,
        status: 'error',
        message: `❌ Nenhuma conta bot disponível no momento.
        
        📊 Status atual:
        • Total de contas: ${poolStatus.total}
        • Ativas: ${poolStatus.active}
        • Em cooldown: ${poolStatus.inCooldown}
        
        ⏱️ Aguarde alguns minutos para as contas saírem do cooldown.`
      };
    }

    // Seleciona bot disponível
    const selectedBot = this.botManager.getAvailableBot();
    if (!selectedBot) {
      return {
        comments: [],
        total: 0,
        status: 'error',
        message: 'Erro interno: não foi possível selecionar conta bot'
      };
    }

    try {
      // Executa scraping via Puppeteer
      const scrapingResult = await PuppeteerScraper.scrapeComments(
        postUrl,
        selectedBot,
        filter
      );

      if (scrapingResult.success) {
        // Marca bot como bem-sucedido
        this.botManager.markBotSuccess(selectedBot.id);

        return {
          comments: scrapingResult.comments,
          total: scrapingResult.comments.length,
          status: 'success',
          message: `🤖 ${scrapingResult.comments.length} comentários REAIS extraídos via conta-bot ${selectedBot.id}!
          
          ✅ Scraping bem-sucedido:
          • Conta bot: ${selectedBot.id}
          • Método: Puppeteer headless
          • Dados: 100% reais do Instagram
          • Limitações: Nenhuma (exceto rate limits naturais)
          
          🎯 Sistema funcionando perfeitamente!`
        };
      } else {
        // Marca bot como com falha
        this.botManager.markBotFailed(selectedBot.id);

        return {
          comments: [],
          total: 0,
          status: 'error',
          message: `❌ Falha no scraping com conta ${selectedBot.id}: ${scrapingResult.error}`
        };
      }

    } catch (error) {
      console.error('❌ Erro no sistema de bot:', error);
      this.botManager.markBotFailed(selectedBot.id);

      return {
        comments: [],
        total: 0,
        status: 'error',
        message: `❌ Erro interno no sistema de conta-bot: ${error}`
      };
    }
  }

  // Status detalhado do sistema
  public static getSystemStatus() {
    const poolStatus = this.botManager.getPoolStatus();
    
    return {
      isOperational: poolStatus.available > 0,
      poolStatus,
      message: poolStatus.available > 0 
        ? `✅ Sistema operacional com ${poolStatus.available} bot(s) disponível(is)`
        : `⚠️ Sistema em cooldown - aguarde ${Math.ceil(5)} minutos`,
      recommendations: [
        poolStatus.total < 3 ? '⚠️ Recomendado ter pelo menos 3 contas bot' : '✅ Pool de contas adequado',
        poolStatus.active < poolStatus.total ? '⚠️ Algumas contas inativas - verificar configuração' : '✅ Todas as contas ativas'
      ]
    };
  }
}
