
// Serviço para testar scraping com uma única conta-bot
// Este é um mock que simula o comportamento real do backend

export interface SingleBotConfig {
  username: string;
  password: string;
  backendUrl: string; // URL do seu backend Node.js
}

export interface TestCommentResponse {
  status: 'success' | 'error';
  comments?: Array<{
    username: string;
    text: string;
    timestamp: string;
  }>;
  message?: string;
  debug?: {
    loginSuccess: boolean;
    pageLoaded: boolean;
    commentsFound: number;
  };
}

export class SingleBotTester {
  private config: SingleBotConfig;

  constructor(config: SingleBotConfig) {
    this.config = config;
  }

  // Testa o scraping com uma única conta
  async testScraping(postUrl: string): Promise<TestCommentResponse> {
    console.log('🤖 Iniciando teste de scraping com conta única...');
    console.log(`📱 Post URL: ${postUrl}`);
    console.log(`👤 Usuário: ${this.config.username}`);

    try {
      // Valida URL
      if (!this.isValidInstagramUrl(postUrl)) {
        return {
          status: 'error',
          message: 'URL do Instagram inválida'
        };
      }

      // Simula chamada para o backend real
      console.log('🔄 Conectando ao backend...');
      
      // Em produção, esta será uma chamada real para seu backend
      const response = await this.callBackendScraper(postUrl);
      
      return response;

    } catch (error) {
      console.error('❌ Erro no teste de scraping:', error);
      return {
        status: 'error',
        message: `Erro interno: ${error}`,
        debug: {
          loginSuccess: false,
          pageLoaded: false,
          commentsFound: 0
        }
      };
    }
  }

  // Simula a chamada para o backend (implementar depois)
  private async callBackendScraper(postUrl: string): Promise<TestCommentResponse> {
    const backendEndpoint = `${this.config.backendUrl}/api/test-comments`;
    
    try {
      console.log(`🌐 Chamando: ${backendEndpoint}`);
      
      // Tentativa de chamada real ao backend
      const response = await fetch(backendEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postUrl,
          botCredentials: {
            username: this.config.username,
            password: this.config.password
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Resposta do backend recebida');
        return data;
      } else {
        throw new Error(`Backend retornou ${response.status}`);
      }

    } catch (error) {
      console.log('⚠️ Backend não disponível - simulando resposta...');
      
      // Fallback: simula resposta para teste
      await this.simulateDelay(3000);
      return this.generateMockResponse(postUrl);
    }
  }

  // Gera resposta simulada para teste
  private generateMockResponse(postUrl: string): TestCommentResponse {
    const mockComments = [
      {
        username: 'maria_silva123',
        text: 'Que demais! 😍',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min atrás
      },
      {
        username: 'joao_santos_br',
        text: 'Adorei o post! ❤️',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 min atrás
      },
      {
        username: 'ana_costa_rj',
        text: 'Muito bom! 👏',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1h atrás
      },
      {
        username: 'pedro_oliveira',
        text: 'Que foto incrível! 📸',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() // 1.5h atrás
      },
      {
        username: 'camila_ferreira',
        text: 'Perfeito! ✨',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2h atrás
      }
    ];

    return {
      status: 'success',
      comments: mockComments.slice(0, 20),
      message: `🤖 SIMULAÇÃO: ${mockComments.length} comentários extraídos via conta-bot!
      
      ⚠️ Esta é uma simulação para teste.
      Para dados reais, configure o backend Node.js com Puppeteer.`,
      debug: {
        loginSuccess: true,
        pageLoaded: true,
        commentsFound: mockComments.length
      }
    };
  }

  private isValidInstagramUrl(url: string): boolean {
    const instagramPostRegex = /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+/;
    return instagramPostRegex.test(url);
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Status da configuração
  getConfig() {
    return {
      hasCredentials: !!(this.config.username && this.config.password),
      backendConfigured: !!this.config.backendUrl,
      username: this.config.username,
      backendUrl: this.config.backendUrl
    };
  }
}
