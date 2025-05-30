
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
    // URL do seu backend no Railway - URL REAL CONFIGURADA
    this.baseUrl = 'https://insta-comment-finder-production.up.railway.app';
  }

  async fetchInstagramComments(postUrl: string): Promise<ExternalBackendResponse> {
    const fullUrl = `${this.baseUrl}/api/instagram-comments`;
    console.log(`🚀 REQUISIÇÃO: ${fullUrl}`);
    console.log(`📱 POST URL: ${postUrl}`);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postUrl }),
      });

      console.log(`📊 RESPONSE STATUS: ${response.status}`);
      console.log(`📊 RESPONSE OK: ${response.ok}`);
      console.log(`📊 RESPONSE HEADERS:`, response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ ERRO HTTP ${response.status}:`, errorText);
        
        if (response.status === 429) {
          let data;
          try {
            data = JSON.parse(errorText);
          } catch {
            data = {};
          }
          throw new Error(`Muitas requisições. Tente novamente em ${data.retryAfter || 15} minutos.`);
        }
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Erro desconhecido no servidor' };
        }
        
        throw new Error(errorData.message || `Erro HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ DADOS RECEBIDOS:`, data);
      return data;

    } catch (networkError) {
      console.error(`❌ ERRO DE REDE:`, {
        name: networkError.name,
        message: networkError.message,
        stack: networkError.stack
      });
      
      if (networkError.name === 'TypeError' && networkError.message.includes('fetch')) {
        throw new Error(`Erro de conexão: Não foi possível conectar ao servidor ${this.baseUrl}. Verifique se o backend está funcionando.`);
      }
      
      throw networkError;
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
