
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
    console.log('Buscando comentários para post ID:', postId);
    console.log('URL original:', postUrl);
    
    // Configuração da API
    const API_KEY = 'f34e5a19d6msh390627795de429ep1e3ca8jsn219636894924';
    const API_HOST = 'instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com';
    
    console.log('Conectando à Instagram Scrapper API...');
    console.log('API Host:', API_HOST);
    console.log('API Key (primeiros 10 chars):', API_KEY.substring(0, 10) + '...');

    // Vamos tentar diferentes endpoints para testar a conectividade
    const endpoints = [
      { name: 'hashtag_search', url: `https://${API_HOST}/hashtag_search_by_query?hashtag=test&count=5` },
      { name: 'user_info', url: `https://${API_HOST}/user_info?username=instagram` },
      { name: 'post_info', url: `https://${API_HOST}/post_info?shortcode=${postId}` }
    ];

    let apiConnected = false;
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Testando endpoint: ${endpoint.name}`);
        console.log(`URL completa: ${endpoint.url}`);
        
        const testResponse = await fetch(endpoint.url, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });

        console.log(`Status ${endpoint.name}:`, testResponse.status);
        console.log(`Headers enviados:`, {
          'X-RapidAPI-Key': API_KEY.substring(0, 10) + '...',
          'X-RapidAPI-Host': API_HOST
        });

        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log(`✅ ${endpoint.name} funcionando!`, testData);
          apiConnected = true;
          break;
        } else {
          const errorText = await testResponse.text();
          console.log(`❌ ${endpoint.name} falhou:`, testResponse.status, errorText);
          lastError = {
            status: testResponse.status,
            message: errorText,
            endpoint: endpoint.name
          };
        }
      } catch (endpointError) {
        console.log(`❌ Erro no endpoint ${endpoint.name}:`, endpointError);
        lastError = {
          status: 'network_error',
          message: endpointError instanceof Error ? endpointError.message : 'Erro de rede',
          endpoint: endpoint.name
        };
      }
    }

    // Se a API está conectada, use simulação informando o status
    if (apiConnected) {
      console.log('✅ API conectada com sucesso!');
      const simulationResult = generateAdvancedSimulation(postUrl, filter);
      return {
        ...simulationResult,
        status: 'success',
        message: 'API conectada! Usando simulação para comentários (endpoint específico não disponível).'
      };
    } else {
      // API não funcionou, mas vamos retornar erro detalhado
      console.log('❌ API não funcionou em nenhum endpoint');
      const simulationResult = generateAdvancedSimulation(postUrl, filter);
      return {
        ...simulationResult,
        status: 'error',
        message: `Erro API ${lastError?.status}: ${lastError?.message}. Usando simulação como fallback.`
      };
    }

  } catch (error) {
    console.error('❌ Erro geral ao conectar com a API:', error);
    
    // Fallback para simulação em caso de erro
    const simulationResult = generateAdvancedSimulation(postUrl, filter);
    return {
      ...simulationResult,
      status: 'error',
      message: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Usando simulação.`
    };
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
