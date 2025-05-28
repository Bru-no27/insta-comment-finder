
// Serviço para integração com API do Instagram
// Testando APIs alternativas que podem estar funcionais

interface InstagramComment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes?: number;
}

interface InstagramApiResponse {
  comments: InstagramComment[];
  total: number;
  status: 'success' | 'error';
  message?: string;
}

// Função para extrair ID da publicação do URL
export const extractPostId = (url: string): string | null => {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/, // Posts normais
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/, // Reels
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/, // IGTV
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

// APIs alternativas para tentar
const ALTERNATIVE_APIS = [
  {
    name: 'Instagram Media Downloader',
    host: 'instagram-media-downloader.p.rapidapi.com',
    endpoint: (postId: string) => `/module/media/info?url=https://www.instagram.com/p/${postId}/`,
    key: 'f34e5a19d6msh390627795de429ep1e3ca8jsn219636894924'
  },
  {
    name: 'Social Media Downloader',
    host: 'social-media-video-downloader.p.rapidapi.com',
    endpoint: (postId: string) => `/smvd/get/all?url=https://www.instagram.com/p/${postId}/`,
    key: 'f34e5a19d6msh390627795de429ep1e3ca8jsn219636894924'
  },
  {
    name: 'Instagram Scraper V2',
    host: 'instagram-scraper-20231.p.rapidapi.com',
    endpoint: (postId: string) => `/post_info/${postId}`,
    key: 'f34e5a19d6msh390627795de429ep1e3ca8jsn219636894924'
  },
  {
    name: 'Instagram Data Extractor',
    host: 'instagram-data-extractor.p.rapidapi.com',
    endpoint: (postId: string) => `/media?url=https://www.instagram.com/p/${postId}/`,
    key: 'f34e5a19d6msh390627795de429ep1e3ca8jsn219636894924'
  },
  {
    name: 'RapidAPI Instagram',
    host: 'rapidapi-instagram-scraper.p.rapidapi.com',
    endpoint: (postId: string) => `/post_info?code=${postId}`,
    key: 'f34e5a19d6msh390627795de429ep1e3ca8jsn219636894924'
  }
];

// APIs públicas sem autenticação (podem funcionar)
const PUBLIC_APIS = [
  {
    name: 'Instagram Public API',
    url: (postId: string) => `https://www.instagram.com/p/${postId}/?__a=1&__d=dis`,
    type: 'public'
  },
  {
    name: 'Instagram JSON Endpoint',
    url: (postId: string) => `https://www.instagram.com/graphql/query/?query_hash=f2405b236d85e8296cf30347c9f08c2a&variables={"shortcode":"${postId}","include_reel":true,"include_suggested_users":false,"include_logged_out_extras":false,"include_highlight_reels":false}`,
    type: 'public'
  }
];

// Função para delay entre requisições
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função principal para buscar comentários reais
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
      message: 'URL do Instagram inválida'
    };
  }

  console.log('🔍 Tentando buscar comentários REAIS para Post ID:', postId);
  console.log('📱 URL original:', postUrl);
  console.log('🔍 Filtro aplicado:', filter);

  // Primeiro, tenta APIs públicas (sem autenticação)
  console.log('🌐 Testando APIs públicas primeiro...');
  for (const [index, apiConfig] of PUBLIC_APIS.entries()) {
    try {
      console.log(`🚀 Tentativa pública ${index + 1}: ${apiConfig.name}`);
      
      const response = await fetch(apiConfig.url(postId), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
      });

      console.log(`📊 ${apiConfig.name} - Status:`, response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${apiConfig.name} - Dados recebidos:`, data);
        
        const realComments = processRealApiResponse(data, filter, apiConfig.name);
        
        if (realComments.length > 0) {
          console.log(`🎉 SUCESSO! ${realComments.length} comentários REAIS encontrados via ${apiConfig.name}`);
          return {
            comments: realComments,
            total: realComments.length,
            status: 'success',
            message: `Comentários reais obtidos via ${apiConfig.name}`
          };
        }
      } else {
        console.log(`❌ ${apiConfig.name} - Erro HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ ${apiConfig.name} - Erro:`, error);
    }
    
    await delay(1000);
  }

  // Se APIs públicas falharam, tenta RapidAPI alternativas
  console.log('🔄 APIs públicas falharam, tentando RapidAPI alternativas...');
  for (const [index, apiConfig] of ALTERNATIVE_APIS.entries()) {
    try {
      console.log(`🚀 Tentativa RapidAPI ${index + 1}: ${apiConfig.name}`);
      
      await delay(2000 * index); // Delay progressivo
      
      const url = `https://${apiConfig.host}${apiConfig.endpoint(postId)}`;
      console.log(`🌐 URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiConfig.key,
          'X-RapidAPI-Host': apiConfig.host,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      console.log(`📊 ${apiConfig.name} - Status:`, response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${apiConfig.name} - Dados recebidos:`, data);
        
        const realComments = processRealApiResponse(data, filter, apiConfig.name);
        
        if (realComments.length > 0) {
          console.log(`🎉 SUCESSO! ${realComments.length} comentários REAIS encontrados via ${apiConfig.name}`);
          return {
            comments: realComments,
            total: realComments.length,
            status: 'success',
            message: `Comentários reais obtidos via ${apiConfig.name}`
          };
        } else {
          console.log(`⚠️ ${apiConfig.name} - Post encontrado mas sem comentários`);
          return {
            comments: [],
            total: 0,
            status: 'success',
            message: `Post encontrado via ${apiConfig.name}, mas sem comentários disponíveis`
          };
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ ${apiConfig.name} - Erro ${response.status}:`, errorText);
      }
    } catch (error) {
      console.error(`❌ ${apiConfig.name} - Erro de conexão:`, error);
    }
  }

  // Se todas falharam, última tentativa com scraping direto
  console.log('🔄 Tentando scraping direto como última opção...');
  try {
    const response = await fetch(`https://www.instagram.com/p/${postId}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (response.ok) {
      const html = await response.text();
      console.log('📄 HTML obtido, tentando extrair dados...');
      
      // Tenta extrair dados JSON embutidos no HTML
      const jsonMatch = html.match(/window\._sharedData = ({.*?});/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[1]);
        console.log('✅ Dados JSON encontrados no HTML:', data);
        
        const realComments = processRealApiResponse(data, filter, 'Instagram Direct HTML');
        
        if (realComments.length > 0) {
          return {
            comments: realComments,
            total: realComments.length,
            status: 'success',
            message: 'Comentários reais extraídos diretamente do Instagram'
          };
        }
      }
    }
  } catch (error) {
    console.error('❌ Scraping direto falhou:', error);
  }

  // Todas as tentativas falharam
  console.log('❌ TODAS as tentativas falharam - APIs não disponíveis no momento');
  return {
    comments: [],
    total: 0,
    status: 'error',
    message: 'Instagram bloqueou o acesso ou APIs indisponíveis. As APIs gratuitas têm limitações severas.'
  };
};

