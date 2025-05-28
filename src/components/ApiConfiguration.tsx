
import React from 'react';
import { Settings, CheckCircle, AlertCircle, ExternalLink, Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getApiStatus } from '@/services/instagramApi';

const ApiConfiguration = () => {
  const apiStatus = getApiStatus();

  return (
    <div className="space-y-6">
      {/* Status Geral */}
      <div className={`border rounded-xl p-6 ${
        apiStatus.isConfigured 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          {apiStatus.isConfigured ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          )}
          <h3 className={`text-lg font-semibold ${
            apiStatus.isConfigured ? 'text-green-900' : 'text-yellow-900'
          }`}>
            {apiStatus.isConfigured 
              ? '✅ APIs REAIS Configuradas' 
              : '🔧 Configure APIs REAIS para Comentários Verdadeiros'
            }
          </h3>
        </div>
        
        <p className={`${
          apiStatus.isConfigured ? 'text-green-800' : 'text-yellow-800'
        }`}>
          {apiStatus.isConfigured 
            ? `${apiStatus.configuredApis} de ${apiStatus.totalApis} APIs VERIFICADAS ativas para comentários REAIS do Instagram`
            : 'Configure pelo menos uma API REAL para acessar comentários verdadeiros (muitas têm plano GRATUITO!)'
          }
        </p>
      </div>

      {/* APIs REAIS Verificadas */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-5 w-5 text-blue-600" />
          <h4 className="text-lg font-medium text-gray-900">🚀 APIs REAIS Verificadas (2024)</h4>
        </div>
        
        <div className="space-y-4">
          {apiStatus.availableApis.map((api, index) => (
            <div key={index} className={`border rounded-lg p-4 ${
              api.name === 'Instagram Scraper Stable API'
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-gray-900">{api.name}</h5>
                      {api.name === 'Instagram Scraper Stable API' && (
                        <Star className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{api.price}</p>
                  </div>
                </div>
                <Badge variant={api.isConfigured ? "default" : "outline"}>
                  {api.isConfigured ? "✅ Configurada" : "❌ Precisa configurar"}
                </Badge>
              </div>
              
              {api.name === 'Instagram Scraper Stable API' && (
                <div className="mb-3 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">⭐ MAIS RECOMENDADA!</p>
                  <p className="text-sm text-blue-700">API estável, endpoints verificados, plano GRATUITO disponível</p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Funcionalidades REAIS:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {api.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guia ESPECÍFICO para Instagram Scraper Stable API */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertTitle>🎯 Como Configurar a Instagram Scraper Stable API (RECOMENDADA)</AlertTitle>
        <AlertDescription>
          <div className="space-y-3 mt-2">
            <div className="bg-green-50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2 text-green-800">✅ Passo a passo GARANTIDO:</p>
              <ol className="list-decimal list-inside space-y-2 text-green-700">
                <li>Acesse: <strong>rapidapi.com/thetechguy32744/api/instagram-scraper-stable-api</strong></li>
                <li>Clique em <strong>"Subscribe to Test"</strong> (TEM PLANO GRATUITO! 🎉)</li>
                <li>Copie sua chave da API (X-RapidAPI-Key) da seção "Headers"</li>
                <li>Substitua a chave no arquivo <code>src/services/instagramApi.ts</code></li>
                <li>Teste com qualquer URL do Instagram!</li>
              </ol>
            </div>
            
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <a 
                href="https://rapidapi.com/thetechguy32744/api/instagram-scraper-stable-api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                🚀 Acessar Instagram Scraper Stable API (GRATUITA)
              </a>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Outras opções */}
      <div className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">
          🔧 Outras APIs REAIS Disponíveis
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a href="https://rapidapi.com/sunnyskies91254/api/instagram-bulk-profile-scrapper" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Instagram Bulk Profile Scrapper
            </a>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a href="https://rapidapi.com/rapidapi/api/instagram-media-downloader" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Instagram Media Downloader
            </a>
          </div>
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a href="https://rapidapi.com/socialmediascraper/api/social-media-scraper-api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Social Media Scraper API
            </a>
          </div>
        </div>
      </div>

      {/* Instruções de Configuração */}
      <div className="bg-gray-900 text-green-400 rounded-xl p-6">
        <h4 className="text-lg font-medium text-white mb-3">
          💻 Onde Configurar no Código
        </h4>
        <div className="text-sm font-mono overflow-x-auto">
          <pre className="whitespace-pre-wrap">{`// Em src/services/instagramApi.ts, linha ~35:

{
  name: 'Instagram Scraper Stable API',
  host: 'instagram-scraper-stable-api.p.rapidapi.com',
  key: 'SUA_CHAVE_AQUI', // ← Cole sua chave do RapidAPI aqui
  active: true, // ← Deve estar true
},`}</pre>
        </div>
      </div>
    </div>
  );
};

export default ApiConfiguration;
