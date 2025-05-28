
import React from 'react';
import { Settings, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
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
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-medium text-gray-900">{api.name}</h5>
                  <p className="text-sm text-gray-600">{api.price}</p>
                </div>
                <Badge variant={api.isConfigured ? "default" : "outline"}>
                  {api.isConfigured ? "Configurada" : "Não configurada"}
                </Badge>
              </div>
              
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

      {/* Guia de Configuração */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertTitle>Como Configurar uma API Real</AlertTitle>
        <AlertDescription>
          <div className="space-y-3 mt-2">
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Passo a passo:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Acesse <strong>RapidAPI.com</strong> e crie uma conta</li>
                <li>Procure por "Instagram Scraper API" ou "Social Media API"</li>
                <li>Assine um plano (a partir de $15/mês)</li>
                <li>Copie sua chave da API (X-RapidAPI-Key)</li>
                <li>Cole a chave no arquivo <code>src/services/instagramApi.ts</code></li>
                <li>Mude <code>active: false</code> para <code>active: true</code></li>
              </ol>
            </div>
            
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <a 
                href="https://rapidapi.com/marketplace" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Acessar RapidAPI Marketplace
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
  name: 'Instagram Scraper API',
  host: 'instagram-scraper-api2.p.rapidapi.com',
  key: 'sua-chave-real-aqui', // ← Cole sua chave aqui
  active: true, // ← Mude para true
}`}</pre>
        </div>
      </div>
    </div>
  );
};

export default ApiConfiguration;
