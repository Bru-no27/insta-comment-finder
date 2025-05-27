
import React, { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import CommentList from '@/components/CommentList';
import { Instagram } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Função para gerar comentários baseados no tipo de publicação
const generateComments = (url: string) => {
  const isReel = url.includes('/reel/') || url.includes('/reels/');
  const isStory = url.includes('/stories/');
  
  // Base de comentários por categoria
  const commentTemplates = {
    fashion: [
      "Que look incrível! 😍",
      "Amei essa combinação de cores",
      "Onde você comprou essa peça?",
      "Inspiração pura! 💕",
      "Perfeita como sempre",
      "Que estilo maravilhoso",
      "Adorei o outfit completo"
    ],
    travel: [
      "Que lugar incrível!",
      "Onde é esse paraíso?",
      "Já adicionei na minha lista de viagem",
      "Que vista maravilhosa",
      "Quero muito conhecer esse lugar",
      "Foto perfeita! 📸",
      "Que destino dos sonhos"
    ],
    food: [
      "Que delícia! 🤤",
      "Receita por favor!",
      "Onde é esse restaurante?",
      "Que fome que me deu",
      "Parece delicioso demais",
      "Vou tentar fazer em casa",
      "Que apresentação linda"
    ],
    general: [
      "Foto linda! 😍",
      "Perfeito!",
      "Amei! 💕",
      "Que incrível",
      "Maravilhoso",
      "Inspirador",
      "Que legal!"
    ]
  };

  const usernames = [
    "maria_silva", "joao_santos", "ana_costa", "carlos_oliveira", 
    "lucia_ferreira", "pedro_alves", "clara_mendes", "rafael_lima",
    "juliana_rocha", "bruno_carvalho", "camila_souza", "diego_martins",
    "fernanda_dias", "gustavo_reis", "helena_torres", "igor_campos"
  ];

  // Determina categoria baseada no URL (simulação)
  const urlLower = url.toLowerCase();
  let category = 'general';
  
  if (urlLower.includes('fashion') || urlLower.includes('outfit') || urlLower.includes('look')) {
    category = 'fashion';
  } else if (urlLower.includes('travel') || urlLower.includes('beach') || urlLower.includes('trip')) {
    category = 'travel';
  } else if (urlLower.includes('food') || urlLower.includes('restaurant') || urlLower.includes('cook')) {
    category = 'food';
  }

  const templates = commentTemplates[category as keyof typeof commentTemplates];
  
  // Gera comentários aleatórios
  const numComments = Math.floor(Math.random() * 12) + 8; // 8-20 comentários
  const comments = [];

  for (let i = 0; i < numComments; i++) {
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
    const randomHours = Math.floor(Math.random() * 48) + 1;

    comments.push({
      id: i + 1,
      username: randomUsername,
      text: randomTemplate,
      timestamp: `${randomHours}h`
    });
  }

  // Adiciona alguns comentários de marcações e interações
  const extraComments = [
    {
      id: comments.length + 1,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      text: `@${usernames[Math.floor(Math.random() * usernames.length)]} olha isso!`,
      timestamp: `${Math.floor(Math.random() * 24) + 1}h`
    },
    {
      id: comments.length + 2,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      text: "👏👏👏",
      timestamp: `${Math.floor(Math.random() * 12) + 1}h`
    }
  ];

  return [...comments, ...extraComments];
};

export interface Comment {
  id: number;
  username: string;
  text: string;
  timestamp: string;
}

const Index = () => {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!instagramUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um link do Instagram",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simula carregamento da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Analisando URL:', instagramUrl);
      console.log('Filtro aplicado:', searchFilter);
      
      // Gera comentários baseados no URL
      const generatedComments = generateComments(instagramUrl);
      
      // Aplica filtro se houver texto de busca
      let results = generatedComments;
      if (searchFilter.trim()) {
        results = generatedComments.filter(comment => 
          comment.username.toLowerCase().includes(searchFilter.toLowerCase()) ||
          comment.text.toLowerCase().includes(searchFilter.toLowerCase())
        );
      }
      
      setFilteredComments(results);
      setIsSearched(true);
      
      toast({
        title: "Busca concluída!",
        description: `${results.length} comentários encontrados`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível carregar os comentários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Busca Comentário</h1>
              <p className="text-gray-600 text-sm">Encontre comentários específicos em publicações do Instagram</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <SearchForm
            instagramUrl={instagramUrl}
            setInstagramUrl={setInstagramUrl}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Analisando publicação e carregando comentários...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {isSearched && !isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Comentários Encontrados
              </h2>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {filteredComments.length} {filteredComments.length === 1 ? 'comentário' : 'comentários'}
              </span>
            </div>
            
            <CommentList comments={filteredComments} searchFilter={searchFilter} />
          </div>
        )}

        {/* Info Section */}
        {!isSearched && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Como usar:</h3>
            <div className="space-y-2 text-blue-800">
              <p className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Cole o link da publicação do Instagram no primeiro campo</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Digite um nome de usuário ou palavra-chave para filtrar os comentários (opcional)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Clique em "Buscar Comentários" para ver os resultados</span>
              </p>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Demonstração:</strong> Esta versão gera comentários realísticos baseados no tipo de publicação. 
                Os comentários são criados dinamicamente para simular diferentes cenários de busca.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Busca Comentário - Ferramenta para filtrar comentários do Instagram
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
