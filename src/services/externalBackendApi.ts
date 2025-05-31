
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
      'https://insta-comment-finder-production-production.up.railway.app', // Possível URL alternativa
      // Adicione outras URLs de fallback se necessário
    ];
    console.log('🔧 Backend URL configurada:', this.baseUrl);
  }

  private async testConnection(url: string): Promise<boolean> {
    try {
      console.log(`🔍 Testando conexão com: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(`${url}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        mode: 'cors',
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
    console.log('🔍 Procurando backend funcionando...');
    
    for (const url of this.fallbackUrls) {
      const isWorking = await this.testConnection(url);
      if (isWorking) {
        console.log(`✅ Backend funcionando encontrado: ${url}`);
        return url;
      }
      
      // Aguardar 1 segundo entre testes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('❌ Nenhum backend funcionando encontrado');
    return null;
  }

  async fetchInstagramComments(postUrl: string): Promise<ExternalBackendResponse> {
    console.log(`🚀 INICIANDO BUSCA DE COMENTÁRIOS`);
    console.log(`📱 Post URL: ${postUrl}`);
    console.log(`🌐 Origin: ${window.location.origin}`);
    console.log(`🕒 Timestamp: ${new Date().toISOString()}`);

    // Primeiro, encontrar um backend que funcione
    const workingBackend = await this.findWorkingBackend();
    
    if (!workingBackend) {
      throw new Error(`❌ BACKEND INACESSÍVEL

🔍 Diagnóstico realizado em: ${new Date().toLocaleString('pt-BR')}

📊 Status dos serviços testados:
${this.fallbackUrls.map(url => `❌ ${url} - Inacessível`).join('\n')}

💡 PRÓXIMOS PASSOS:

1️⃣ TESTE MANUAL:
   • Abra nova aba: ${this.baseUrl}/
   • Se carregar = backend OK, problema é CORS
   • Se não carregar = backend offline

2️⃣ RAILWAY LOGS:
   • Acesse: railway.app → projeto
   • Deployments → View Logs
   • Procure por erros

3️⃣ REDEPLOY:
   • No Railway: Redeploy
   • Aguarde 3-5 minutos

4️⃣ DNS/CONECTIVIDADE:
   • Teste em rede diferente
   • Desabilite VPN se ativo
   • Teste no celular (4G)

O backend parece estar rodando segundo os logs, mas não conseguimos conectar.`);
    }

    // Tentar a requisição principal
    const fullUrl = `${workingBackend}/api/instagram-comments`;
    console.log(`🚀 Fazendo requisição para: ${fullUrl}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({ postUrl }),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      console.log(`📊 Response status: ${response.status}`);
      console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));
      
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
          throw new Error(`Erro interno do servidor. Verifique as credenciais do bot no Railway.`);
        }
        
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ Dados recebidos:`, {
        status: data.status,
        totalComments: data.comments?.length || 0,
        message: data.message
      });
      
      return data;

    } catch (networkError) {
      console.error(`❌ Erro na requisição:`, networkError);
      
      if (networkError.name === 'AbortError') {
        throw new Error(`⏱️ Timeout: Servidor demorou mais de 45 segundos para responder.`);
      }
      
      if (networkError.message?.includes('CORS')) {
        throw new Error(`❌ ERRO CORS: O backend precisa autorizar o domínio: ${window.location.origin}`);
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
