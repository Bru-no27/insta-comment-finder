
export interface ExternalBackendComment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes?: number;
}

export interface ExternalBackendResponse {
  status: 'success' | 'error';
  comments: ExternalBackendComment[];
  totalFound: number;
  timestamp: string;
  message: string;
  error?: string;
  debug?: {
    loginSuccess: boolean;
    pageLoaded: boolean;
    commentsFound: number;
  };
}

class ExternalBackendApi {
  private baseUrl: string;

  constructor() {
    // URL do backend no Railway - configurada corretamente
    this.baseUrl = 'https://insta-comment-finder-production.up.railway.app';
    console.log('🔧 Backend URL configurada:', this.baseUrl);
  }

  async fetchInstagramComments(postUrl: string): Promise<ExternalBackendResponse> {
    const fullUrl = `${this.baseUrl}/api/instagram-comments`;
    console.log(`🚀 REQUISIÇÃO: ${fullUrl}`);
    console.log(`📱 POST URL: ${postUrl}`);
    console.log(`🌐 ORIGIN ATUAL: ${window.location.origin}`);
    
    try {
      console.log('🔍 TESTANDO CONECTIVIDADE...');
      
      // Primeiro, teste simples de conectividade
      const healthResponse = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`📊 HEALTH CHECK STATUS: ${healthResponse.status}`);
      
      if (!healthResponse.ok) {
        console.error('❌ HEALTH CHECK FALHOU:', healthResponse.status);
      } else {
        const healthData = await healthResponse.text();
        console.log('✅ HEALTH CHECK SUCESSO:', healthData);
      }

      // Agora tenta a requisição principal
      console.log('🚀 FAZENDO REQUISIÇÃO PRINCIPAL...');
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({ postUrl }),
      });

      console.log(`📊 RESPONSE STATUS: ${response.status}`);
      console.log(`📊 RESPONSE OK: ${response.ok}`);
      
      // Log dos headers de resposta
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log(`📊 RESPONSE HEADERS:`, responseHeaders);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ ERRO HTTP ${response.status}:`, errorText);
        
        // Tratamento específico para diferentes códigos de erro
        if (response.status === 429) {
          let data;
          try {
            data = JSON.parse(errorText);
          } catch {
            data = {};
          }
          throw new Error(`Muitas requisições. Tente novamente em ${data.retryAfter || 15} minutos.`);
        }
        
        if (response.status === 0 || response.status === 500) {
          throw new Error(`Erro de servidor (${response.status}). Backend pode estar offline ou com problemas de configuração.`);
        }
        
        if (response.status === 403 || response.status === 405) {
          throw new Error(`Erro de CORS ou método não permitido (${response.status}). Verifique se as variáveis CORS_ORIGINS estão configuradas no Railway.`);
        }
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Erro desconhecido no servidor' };
        }
        
        throw new Error(errorData.message || `Erro HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ DADOS RECEBIDOS:`, data);
      return data;

    } catch (networkError) {
      console.error(`❌ ERRO DE REDE DETALHADO:`, {
        name: networkError.name,
        message: networkError.message,
        stack: networkError.stack,
        toString: networkError.toString()
      });
      
      // Análise mais detalhada do erro
      if (networkError.name === 'TypeError') {
        if (networkError.message.includes('fetch')) {
          throw new Error(`❌ ERRO DE CONECTIVIDADE:
          
🔗 Backend: ${this.baseUrl}
🌐 Frontend: ${window.location.origin}

✅ Próximos passos para resolver:
1. Acesse o painel do Railway: railway.app
2. Entre no projeto: insta-comment-finder-production
3. Vá em "Variables" e confirme que CORS_ORIGINS está configurado com:
   ${window.location.origin}
4. Se necessário, force um redeploy do backend

📌 Variáveis necessárias no Railway:
- CORS_ORIGINS=${window.location.origin}
- BOT_USERNAME=sua_conta_bot
- BOT_PASSWORD=sua_senha_bot`);
        }
        
        if (networkError.message.includes('CORS')) {
          throw new Error(`❌ ERRO DE CORS:
          
Configure no Railway a variável:
CORS_ORIGINS=${window.location.origin}`);
        }
      }
      
      throw new Error(`❌ Erro de rede: ${networkError.message}`);
    }
  }

  getBackendUrl(): string {
    return this.baseUrl;
  }

  setBackendUrl(url: string): void {
    this.baseUrl = url;
    console.log(`🔧 URL do backend atualizada para: ${url}`);
  }
}

export const externalBackendApi = new ExternalBackendApi();
