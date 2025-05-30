
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
    console.log(`🚀 Fazendo requisição para: ${this.baseUrl}/api/instagram-comments`);
    
    const response = await fetch(`${this.baseUrl}/api/instagram-comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postUrl }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        const data = await response.json();
        throw new Error(`Muitas requisições. Tente novamente em ${data.retryAfter || 15} minutos.`);
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao conectar com o servidor');
    }

    return response.json();
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
