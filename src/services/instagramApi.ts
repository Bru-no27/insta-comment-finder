
// Serviço para integração com API do Instagram
// Usando Instagram Scrapper Posts Reels Stories Downloader API

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
  // Regex para extrair ID de URLs do Instagram
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

// Função para buscar comentários (usando Instagram Scrapper API)
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

  try {
    console.log('🔍 Testando API com Post ID:', postId);
    console.log('📱 URL original:', postUrl);
    
    // Configuração da API
    const API_KEY = 'f34e5a19d6msh390627795de429ep1e3ca8jsn219636894924';
    const API_HOST = 'instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com';
    
    // Lista de endpoints possíveis para testar
    const possibleEndpoints = [
      // Endpoints para posts/media
      `/media/${postId}`,
      `/post/${postId}`,
      `/post_details/${postId}`,
      `/media_info/${postId}`,
      `/get_post/${postId}`,
      
      // Endpoints para comentários
      `/comments/${postId}`,
      `/post_comments/${postId}`,
      `/media_comments/${postId}`,
      `/get_comments/${postId}`,
      
      // Endpoints com query params
      `/media?shortcode=${postId}`,
      `/post?id=${postId}`,
      `/comments?post_id=${postId}`,
      
      // Endpoints gerais para testar conectividade
      `/health`,
      `/status`,
      `/`,
    ];

    console.log('🧪 Testando endpoints disponíveis...');
    
    for (const endpoint of possibleEndpoints) {
      try {
        const testUrl = `https://${API_HOST}${endpoint}`;
        console.log(`⚡ Testando: ${endpoint}`);
        
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
            'Accept': 'application/json',
          },
        });

        console.log(`📊 Status ${endpoint}:`, response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ SUCESSO em ${endpoint}:`, data);
          
          // Se encontrou dados, tenta extrair comentários
          if (data && typeof data === 'object') {
            const extractedComments = extractCommentsFromResponse(data, filter);
            if (extractedComments.length > 0) {
              return {
                comments: extractedComments,
                total: extractedComments.length,
                status: 'success',
                message: `Dados obtidos via ${endpoint}`
              };
            }
          }
          
        } else if (response.status !== 404) {
          // Não é 404, pode ser útil para debug
          const errorText = await response.text();
          console.log(`⚠️ Erro ${response.status} em ${endpoint}:`, errorText);
        }
        
      } catch (endpointError) {
        console.log(`❌ Erro de rede em ${endpoint}:`, endpointError);
      }
    }

    // Se chegou até aqui, nenhum endpoint funcionou
    console.log('❌ Nenhum endpoint funcionou - usando simulação');
    const simulationResult = generateAdvancedSimulation(postUrl, filter);
    return {
      ...simulationResult,
      status: 'error',
      message: 'API não possui endpoints compatíveis. Usando simulação inteligente.'
    };

  } catch (error) {
    console.error('❌ Erro geral na API:', error);
    const simulationResult = generateAdvancedSimulation(postUrl, filter);
    return {
      ...simulationResult,
      status: 'error',
      message: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
};

// Função para extrair comentários de diferentes estruturas de resposta
const extractCommentsFromResponse = (data: any, filter?: string): InstagramComment[] => {
  console.log('🔬 Analisando estrutura da resposta:', data);
  
  let comments: InstagramComment[] = [];
  
  // Tenta diferentes caminhos onde os comentários podem estar
  const possiblePaths = [
    data.comments,
    data.data?.comments,
    data.result?.comments,
    data.media?.comments,
    data.post?.comments,
    data.edge_media_to_comment?.edges,
    data.comments?.data,
    Array.isArray(data) ? data : null
  ];

  for (const path of possiblePaths) {
    if (Array.isArray(path)) {
      console.log(`📝 Encontrados ${path.length} itens em um dos caminhos`);
      
      comments = path.map((item: any, index: number) => ({
        id: item.id || item.node?.id || `api_${index}`,
        username: item.username || item.user?.username || item.node?.owner?.username || `user_${index}`,
        text: item.text || item.comment || item.node?.text || item.message || 'Comentário sem texto',
        timestamp: formatTimestamp(item.timestamp || item.created_time || item.node?.created_at),
        likes: item.likes || item.like_count || item.node?.edge_liked_by?.count || 0
      })).filter(comment => 
        comment.username !== `user_${comments.indexOf(comment)}` || 
        comment.text !== 'Comentário sem texto'
      );
      
      if (comments.length > 0) {
        console.log(`✅ Extraídos ${comments.length} comentários válidos`);
        break;
      }
    }
  }

  // Aplica filtro se fornecido
  if (filter && filter.trim() && comments.length > 0) {
    const originalLength = comments.length;
    comments = comments.filter(comment => 
      comment.username.toLowerCase().includes(filter.toLowerCase()) ||
      comment.text.toLowerCase().includes(filter.toLowerCase())
    );
    console.log(`🔍 Filtro aplicado: ${originalLength} → ${comments.length} comentários`);
  }

  return comments;
};

// Função para formatar timestamp
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'agora';
  
  try {
    const date = new Date(timestamp * 1000); // Assume Unix timestamp
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'agora';
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  } catch {
    return 'agora';
  }
};

// Simulação avançada como fallback
const generateAdvancedSimulation = (url: string, filter?: string): InstagramApiResponse => {
  const isReel = url.includes('/reel/') || url.includes('/reels/');
  const isStory = url.includes('/stories/');
  
  const commentTemplates = {
    fashion: [
      "Que look incrível! 😍✨",
      "Amei essa combinação de cores 💕",
      "Onde você comprou essa peça? 👗",
      "Inspiração pura! 🔥",
      "Perfeita como sempre ❤️",
      "Que estilo maravilhoso 👑",
      "Adorei o outfit completo 💫"
    ],
    travel: [
      "Que lugar incrível! 🌎",
      "Onde é esse paraíso? 🏝️",
      "Já adicionei na minha lista de viagem ✈️",
      "Que vista maravilhosa 🌅",
      "Quero muito conhecer esse lugar 🗺️",
      "Foto perfeita! 📸",
      "Que destino dos sonhos 💭"
    ],
    food: [
      "Que delícia! 🤤",
      "Receita por favor! 👩‍🍳",
      "Onde é esse restaurante? 🍽️",
      "Que fome que me deu 😋",
      "Parece delicioso demais 🍴",
      "Vou tentar fazer em casa 🏠",
      "Que apresentação linda 🎨"
    ],
    general: [
      "Foto linda! 😍",
      "Perfeito! 👏",
      "Amei! 💕",
      "Que incrível 🌟",
      "Maravilhoso ✨",
      "Inspirador 🙌",
      "Que legal! 🎉"
    ]
  };

  const usernames = [
    "maria_silva", "joao_santos", "ana_costa", "carlos_oliveira", 
    "lucia_ferreira", "pedro_alves", "clara_mendes", "rafael_lima",
    "juliana_rocha", "bruno_carvalho", "camila_souza", "diego_martins",
    "fernanda_dias", "gustavo_reis", "helena_torres", "igor_campos"
  ];

  // Determina categoria baseada no URL
  const urlLower = url.toLowerCase();
  let category: keyof typeof commentTemplates = 'general';
  
  if (urlLower.includes('fashion') || urlLower.includes('outfit') || urlLower.includes('look')) {
    category = 'fashion';
  } else if (urlLower.includes('travel') || urlLower.includes('beach') || urlLower.includes('trip')) {
    category = 'travel';
  } else if (urlLower.includes('food') || urlLower.includes('restaurant') || urlLower.includes('cook')) {
    category = 'food';
  }

  const templates = commentTemplates[category];
  const numComments = Math.floor(Math.random() * 15) + 10; // 10-25 comentários
  let comments: InstagramComment[] = [];

  for (let i = 0; i < numComments; i++) {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
    const randomHours = Math.floor(Math.random() * 72) + 1;

    comments.push({
      id: `sim_${i + 1}`,
      username: randomUsername,
      text: randomTemplate,
      timestamp: `${randomHours}h`,
      likes: Math.floor(Math.random() * 50)
    });
  }

  // Adicionar alguns comentários especiais
  const extraComments: InstagramComment[] = [
    {
      id: `sim_${comments.length + 1}`,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      text: `@${usernames[Math.floor(Math.random() * usernames.length)]} olha isso! 👀`,
      timestamp: `${Math.floor(Math.random() * 24) + 1}h`,
      likes: Math.floor(Math.random() * 20)
    },
    {
      id: `sim_${comments.length + 2}`,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      text: "👏👏👏",
      timestamp: `${Math.floor(Math.random() * 12) + 1}h`,
      likes: Math.floor(Math.random() * 30)
    }
  ];

  comments = [...comments, ...extraComments];

  // Aplicar filtro se fornecido
  if (filter && filter.trim()) {
    comments = comments.filter(comment => 
      comment.username.toLowerCase().includes(filter.toLowerCase()) ||
      comment.text.toLowerCase().includes(filter.toLowerCase())
    );
  }

  return {
    comments,
    total: comments.length,
    status: 'success',
    message: 'Simulação - Configure API key para dados reais'
  };
};
