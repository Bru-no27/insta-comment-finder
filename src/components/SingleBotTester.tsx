
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Bot, CheckCircle, XCircle, Settings } from 'lucide-react';
import { SingleBotTester, type TestCommentResponse } from '@/services/botScraping/singleBotTester';

const SingleBotTesterComponent = () => {
  const [postUrl, setPostUrl] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [botPassword, setBotPassword] = useState('');
  const [backendUrl, setBackendUrl] = useState('http://localhost:3001'); // URL padrão do backend
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestCommentResponse | null>(null);

  const handleTest = async () => {
    if (!postUrl.trim() || !botUsername.trim() || !botPassword.trim()) {
      setResult({
        status: 'error',
        message: 'Preencha todos os campos obrigatórios'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const tester = new SingleBotTester({
      username: botUsername,
      password: botPassword,
      backendUrl: backendUrl
    });

    try {
      const response = await tester.testScraping(postUrl);
      setResult(response);
    } catch (error) {
      setResult({
        status: 'error',
        message: `Erro durante o teste: ${error}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Teste de Scraping com Conta-Bot Única
          </CardTitle>
          <CardDescription>
            Configure uma conta Instagram para testar o scraping básico de comentários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuração da Conta Bot */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <h3 className="font-semibold">Configuração da Conta-Bot</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username da Conta-Bot
                </label>
                <Input
                  type="text"
                  placeholder="sua_conta_bot"
                  value={botUsername}
                  onChange={(e) => setBotUsername(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Senha da Conta-Bot
                </label>
                <Input
                  type="password"
                  placeholder="senha_da_conta"
                  value={botPassword}
                  onChange={(e) => setBotPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                URL do Backend (Node.js + Puppeteer)
              </label>
              <Input
                type="url"
                placeholder="http://localhost:3001"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
              />
            </div>
          </div>

          {/* URL do Post */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              URL do Post do Instagram
            </label>
            <Input
              type="url"
              placeholder="https://instagram.com/p/CODIGO_DO_POST"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
            />
          </div>

          {/* Botão de Teste */}
          <Button 
            onClick={handleTest}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando Scraping...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                Testar Scraping
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado do Teste */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Resultado do Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={result.status === 'success' ? 'border-green-200' : 'border-red-200'}>
              <AlertDescription className="whitespace-pre-line">
                {result.message}
              </AlertDescription>
            </Alert>

            {/* Debug Info */}
            {result.debug && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Informações de Debug:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={result.debug.loginSuccess ? 'default' : 'destructive'}>
                    Login: {result.debug.loginSuccess ? 'OK' : 'Falhou'}
                  </Badge>
                  <Badge variant={result.debug.pageLoaded ? 'default' : 'destructive'}>
                    Página: {result.debug.pageLoaded ? 'Carregada' : 'Erro'}
                  </Badge>
                  <Badge variant="outline">
                    Comentários: {result.debug.commentsFound}
                  </Badge>
                </div>
              </div>
            )}

            {/* Lista de Comentários */}
            {result.comments && result.comments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-3">
                  Comentários Extraídos ({result.comments.length}):
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.comments.map((comment, index) => (
                    <div key={index} className="p-2 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">@{comment.username}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p><strong>1.</strong> Configure uma conta Instagram dedicada para bot</p>
            <p><strong>2.</strong> Crie o backend Node.js com Puppeteer (instruções abaixo)</p>
            <p><strong>3.</strong> Execute o backend em http://localhost:3001</p>
            <p><strong>4.</strong> Teste o scraping com um post público</p>
          </div>
          
          <Alert>
            <AlertDescription>
              <strong>Comando para criar o backend:</strong><br/>
              <code className="text-xs">mkdir backend && cd backend && npm init -y && npm install puppeteer express cors</code>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleBotTesterComponent;
