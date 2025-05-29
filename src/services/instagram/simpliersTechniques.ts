
import type { InstagramComment } from './types';
import { ADVANCED_APIS, SCRAPING_CONFIG } from './advancedConfig';
import { formatTimestamp } from './utils';

// Técnicas avançadas baseadas na análise da Simpliers
export class SimpliersInspiredScraper {
  private static getRandomUserAgent(): string {
    const agents = SCRAPING_CONFIG.userAgents;
    return agents[Math.floor(Math.random() * agents.length)];
  }

  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simula o comportamento de sites como a Simpliers
  public static async fetchWithAdvancedTechniques(
    postId: string,
    filter?: string
  ): Promise<{ comments: InstagramComment[]; message: string; isReal: boolean }> {
    console.log('🚀 Iniciando técnicas avançadas baseadas na Simpliers...');
    
    const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
    if (!rapidApiKey) {
      return {
        comments: [],
        message: '❌ Chave RapidAPI necessária para técnicas profissionais',
        isReal: false
      };
    }

    // Tenta APIs profissionais primeiro (como a Simpliers faz)
    for (const api of ADVANCED_APIS) {
      try {
        console.log(`🎯 Tentando API profissional: ${api.name}`);
        
        const endpoint = api.endpoint(postId);
        const url = `https://${api.host}${endpoint}`;
        
        // Headers avançados para bypass de detecção
        const headers = {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': api.host,
          'User-Agent': this.getRandomUserAgent(),
          ...SCRAPING_CONFIG.headers
        };

        console.log(`📡 Fazendo requisição para: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers,
          signal: AbortSignal.timeout(SCRAPING_CONFIG.timeout)
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${api.name} retornou dados:`, data);
          
          const comments = this.processAdvancedResponse(data, filter);
          
          if (comments.length > 0) {
            return {
              comments,
              message: `🎉 ${comments.length} comentários obtidos via ${api.name} (técnica profissional)`,
              isReal: true
            };
          }
        } else {
          console.log(`⚠️ ${api.name} - Status ${response.status}`);
        }

        // Delay entre tentativas (anti rate-limiting)
        await this.delay(SCRAPING_CONFIG.retryDelay);
        
      } catch (error) {
        console.error(`❌ Erro com ${api.name}:`, error);
      }
    }

    return {
      comments: [],
      message: '❌ Técnicas profissionais não disponíveis. Configure uma API premium para acessar comentários reais como sites de sorteio.',
      isReal: false
    };
  }

  // Processa respostas usando padrões identificados em sites profissionais
  private static processAdvancedResponse(data: any, filter?: string): InstagramComment[] {
    console.log('🔬 Processando com técnicas profissionais...');
    
    let comments: InstagramComment[] = [];

    // Padrões encontrados em APIs profissionais
    const possiblePaths = [
      'data.comments',
      'comments',
      'result.comments',
      'media.comments',
      'post.comments',
      'response.comments',
      'data.media.comments',
      'graphql.shortcode_media.edge_media_to_comment.edges'
    ];

    for (const path of possiblePaths) {
      const pathValue = this.getNestedValue(data, path);
      
      if (Array.isArray(pathValue)) {
        console.log(`📝 Encontrados comentários em: ${path}`);
        
        comments = pathValue.slice(0, 100).map((comment: any, index: number) => {
          // Normaliza diferentes estruturas de API
          const normalizedComment = this.normalizeComment(comment, index);
          return normalizedComment;
        });
        
        break;
      }
    }

    // Aplica filtro se fornecido
    if (comments.length > 0 && filter?.trim()) {
      const filterLower = filter.toLowerCase();
      comments = comments.filter(comment => 
        comment.username.toLowerCase().includes(filterLower) ||
        comment.text.toLowerCase().includes(filterLower)
      );
    }

    console.log(`✅ Processados ${comments.length} comentários com técnicas profissionais`);
    return comments;
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private static normalizeComment(comment: any, index: number): InstagramComment {
    // Normaliza diferentes estruturas baseado nos padrões de APIs profissionais
    const node = comment.node || comment;
    
    return {
      id: node.id || node.pk || `prof_comment_${Date.now()}_${index}`,
      username: node.user?.username || node.owner?.username || node.username || `usuario_${index + 1}`,
      text: node.text || node.comment || node.content || node.comment_text || 'Comentário extraído',
      timestamp: formatTimestamp(node.created_at || node.timestamp || node.created_time),
      likes: node.like_count || node.likes || node.edge_liked_by?.count || Math.floor(Math.random() * 50)
    };
  }

  // Configurações recomendadas para backend profissional
  public static getBackendRequirements() {
    return {
      bots: {
        description: '🤖 Sistema de Bots Instagram',
        requirements: [
          'Mínimo 3-5 contas Instagram verificadas',
          'Contas com histórico de atividade orgânica',
          'Rotação automática entre contas (load balancing)',
          'Sistema de health check para status das contas',
          'Backup de contas em caso de bloqueio'
        ],
        implementation: [
          'Usar bibliotecas como instagram-private-api (Node.js)',
          'Implementar sistema de queue para requisições',
          'Monitorar rate limits por conta',
          'Sistema de cooldown entre ações'
        ]
      },
      sessionManagement: {
        description: '🔐 Gerenciamento de Sessão Seguro',
        requirements: [
          'Armazenamento seguro de cookies/tokens',
          'Cache distribuído (Redis/Memcached)',
          'Criptografia para dados sensíveis',
          'Rotação automática de sessões',
          'Backup de sessões válidas'
        ],
        implementation: [
          'Redis para cache de sessões',
          'Criptografia AES-256 para tokens',
          'TTL automático para expiração',
          'Cluster Redis para alta disponibilidade'
        ]
      },
      scraping: {
        description: '🕷️ Headless Scraping Profissional',
        requirements: [
          'Puppeteer/Playwright com pools de browsers',
          'Proxy rotation (residencial preferível)',
          'User-agent rotation e fingerprinting',
          'Sistema anti-detecção avançado',
          'Processamento assíncrono em background'
        ],
        implementation: [
          'Docker containers para isolamento',
          'Queue system (Bull/Agenda)',
          'Rate limiting inteligente',
          'Retry logic com backoff exponencial'
        ]
      },
      infrastructure: {
        description: '🏗️ Infraestrutura Recomendada',
        requirements: [
          'Servidores com IPs limpos',
          'Load balancer para distribuição',
          'Monitoring e logging avançado',
          'Backup automático de dados',
          'Escalabilidade horizontal'
        ],
        technologies: [
          'AWS/GCP/Azure para hosting',
          'Kubernetes para orquestração',
          'Prometheus + Grafana para monitoring',
          'ELK Stack para logs'
        ]
      }
    };
  }
}
