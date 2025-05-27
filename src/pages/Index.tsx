import React, { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import CommentList from '@/components/CommentList';
import { Instagram, AlertCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchInstagramComments } from '@/services/instagramApi';
import { processRealInstagramData } from '@/services/realDataProcessor';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  const [apiStatus, setApiStatus] = useState<'success' | 'error' | 'simulation' | 'real'>('success');
  const [realDataInput, setRealDataInput] = useState('');
  const [showRealDataInput, setShowRealDataInput] = useState(false);
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
      
      // Simula carregamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Chama a API real do Instagram
      const response = await fetchInstagramComments(instagramUrl, searchFilter);
      
      if (response.status === 'error') {
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
      
      // Define status da API
      if (response.message?.includes('Simulação')) {
        setApiStatus('simulation');
      } else if (response.message?.includes('reais')) {
        setApiStatus('real');
      }
      
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

  const handleRealDataSubmit = () => {
    if (!realDataInput.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, cole os dados JSON do Instagram",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedData = JSON.parse(realDataInput);
      console.log('📊 Dados reais recebidos:', parsedData);
      
      const realComments = processRealInstagramData(parsedData, searchFilter);
      
      setFilteredComments(realComments);
      setIsSearched(true);
      setApiStatus('real');
      setShowRealDataInput(false);
      
      toast({
        title: "Dados reais processados!",
        description: `${realComments.length} comentários gerados baseados em dados reais`,
      });
      
    } catch (error) {
      console.error('Erro ao processar dados reais:', error);
      toast({
        title: "Erro nos dados",
        description: "Formato JSON inválido. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
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
        {/* API Status Warning */}
        {apiStatus === 'simulation' && isSearched && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Modo Simulação</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Configure sua chave de API do RapidAPI para buscar dados reais do Instagram.
                  Os comentários exibidos são gerados automaticamente para demonstração.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Real Data Success */}
        {apiStatus === 'real' && isSearched && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Dados Reais do Instagram</h3>
                <p className="text-sm text-green-700 mt-1">
                  Os comentários foram gerados baseados em dados reais de usuários do Instagram!
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
          
          {/* Real Data Input Toggle */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              onClick={() => setShowRealDataInput(!showRealDataInput)}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {showRealDataInput ? 'Ocultar' : 'Usar'} Dados Reais do Instagram
            </Button>
            
            {showRealDataInput && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cole aqui os dados JSON do Instagram:
                  </label>
                  <Textarea
                    value={realDataInput}
                    onChange={(e) => setRealDataInput(e.target.value)}
                    placeholder='{"users":[{"pk":"123","username":"exemplo","full_name":"Nome"}...]}'
                    className="min-h-32 font-mono text-sm"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cole os dados JSON obtidos diretamente do Instagram (formato: {JSON.stringify({users: []})})
                  </p>
                </div>
                <Button
                  onClick={handleRealDataSubmit}
                  disabled={isLoading || !realDataInput.trim()}
                  className="w-full"
                >
                  Processar Dados Reais
                </Button>
              </div>
            )}
          </div>
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
                  <span>Clique em "Buscar Comentários" para ver os resultados</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-medium">4.</span>
                  <span>Ou use "Dados Reais do Instagram" para colar dados JSON obtidos diretamente do Instagram</span>
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">🎯 Dados Reais:</h3>
              <div className="space-y-3 text-green-800">
                <p>Para usar dados reais do Instagram:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Acesse as ferramentas de desenvolvedor do navegador (F12)</li>
                  <li>Vá para a aba Network e acesse a publicação do Instagram</li>
                  <li>Procure por requisições que retornem dados JSON com usuários</li>
                  <li>Copie o JSON e cole na área de "Dados Reais do Instagram"</li>
                </ol>
                <p className="text-sm mt-3">
                  <strong>Novo:</strong> Agora você pode usar dados reais obtidos diretamente do Instagram!
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">⚙️ Configuração da API:</h3>
              <div className="space-y-3 text-amber-800">
                <p>Para buscar comentários reais via API, você precisa:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Criar uma conta no RapidAPI</li>
                  <li>Assinar um plano da "Instagram Scraper API"</li>
                  <li>Substituir 'SUA_CHAVE_RAPIDAPI_AQUI' no código pela sua chave real</li>
                </ol>
                <p className="text-sm mt-3">
                  <strong>Sem configuração:</strong> O sistema usará uma simulação inteligente baseada no tipo de publicação.
                </p>
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
