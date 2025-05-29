
import React, { useState } from 'react';
import { Microscope, AlertTriangle, Code, Globe, Shield, Database, Timer, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { advancedScraper, analyzeStoriesIGTechniques } from '@/services/advancedScraping';

const SimpliersResearch = () => {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<string>('');
  const { toast } = useToast();

  const techniques = [
    {
      id: 'puppeteer',
      name: 'Puppeteer/Playwright Simulation',
      icon: <Code className="h-5 w-5" />,
      description: 'Simula navegador headless com perfis de dispositivo realistas',
      risk: 'high',
      color: 'red'
    },
    {
      id: 'advanced-http',
      name: 'Advanced HTTP Scraping',
      icon: <Globe className="h-5 w-5" />,
      description: 'Headers spoofing e rotação de user-agents',
      risk: 'medium',
      color: 'yellow'
    },
    {
      id: 'cloudflare-bypass',
      name: 'CloudFlare Bypass',
      icon: <Shield className="h-5 w-5" />,
      description: 'Técnicas de contorno de proteções anti-bot',
      risk: 'very-high',
      color: 'purple'
    }
  ];

  const handleAnalyze = async (techniqueId: string) => {
    if (!instagramUrl.trim()) {
      toast({
        title: "URL necessária",
        description: "Insira um link do Instagram para análise",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setSelectedTechnique(techniqueId);
    
    try {
      let result;
      
      switch (techniqueId) {
        case 'puppeteer':
          result = await advancedScraper.simulatePuppeteerScraping(instagramUrl);
          break;
        case 'advanced-http':
          result = await advancedScraper.simulateAdvancedHttpScraping(instagramUrl);
          break;
        case 'cloudflare-bypass':
          result = await advancedScraper.simulateCloudflareBypass(instagramUrl);
          break;
        default:
          throw new Error('Técnica não implementada');
      }
      
      setResults(result);
      
      toast({
        title: "Análise concluída!",
        description: `Técnica ${techniqueId} simulada com sucesso`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Erro ao simular a técnica selecionada",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analysis = analyzeStoriesIGTechniques();
  const riskAnalysis = advancedScraper.getRiskAnalysis();

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-bold text-red-900">⚠️ AVISO LEGAL IMPORTANTE</h3>
        </div>
        <div className="text-red-800 space-y-2">
          <p className="font-medium">Este laboratório é APENAS para fins educacionais e de pesquisa!</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Scraping do Instagram viola os Termos de Uso da Meta</li>
            <li>Pode resultar em bloqueio de IP ou ações legais</li>
            <li>As técnicas mostradas são simulações educacionais</li>
            <li>Use apenas APIs oficiais em projetos reais</li>
          </ul>
        </div>
      </div>

      {/* URL Input */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Link para Análise</h3>
        <input
          type="text"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          placeholder="https://instagram.com/p/CODIGO ou https://instagram.com/reel/CODIGO"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Techniques */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔬 Técnicas Identificadas no Simpliers</h3>
        <div className="grid gap-4">
          {techniques.map((technique) => (
            <div key={technique.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${technique.color}-100`}>
                    {technique.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{technique.name}</h4>
                    <p className="text-sm text-gray-600">{technique.description}</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium bg-${technique.color}-100 text-${technique.color}-800`}>
                      Risco: {technique.risk}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAnalyze(technique.id)}
                  disabled={isAnalyzing}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isAnalyzing && selectedTechnique === technique.id
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : `bg-${technique.color}-600 text-white hover:bg-${technique.color}-700`
                  }`}
                >
                  {isAnalyzing && selectedTechnique === technique.id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Simulando...
                    </div>
                  ) : (
                    'Simular'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Resultados da Simulação</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${results.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {results.success ? (
                  <Zap className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Técnica: {results.technique}</h4>
                <p className="text-sm text-gray-600">Proxy usado: {results.proxyUsed}</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                  results.detectionRisk === 'low' ? 'bg-green-100 text-green-800' :
                  results.detectionRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Risco de detecção: {results.detectionRisk}
                </span>
              </div>
            </div>
            
            {results.data && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Dados da Simulação:</h5>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(results.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technical Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Análise Técnica Detalhada</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Técnicas Identificadas:</h4>
            <div className="space-y-3">
              {analysis.identifiedTechniques.map((tech, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <h5 className="font-medium text-gray-900">{tech.name}</h5>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                    tech.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                    tech.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    tech.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {tech.riskLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Stack Técnico:</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Linguagem: {analysis.technicalStack.language}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Automação: {analysis.technicalStack.automation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Proxies: {analysis.technicalStack.proxies}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Proteção: {analysis.technicalStack.protection}</span>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-3 mt-4">Riscos Legais:</h4>
            <div className="bg-red-50 rounded-lg p-4">
              <ul className="text-sm text-red-800 space-y-1">
                {analysis.legalRisks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Monitor */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Monitor de Risco</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
              riskAnalysis.currentRisk === 'low' ? 'bg-green-100' :
              riskAnalysis.currentRisk === 'medium' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <Timer className={`h-8 w-8 ${
                riskAnalysis.currentRisk === 'low' ? 'text-green-600' :
                riskAnalysis.currentRisk === 'medium' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
            </div>
            <h4 className="font-medium text-gray-900">Risco Atual</h4>
            <p className="text-sm text-gray-600 capitalize">{riskAnalysis.currentRisk}</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900">Requests</h4>
            <p className="text-sm text-gray-600">{riskAnalysis.requestCount}</p>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => advancedScraper.resetSystem()}
              className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-2 hover:bg-gray-200 transition-colors"
            >
              <Zap className="h-8 w-8 text-gray-600" />
            </button>
            <h4 className="font-medium text-gray-900">Reset</h4>
            <p className="text-sm text-gray-600">Sistema</p>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-2">Recomendações:</h5>
          <ul className="text-sm text-gray-700 space-y-1">
            {riskAnalysis.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpliersResearch;
