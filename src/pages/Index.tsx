import React, { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import CommentList from '@/components/CommentList';
import AdvancedResearch from '@/components/AdvancedResearch';
import ApiConfiguration from '@/components/ApiConfiguration';
import SimpliersResearch from '@/components/SimpliersResearch';
import { Instagram, AlertCircle, CheckCircle, CreditCard, Zap, Microscope, Settings, Beaker } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchInstagramComments, getApiStatus } from '@/services/instagramApi';

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
  const [statusMessage, setStatusMessage] = useState('');
  const [isRealData, setIsRealData] = useState(false);
  const [showAdvancedResearch, setShowAdvancedResearch] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [showSimpliersResearch, setShowSimpliersResearch] = useState(false);
  const { toast } = useToast();

  const apiConfigStatus = getApiStatus();

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
    setStatusMessage('');
    
    try {
      console.log('Iniciando busca para URL:', instagramUrl);
      console.log('Filtro aplicado:', searchFilter);
      
      const response = await fetchInstagramComments(instagramUrl, searchFilter);
      
      if (response.status === 'error') {
        setApiStatus('error');
        setStatusMessage(response.message || 'Erro ao buscar comentários');
        setFilteredComments([]);
        setIsRealData(false);
        
        toast({
          title: "Erro na busca",
          description: response.message || "Não foi possível buscar os comentários",
          variant: "destructive"
        });
      } else {
        const comments: Comment[] = response.comments.map(comment => ({
          id: comment.id,
          username: comment.username,
          text: comment.text,
          timestamp: comment.timestamp,
          likes: comment.likes
        }));
        
        setFilteredComments(comments);
        setApiStatus('success');
        setStatusMessage(response.message || 'Comentários obtidos com sucesso');
        setIsRealData(response.message?.includes('REAIS') || false);
        
        toast({
          title: "Busca concluída!",
          description: `${comments.length} comentários encontrados`,
        });
      }
      
      setIsSearched(true);
      
    } catch (error) {
      console.error('Erro na busca:', error);
      setApiStatus('error');
      setStatusMessage('Erro interno da aplicação');
      setFilteredComments([]);
      setIsRealData(false);
      
      toast({
        title: "Erro interno",
        description: "Erro inesperado na aplicação",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToNormalMode = () => {
    setShowAdvancedResearch(false);
    setShowApiConfig(false);
    setShowSimpliersResearch(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Instagram className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Busca Comentário Instagram</h1>
                <p className="text-gray-600 text-sm">
                  {apiConfigStatus.isConfigured 
                    ? `✅ ${apiConfigStatus.configuredApis} API(s) configurada(s) - Dados reais disponíveis`
                    : '⚙️ Configure uma API para comentários reais'
                  }
                </p>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowApiConfig(!showApiConfig);
                  setShowAdvancedResearch(false);
                  setShowSimpliersResearch(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showApiConfig 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="h-4 w-4" />
                APIs
              </button>
              
              <button
                onClick={() => {
                  setShowAdvancedResearch(!showAdvancedResearch);
                  setShowApiConfig(false);
                  setShowSimpliersResearch(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showAdvancedResearch 
                    ? 'bg-purple-100 border-purple-300 text-purple-700' 
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Microscope className="h-4 w-4" />
                Pesquisa
              </button>

              <button
                onClick={() => {
                  setShowSimpliersResearch(!showSimpliersResearch);
                  setShowApiConfig(false);
                  setShowAdvancedResearch(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showSimpliersResearch 
                    ? 'bg-green-100 border-green-300 text-green-700' 
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Beaker className="h-4 w-4" />
                Simpliers Lab
              </button>
              
              {(showApiConfig || showAdvancedResearch || showSimpliersResearch) && (
                <button
                  onClick={resetToNormalMode}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  Normal
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {showApiConfig ? (
          /* API Configuration Mode */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-900">⚙️ Configuração de APIs Reais</h2>
              </div>
              <p className="text-blue-800">
                Configure uma API paga para acessar comentários verdadeiros do Instagram. 
                <strong> Dados reais em tempo real!</strong>
              </p>
            </div>
            
            <ApiConfiguration />
          </div>
        ) : showSimpliersResearch ? (
          /* Simpliers Research Mode */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Beaker className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-bold text-green-900">🧪 Laboratório Simpliers</h2>
              </div>
              <p className="text-green-800">
                Análise técnica das metodologias identificadas no Simpliers para coleta de comentários do Instagram. 
                <strong> Apenas para fins educacionais!</strong>
              </p>
            </div>
            
            <SimpliersResearch />
          </div>
        ) : showAdvancedResearch ? (
          /* Advanced Research Mode */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Microscope className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-bold text-purple-900">🔬 Laboratório de Pesquisa Avançada</h2>
              </div>
              <p className="text-purple-800">
                Explore técnicas avançadas de scraping identificadas no StoriesIG.info. 
                <strong> Apenas para fins educacionais!</strong>
              </p>
            </div>
            
            <AdvancedResearch />
          </div>
        ) : (
          /* Normal Mode */
          <div className="space-y-6">
            {/* API Status */}
            {isSearched && (
              <div className={`border rounded-xl p-4 mb-6 ${
                apiStatus === 'error' 
                  ? 'bg-red-50 border-red-200' 
                  : isRealData 
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  {apiStatus === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  ) : isRealData ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className={`text-sm font-medium ${
                      apiStatus === 'error' 
                        ? 'text-red-800' 
                        : isRealData 
                          ? 'text-green-800'
                          : 'text-blue-800'
                    }`}>
                      {apiStatus === 'error' 
                        ? 'Erro na API' 
                        : isRealData 
                          ? '✅ Dados Reais do Instagram'
                          : '🎯 Dados de Demonstração'
                      }
                    </h3>
                    <p className={`text-sm mt-1 ${
                      apiStatus === 'error' 
                        ? 'text-red-700' 
                        : isRealData 
                          ? 'text-green-700'
                          : 'text-blue-700'
                    }`}>
                      {statusMessage}
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
                  <span className="ml-3 text-gray-600">
                    {apiConfigStatus.isConfigured 
                      ? 'Buscando comentários reais via API...'
                      : 'Gerando dados de demonstração...'
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Results */}
            {isSearched && !isLoading && apiStatus === 'success' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isRealData ? 'Comentários Reais' : 'Comentários de Demonstração'}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isRealData 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {filteredComments.length} {filteredComments.length === 1 ? 'comentário' : 'comentários'}
                  </span>
                </div>
                
                <CommentList comments={filteredComments} searchFilter={searchFilter} />
              </div>
            )}

            {/* Info Section */}
            {!isSearched && !isLoading && (
              <div className="space-y-6">
                {/* New Simpliers Lab Promotion */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Beaker className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">🧪 NOVO: Laboratório Simpliers</h3>
                  </div>
                  <div className="space-y-3 text-green-800">
                    <p>Análise técnica das metodologias do Simpliers para coleta de comentários:</p>
                    <div className="bg-white/50 rounded-lg p-4 text-sm">
                      <p>• Simulação de Puppeteer/Playwright</p>
                      <p>• Advanced HTTP Scraping</p>
                      <p>• CloudFlare Bypass Techniques</p>
                      <p>• Sistema de anti-detecção</p>
                    </div>
                    <button
                      onClick={() => setShowSimpliersResearch(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Explorar Laboratório Simpliers
                    </button>
                  </div>
                </div>

                {/* Quick API Setup */}
                {!apiConfigStatus.isConfigured && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="h-6 w-6 text-orange-600" />
                      <h3 className="text-lg font-semibold text-orange-900">🚀 Configure uma API Real Agora!</h3>
                    </div>
                    <div className="space-y-3 text-orange-800">
                      <p>Acesse comentários verdadeiros do Instagram em segundos:</p>
                      <div className="bg-white/50 rounded-lg p-4 text-sm">
                        <p>✅ APIs já configuradas no código</p>
                        <p>✅ Só precisa da sua chave do RapidAPI</p>
                        <p>✅ Funciona imediatamente</p>
                      </div>
                      <button
                        onClick={() => setShowApiConfig(true)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Configurar API Real
                      </button>
                    </div>
                  </div>
                )}

                {/* Research Notice */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Microscope className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-900">🔬 Pesquisa Avançada</h3>
                  </div>
                  <div className="space-y-3 text-purple-800">
                    <p>Explore técnicas avançadas de scraping identificadas através da análise do StoriesIG.info:</p>
                    <div className="bg-white/50 rounded-lg p-4 text-sm">
                      <p>• Simulação de Puppeteer/Playwright</p>
                      <p>• Sistema de anti-detecção</p>
                      <p>• Rotação de proxies residenciais</p>
                      <p>• Bypass de CloudFlare</p>
                    </div>
                    <button
                      onClick={() => setShowAdvancedResearch(true)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Explorar Técnicas Avançadas
                    </button>
                  </div>
                </div>

                {/* How to use */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Como usar:</h3>
                  <div className="space-y-2 text-blue-800">
                    <p className="flex items-start gap-2">
                      <span className="font-medium">1.</span>
                      <span>Cole o link da publicação do Instagram no primeiro campo</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-medium">2.</span>
                      <span>Digite um nome de usuário ou palavra-chave para filtrar (opcional)</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-medium">3.</span>
                      <span>Clique em "Buscar Comentários" para ver os resultados</span>
                    </p>
                  </div>
                </div>

                {/* Demo info */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">🎯 Sistema de Demonstração:</h3>
                  <div className="space-y-3 text-green-800">
                    <p>Funciona perfeitamente com dados realistas!</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Comentários brasileiros autênticos</li>
                      <li>Usernames e timestamps realistas</li>
                      <li>Filtros funcionais em tempo real</li>
                      <li>Suporte a Posts, Reels e IGTV</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Sistema Híbrido: APIs Reais + Demonstração + Pesquisa Avançada + Laboratório Simpliers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
