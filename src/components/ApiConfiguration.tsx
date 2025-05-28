
import React from 'react';
import { Settings, CheckCircle, AlertCircle, ExternalLink, Star } from 'lucide-react';
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
              ? '✅ APIs Configuradas' 
              : '⚙️ Configuração de APIs Necessária'
            }
          </h3>
        </div>
        
        <p className={`${
          apiStatus.isConfigured ? 'text-green-800' : 'text-yellow-800'
        }`}>
          {apiStatus.isConfigured 
            ? `${apiStatus.configuredApis} de ${apiStatus.totalApis} APIs configuradas e ativas para comentários reais`
            : 'Configure pelo menos uma API para acessar comentários reais do Instagram'
          }
        </p>
      </div>

      {/* Lista de APIs Disponíveis */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h4 className="text-lg font-medium text-gray-900">APIs Disponíveis</h4>
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
                  {api.isConfigured ? "Configurada" : "Não configurada"}
                </Badge>
              </div>
              
              {api.name === 'Instagram Scraper Stable API' && (
                <div className="mb-3 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">⭐ Recomendada!</p>
                  <p className="text-sm text-blue-700">API estável com plano gratuito e excelente documentação</p>
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Funcionalidades:</p>
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

      {/* Guia de Configuração Específico */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertTitle>🚀 Como Configurar a Instagram Scraper Stable API</AlertTitle>
        <AlertDescription>
          <div className="space-y-3 mt-2">
            <div className="bg-blue-50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Passo a passo simples:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Acesse o link da API que você escolheu no RapidAPI</li>
                <li>Clique em "Subscribe to Test" (tem plano gratuito!)</li>
                <li>Copie sua chave da API (X-RapidAPI-Key)</li>
                <li>Cole a chave no arquivo <code>src/services/instagramApi.ts</code></li>
                <li>Mude <code>active: false</code> para <code>active: true</code></li>
                <li>Teste com qualquer URL do Instagram!</li>
              </ol>
            </div>
            
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <a 
                href="https://rapidapi.com/thetechguy32744/api/instagram-scraper-stable-api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Acessar Instagram Scraper Stable API
              </a>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Exemplo de Configuração */}
      <div className="bg-gray-50 border rounded-xl p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3">
          💻 Exemplo de Configuração no Código
        </h4>
        <div className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm font-mono overflow-x-auto">
          <pre>{`// Em src/services/instagramApi.ts
{
  name: 'Instagram Scraper Stable API',
  host: 'instagram-scraper-stable-api.p.rapidapi.com',
  key: 'sua-chave-real-aqui', // ← Cole sua chave aqui
  active: true, // ← Mude para true
}`}</pre>
        </div>
      </div>
    </div>
  );
};

export default ApiConfiguration;
