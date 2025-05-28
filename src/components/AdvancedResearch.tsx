
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Code, 
  Globe, 
  Zap, 
  Activity,
  BookOpen,
  Terminal
} from 'lucide-react';
import { advancedScraper, analyzeStoriesIGTechniques } from '@/services/advancedScraping';

interface ResearchResult {
  success: boolean;
  technique: string;
  proxyUsed?: string;
  detectionRisk: 'low' | 'medium' | 'high';
  data?: any;
  error?: string;
}

const AdvancedResearch = () => {
  const [testUrl, setTestUrl] = useState('');
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<string>('');

  const techniques = [
    {
      id: 'puppeteer',
      name: 'Puppeteer Automation',
      description: 'Simulação de navegador real com anti-detecção',
      risk: 'high' as const,
      icon: <Globe className="h-4 w-4" />
    },
    {
      id: 'http-advanced',
      name: 'HTTP Advanced',
      description: 'Requisições HTTP com headers sofisticados',
      risk: 'medium' as const,
      icon: <Code className="h-4 w-4" />
    },
    {
      id: 'cloudflare-bypass',
      name: 'CloudFlare Bypass',
      description: 'Contorno de proteções anti-bot',
      risk: 'high' as const,
      icon: <Shield className="h-4 w-4" />
    }
  ];

  const runTest = async (techniqueId: string) => {
    if (!testUrl) return;
    
    setIsLoading(true);
    setSelectedTechnique(techniqueId);
    
    try {
      let result;
      
      switch (techniqueId) {
        case 'puppeteer':
          result = await advancedScraper.simulatePuppeteerScraping(testUrl);
          break;
        case 'http-advanced':
          result = await advancedScraper.simulateAdvancedHttpScraping(testUrl);
          break;
        case 'cloudflare-bypass':
          result = await advancedScraper.simulateCloudflareBypass(testUrl);
          break;
        default:
          throw new Error('Técnica não encontrada');
      }
      
      setResults(prev => [result, ...prev.slice(0, 4)]);
      
    } catch (error) {
      setResults(prev => [{
        success: false,
        technique: techniqueId,
        detectionRisk: 'high',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }, ...prev.slice(0, 4)]);
    } finally {
      setIsLoading(false);
      setSelectedTechnique('');
    }
  };

  const analysis = analyzeStoriesIGTechniques();
  const riskAnalysis = advancedScraper.getRiskAnalysis();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'very-high': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning Legal */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">⚖️ Aviso Legal Importante</AlertTitle>
        <AlertDescription className="text-red-700">
          Este módulo é APENAS para fins educacionais e pesquisa. As técnicas demonstradas violam os Termos de Uso do Instagram e podem ter implicações legais. Use com responsabilidade.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="testing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="testing">🧪 Testes</TabsTrigger>
          <TabsTrigger value="analysis">📊 Análise</TabsTrigger>
          <TabsTrigger value="techniques">🔧 Técnicas</TabsTrigger>
          <TabsTrigger value="documentation">📚 Docs</TabsTrigger>
        </TabsList>

        {/* Aba de Testes */}
        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Laboratório de Testes Avançados
              </CardTitle>
              <CardDescription>
                Simule técnicas de scraping avançado (dados fictícios)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="URL do Instagram para teste (ex: instagram.com/p/xxx)"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {techniques.map((technique) => (
                  <Card key={technique.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {technique.icon}
                        <h3 className="font-medium">{technique.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{technique.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getRiskColor(technique.risk)}>
                          {technique.risk}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => runTest(technique.id)}
                          disabled={!testUrl || isLoading}
                          variant={selectedTechnique === technique.id ? "default" : "outline"}
                        >
                          {selectedTechnique === technique.id && isLoading ? (
                            <Activity className="h-3 w-3 animate-spin" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                          Testar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resultados dos Testes */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>📋 Resultados dos Testes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{result.technique}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(result.detectionRisk)}>
                            Risco: {result.detectionRisk}
                          </Badge>
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.success ? "Sucesso" : "Erro"}
                          </Badge>
                        </div>
                      </div>
                      
                      {result.proxyUsed && (
                        <p className="text-sm text-gray-600 mb-2">
                          Proxy: {result.proxyUsed}
                        </p>
                      )}
                      
                      {result.data && (
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {result.error && (
                        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                          Erro: {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Aba de Análise */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Análise de Risco</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Risco Atual:</span>
                    <Badge className={getRiskColor(riskAnalysis.currentRisk)}>
                      {riskAnalysis.currentRisk}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Requests:</span>
                    <span>{riskAnalysis.requestCount}</span>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recomendações:</h4>
                    <ul className="text-sm space-y-1">
                      {riskAnalysis.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚠️ Riscos Legais</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {analysis.legalRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Técnicas */}
        <TabsContent value="techniques" className="space-y-4">
          <div className="grid gap-4">
            {analysis.identifiedTechniques.map((technique, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{technique.name}</CardTitle>
                    <Badge className={getRiskColor(technique.riskLevel)}>
                      {technique.riskLevel}
                    </Badge>
                  </div>
                  <CardDescription>{technique.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded p-3">
                    <h4 className="font-medium mb-1">Implementação:</h4>
                    <p className="text-sm text-gray-700">{technique.implementation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Aba de Documentação */}
        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Stack Técnico do StoriesIG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Frontend:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• JavaScript + Bootstrap</li>
                    <li>• Google Analytics</li>
                    <li>• Yandex.Metrica</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Backend:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• CloudFlare (CDN + Proteção)</li>
                    <li>• Puppeteer/Playwright</li>
                    <li>• Sistema de Proxies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔬 Métodos de Pesquisa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Como identificamos as técnicas:</h4>
                <ol className="text-sm space-y-2 ml-4">
                  <li>1. Análise de network requests (DevTools)</li>
                  <li>2. Investigação de headers HTTP</li>
                  <li>3. Análise de JavaScript obfuscado</li>
                  <li>4. Testes de rate limiting</li>
                  <li>5. Análise de comportamento de proxies</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-medium text-blue-800 mb-2">📚 Recursos para Aprendizado:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Puppeteer Documentation</li>
                  <li>• Anti-Detection Techniques</li>
                  <li>• Proxy Rotation Strategies</li>
                  <li>• Legal Aspects of Web Scraping</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => advancedScraper.resetSystem()}
        >
          🔄 Reset Sistema
        </Button>
        <Button 
          variant="outline"
          onClick={() => setResults([])}
        >
          🗑️ Limpar Resultados
        </Button>
      </div>
    </div>
  );
};

export default AdvancedResearch;
