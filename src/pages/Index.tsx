
import React, { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import CommentList from '@/components/CommentList';
import { Instagram, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchInstagramComments } from '@/services/instagramApi';

export interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes?: number;
}

const Index = () => {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'success' | 'error'>('success');
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
    setApiStatus('success');
    
    try {
      console.log('Iniciando busca para URL:', instagramUrl);
      console.log('Filtro aplicado:', searchFilter);
      
      // Chama a API real do Instagram
      const response = await fetchInstagramComments(instagramUrl, searchFilter);
      
      if (response.status === 'error') {
        setApiStatus('error');
        throw new Error(response.message || 'Erro ao buscar comentários');
      }
      
      // Converte os comentários para o formato esperado
      const comments: Comment[] = response.comments.map(comment => ({
        id: comment.id,
        username: comment.username,
        text: comment.text,
        timestamp: comment.timestamp,
        likes: comment.likes
      }));
      
      setFilteredComments(comments);
      setIsSearched(true);
      
      toast({
        title: "Busca concluída!",
        description: `${comments.length} comentários encontrados`,
      });
      
    } catch (error) {
      console.error('Erro na busca:', error);
      setApiStatus('error');
      toast({
        title: "Erro na busca",
        description: error instanceof Error ? error.message : "Não foi possível carregar os comentários",
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
        {/* API Status Error */}
        {apiStatus === 'error' && isSearched && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro na API</h3>
                <p className="text-sm text-red-700 mt-1">
                  Não foi possível buscar os comentários reais. Verifique o link ou tente novamente mais tarde.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Real Data Success */}
        {apiStatus === 'success' && isSearched && filteredComments.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Dados Reais do Instagram</h3>
                <p className="text-sm text-green-700 mt-1">
                  Os comentários foram obtidos diretamente da API do Instagram!
                </p>
              </div>
            </div>
          </div>
        )}

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
              <span className="ml-3 text-gray-600">Conectando com Instagram e carregando comentários...</span>
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
          <div className="space-y-6">
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
                  <span>Clique em "Buscar Comentários" para ver os resultados reais da API</span>
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">🎯 API Integrada:</h3>
              <div className="space-y-3 text-green-800">
                <p>O sistema está integrado com múltiplas APIs do Instagram via RapidAPI:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Instagram Scraper Stable API</li>
                  <li>Instagram Basic Scraper</li>
                  <li>Instagram Posts Scraper</li>
                </ul>
                <p className="text-sm mt-3">
                  <strong>Dados Reais:</strong> Todos os comentários são buscados diretamente do Instagram!
                </p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">✨ Recursos:</h3>
              <div className="space-y-3 text-purple-800">
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Busca comentários reais em tempo real</li>
                  <li>Filtro por nome de usuário ou palavra-chave</li>
                  <li>Suporte a Posts, Reels e IGTV</li>
                  <li>Tratamento automático de rate limits</li>
                  <li>Múltiplas APIs para maior sucesso</li>
                </ul>
              </div>
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
