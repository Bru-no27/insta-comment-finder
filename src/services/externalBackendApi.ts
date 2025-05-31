
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
  private fallbackUrls: string[];

  constructor() {
    this.baseUrl = 'https://insta-comment-finder-production.up.railway.app';
    this.fallbackUrls = [
      'https://insta-comment-finder-production.up.railway.app',
      // Adicione outras URLs de fallback se necessário
    ];
    console.log('🔧 Backend URL configurada:', this.baseUrl);
  }

  private async testConnection(url: string): Promise<boolean> {
    try {
      console.log(`🔍 Testando conexão com: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${url}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.text();
        console.log(`✅ Conexão OK com ${url}:`, data.substring(0, 200));
        return true;
      } else {
        console.log(`❌ Conexão falhou com ${url}: Status ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Erro de conexão com ${url}:`, error.message);
      return false;
    }
  }

  private async findWorkingBackend(): Promise<string | null> {
    for (const url of this.fallbackUrls) {
      const isWorking = await this.testConnection(url);
      if (isWorking) {
        console.log(`✅ Backend funcionando encontrado: ${url}`);
        return url;
      }
    }
    console.log('❌ Nenhum backend funcionando encontrado');
    return null;
  }

  async fetchInstagramComments(postUrl: string): Promise<ExternalBackendResponse> {
    console.log(`🚀 DIAGNÓSTICO COMPLETO INICIADO`);
    console.log(`📱 Post URL: ${postUrl}`);
    console.log(`🌐 Origin atual: ${window.location.origin}`);
    console.log(`🕒 Timestamp: ${new Date().toISOString()}`);

    // Primeiro, encontrar um backend que funcione
    const workingBackend = await this.findWorkingBackend();
    
    if (!workingBackend) {
      throw new Error(`❌ BACKEND INACESSÍVEL

🔍 Diagnóstico realizado em: ${new Date().toLocaleString('pt-BR')}

📊 Status dos serviços testados:
${this.fallbackUrls.map(url => `❌ ${url} - Inacessível`).join('\n')}

🔧 SOLUÇÕES POSSÍVEIS:

1️⃣ VERIFICAR RAILWAY:
   • Acesse: railway.app
   • Projeto: insta-comment-finder-production
   • Status: Verificar se está rodando

2️⃣ VERIFICAR VARIÁVEIS:
   • CORS_ORIGINS=${window.location.origin}
   • BOT_USERNAME=seu_bot_username
   • BOT_PASSWORD=sua_senha_bot

3️⃣ REDEPLOY:
   • No Railway, clique em "Redeploy"
   • Aguarde 3-5 minutos

4️⃣ LOGS DO RAILWAY:
   • Vá em "Deployments" > "View Logs"
   • Procure por erros de inicialização

❗ O backend parece estar offline ou com problemas de configuração.`);
    }

    // Tentar a requisição principal
    const fullUrl = `${workingBackend}/api/instagram-comments`;
    console.log(`🚀 Fazendo requisição para: ${fullUrl}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ postUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response ok: ${response.ok}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Erro HTTP ${response.status}:`, errorText);
        
        if (response.status === 429) {
          throw new Error(`Muitas requisições. Aguarde alguns minutos antes de tentar novamente.`);
        }
        
        if (response.status === 400) {
          throw new Error(`URL inválida. Verifique se é uma URL válida do Instagram.`);
        }
        
        if (response.status === 500) {
          throw new Error(`Erro interno do servidor. Verifique se as credenciais do bot estão configuradas no Railway.`);
        }
        
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ Dados recebidos com sucesso:`, {
        status: data.status,
        totalComments: data.comments?.length || 0,
        message: data.message
      });
      
      return data;

    } catch (networkError) {
      console.error(`❌ Erro na requisição:`, networkError);
      
      if (networkError.name === 'AbortError') {
        throw new Error(`⏱️ Timeout: O servidor demorou mais de 30 segundos para responder. Tente novamente.`);
      }
      
      throw new Error(`❌ Erro de rede: ${networkError.message}`);
    }
  }

  getBackendUrl(): string {
    return this.baseUrl;
  }

  setBackendUrl(url: string): void {
    this.baseUrl = url;
    this.fallbackUrls = [url, ...this.fallbackUrls.filter(u => u !== url)];
    console.log(`🔧 URL do backend atualizada para: ${url}`);
  }
}

export const externalBackendApi = new ExternalBackendApi();