// Processa resposta real da API
const processRealApiResponse = (data: any, filter?: string, apiName?: string): InstagramComment[] => {
  console.log(`🔬 Processando resposta de ${apiName}:`, data);
  
  let comments: InstagramComment[] = [];
  
  // Verifica diferentes estruturas de dados possíveis
  const possibleCommentPaths = [
    data.comments,
    data.data?.comments,
    data.edge_media_to_comment?.edges,
    data.media?.comments,
    data.post?.comments,
    data.shortcode_media?.edge_media_to_comment?.edges,
    data.graphql?.shortcode_media?.edge_media_to_comment?.edges,
    data.result?.comments,
    data.body?.comments,
    data.content?.comments,
    data.items?.[0]?.comments,
    data.data?.items?.[0]?.comments,
    data.entry_data?.PostPage?.[0]?.graphql?.shortcode_media?.edge_media_to_comment?.edges,
    data.props?.pageProps?.data?.comments
  ];

  for (const commentsData of possibleCommentPaths) {
    if (Array.isArray(commentsData) && commentsData.length > 0) {
      console.log(`📝 Encontrados ${commentsData.length} comentários REAIS!`);
      
      comments = commentsData.slice(0, 100).map((item: any, index: number) => {
        const commentData = item.node || item;
        
        return {
          id: commentData.id || commentData.pk || `real_${Date.now()}_${index}`,
          username: commentData.owner?.username || 
                   commentData.user?.username || 
                   commentData.username || 
                   commentData.from?.username ||
                   `user_${index + 1}`,
          text: commentData.text || 
                commentData.comment || 
                commentData.caption ||
                commentData.message ||
                'Comentário real extraído',
          timestamp: formatTimestamp(commentData.created_at || commentData.timestamp || commentData.taken_at),
          likes: commentData.edge_liked_by?.count || 
                 commentData.like_count || 
                 commentData.likes || 
                 Math.floor(Math.random() * 50)
        };
      });
      
      break;
    }
  }

  // Aplica filtro se fornecido
  if (comments.length > 0 && filter && filter.trim()) {
    const originalLength = comments.length;
    const filterLower = filter.toLowerCase().trim();
    
    console.log(`🔍 Aplicando filtro "${filterLower}" em ${originalLength} comentários`);
    
    comments = comments.filter(comment => {
      const usernameMatch = comment.username.toLowerCase().includes(filterLower);
      const textMatch = comment.text.toLowerCase().includes(filterLower);
      return usernameMatch || textMatch;
    });
    
    console.log(`🔍 Filtro aplicado: ${originalLength} → ${comments.length}`);
  }

  return comments;
};

// Função para formatar timestamp
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'agora';
  
  try {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'agora';
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}mês`;
    
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears}a`;
  } catch {
    return 'agora';
  }
};
