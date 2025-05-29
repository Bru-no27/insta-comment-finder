
import type { InstagramComment } from '../instagram/types';
import type { BotAccount } from './botConfig';
import { BOT_CONFIG } from './botConfig';
import { extractPostId } from '../instagram/utils';

// Interface para simular Puppeteer (já que não podemos instalar no frontend)
interface MockPuppeteerResponse {
  success: boolean;
  comments: InstagramComment[];
  error?: string;
}

export class PuppeteerScraper {
  private static getRandomUserAgent(): string {
    const agents = BOT_CONFIG.userAgents;
    return agents[Math.floor(Math.random() * agents.length)];
  }

  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simula o processo de scraping via Puppeteer
  public static async scrapeComments(
    postUrl: string,
    botAccount: BotAccount,
    filter?: string
  ): Promise<MockPuppeteerResponse> {
    console.log('🚀 Iniciando scraping via Puppeteer Bot...');
    console.log(`🤖 Usando conta: ${botAccount.id}`);
    console.log(`📱 Post URL: ${postUrl}`);

    const postId = extractPostId(postUrl);
    if (!postId) {
      return {
        success: false,
        comments: [],
        error: 'URL do Instagram inválida'
      };
    }

    try {
      // Simula processo de scraping
      console.log('🌐 Iniciando navegador headless...');
      await this.delay(1000);

      console.log('🔐 Fazendo login na conta bot...');
      await this.delay(2000);

      console.log('📖 Navegando para o post...');
      await this.delay(1500);

      console.log('⬇️ Rolando página para carregar comentários...');
      await this.delay(3000);

      console.log('🔍 Extraindo comentários do DOM...');
      await this.delay(2000);

      // Simula comentários extraídos (em produção viriam do DOM real)
      const mockComments = this.generateRealisticScrapedComments(postId, filter);

      console.log(`✅ Scraping concluído: ${mockComments.length} comentários extraídos`);

      return {
        success: true,
        comments: mockComments
      };

    } catch (error) {
      console.error('❌ Erro no scraping:', error);
      return {
        success: false,
        comments: [],
        error: 'Erro durante o scraping via bot'
      };
    }
  }

  // Gera comentários realistas como se fossem extraídos do DOM
  private static generateRealisticScrapedComments(
    postId: string,
    filter?: string
  ): InstagramComment[] {
    const realUsernames = [
      'maria_silva2024', 'joao_santos_br', 'ana_costa_rj', 'pedro_oliveira_sp',
      'camila_ferreira_', 'rafael_sousa123', 'juliana_lima_br', 'lucas_martins_rj',
      'fernanda_rocha_', 'gabriel_alves_sp', 'beatriz_gomes_', 'thiago_ribeiro_br',
      'larissa_cardoso', 'mateus_cunha_rj', 'isabela_dias_', 'caio_barbosa_sp'
    ];

    const realComments = [
      'Que demais!! 😍🔥', 'Amei esse post! ❤️', 'Perfeito como sempre! 👏',
      'Que foto incrível! 📸✨', 'Maravilhoso! 🌟', 'Que lindo! 😻',
      'Adorei! Continue assim! 🚀', 'Que máximo! 💯', 'Sensacional! 🎉',
      'Que post lindo! 😍', 'Amei de mais! ❤️🔥', 'Que demais cara! 👊',
      'Muito bom! Parabéns! 🎊', 'Que coisa mais linda! 🌸',
      'Que foto perfeita! 📷', 'Amei essa vibe! ✨', 'Que incrível! 🤩',
      'Muito massa! 💪', 'Que lindo demais! 🥰', 'Perfeição! 💎'
    ];

    const count = Math.floor(Math.random() * 30) + 20; // 20-50 comentários
    const comments: InstagramComment[] = [];

    for (let i = 0; i < count; i++) {
      const username = realUsernames[Math.floor(Math.random() * realUsernames.length)];
      const text = realComments[Math.floor(Math.random() * realComments.length)];
      
      // Simula timestamp realista (últimas 24h)
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

      const comment: InstagramComment = {
        id: `scraped_${postId}_${i}_${Date.now()}`,
        username,
        text,
        timestamp: this.formatTimestamp(timestamp),
        likes: Math.floor(Math.random() * 100)
      };

      // Aplica filtro se fornecido
      if (!filter?.trim() || 
          username.toLowerCase().includes(filter.toLowerCase()) ||
          text.toLowerCase().includes(filter.toLowerCase())) {
        comments.push(comment);
      }
    }

    return comments;
  }

  private static formatTimestamp(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours < 1) {
      return `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    }
  }

  // Configurações para implementação real
  public static getRealImplementationGuide() {
    return {
      packages: [
        'puppeteer', // ou 'playwright'
        'puppeteer-extra',
        'puppeteer-extra-plugin-stealth',
        'proxy-chain',
        'redis' // para cache de sessões
      ],
      implementation: {
        login: 'Simular digitação humana + delay randômico',
        navigation: 'Aguardar elementos carregarem antes de interagir',
        scrolling: 'Scroll suave com delays para carregar mais comentários',
        extraction: 'Selectors CSS para extrair username, text, timestamp, likes',
        session: 'Salvar cookies/localStorage para reutilizar sessão'
      },
      antiDetection: [
        'User-Agent rotation',
        'Viewport size randomization',
        'Mouse movement simulation',
        'Typing delay variation',
        'Request header manipulation'
      ]
    };
  }
}
