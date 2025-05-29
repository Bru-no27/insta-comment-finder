
// Exemplo de implementação do backend Node.js com Puppeteer
// Salve este arquivo como: backend/server.js

const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Cache simples para sessões (em produção, use Redis)
let browserInstance = null;
let loggedInPage = null;
let lastLoginTime = null;

// Endpoint de teste de comentários
app.post('/api/test-comments', async (req, res) => {
  console.log('🤖 Recebida requisição de scraping...');
  
  const { postUrl, botCredentials } = req.body;
  
  if (!postUrl || !botCredentials?.username || !botCredentials?.password) {
    return res.status(400).json({
      status: 'error',
      message: 'URL do post e credenciais são obrigatórios'
    });
  }

  try {
    // 1. Garantir que temos um browser ativo
    if (!browserInstance) {
      console.log('🌐 Iniciando navegador...');
      browserInstance = await puppeteer.launch({
        headless: true, // false para debug
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ]
      });
    }

    // 2. Fazer login se necessário
    const loginSuccess = await ensureLogin(botCredentials);
    if (!loginSuccess) {
      throw new Error('Falha no login da conta-bot');
    }

    // 3. Navegar para o post e extrair comentários
    const comments = await scrapeComments(postUrl);

    res.json({
      status: 'success',
      comments: comments,
      message: `✅ ${comments.length} comentários extraídos com sucesso!`,
      debug: {
        loginSuccess: true,
        pageLoaded: true,
        commentsFound: comments.length
      }
    });

  } catch (error) {
    console.error('❌ Erro no scraping:', error);
    
    res.status(500).json({
      status: 'error',
      message: `Erro durante o scraping: ${error.message}`,
      debug: {
        loginSuccess: false,
        pageLoaded: false,
        commentsFound: 0
      }
    });
  }
});

// Função para garantir login
async function ensureLogin(credentials) {
  try {
    // Verifica se já está logado (sessão válida há menos de 30 min)
    const now = Date.now();
    if (loggedInPage && lastLoginTime && (now - lastLoginTime) < 30 * 60 * 1000) {
      console.log('✅ Usando sessão existente');
      return true;
    }

    console.log('🔐 Fazendo login...');
    
    if (loggedInPage) {
      await loggedInPage.close();
    }

    loggedInPage = await browserInstance.newPage();
    
    // Configurar user agent
    await loggedInPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navegar para Instagram
    await loggedInPage.goto('https://www.instagram.com/accounts/login/', {
      waitUntil: 'networkidle2'
    });

    // Aguardar campos de login
    await loggedInPage.waitForSelector('input[name="username"]', { timeout: 10000 });

    // Preencher credenciais
    await loggedInPage.type('input[name="username"]', credentials.username, { delay: 100 });
    await loggedInPage.type('input[name="password"]', credentials.password, { delay: 100 });

    // Clicar em login
    await loggedInPage.click('button[type="submit"]');

    // Aguardar redirecionamento
    await loggedInPage.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });

    // Verificar se login foi bem-sucedido
    const currentUrl = loggedInPage.url();
    if (currentUrl.includes('/accounts/login/') || currentUrl.includes('/challenge/')) {
      throw new Error('Login falhou ou requer verificação adicional');
    }

    lastLoginTime = now;
    console.log('✅ Login realizado com sucesso');
    return true;

  } catch (error) {
    console.error('❌ Erro no login:', error);
    return false;
  }
}

// Função para fazer scraping dos comentários
async function scrapeComments(postUrl) {
  try {
    console.log('📱 Navegando para o post...');
    
    await loggedInPage.goto(postUrl, { waitUntil: 'networkidle2' });

    // Aguardar carregamento da página
    await loggedInPage.waitForSelector('article', { timeout: 10000 });

    console.log('⬇️ Rolando para carregar comentários...');

    // Rolar a página algumas vezes para carregar mais comentários
    for (let i = 0; i < 3; i++) {
      await loggedInPage.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('🔍 Extraindo comentários...');

    // Extrair comentários do DOM
    const comments = await loggedInPage.evaluate(() => {
      const commentElements = document.querySelectorAll('div[role="button"] span');
      const extractedComments = [];

      commentElements.forEach((element, index) => {
        if (index >= 20) return; // Limitar a 20 comentários

        const text = element.textContent?.trim();
        if (text && text.length > 5) { // Filtrar textos muito curtos
          
          // Tentar encontrar o username (estrutura pode variar)
          let username = 'user_' + index;
          const parentElement = element.closest('div');
          const usernameElement = parentElement?.querySelector('a');
          if (usernameElement) {
            username = usernameElement.textContent?.replace('@', '') || username;
          }

          extractedComments.push({
            username: username,
            text: text,
            timestamp: new Date().toISOString() // Em produção, extrair timestamp real
          });
        }
      });

      return extractedComments.slice(0, 20); // Garantir máximo de 20
    });

    console.log(`✅ ${comments.length} comentários extraídos`);
    return comments;

  } catch (error) {
    console.error('❌ Erro no scraping:', error);
    throw error;
  }
}

// Cleanup ao fechar
process.on('SIGINT', async () => {
  if (browserInstance) {
    await browserInstance.close();
  }
  process.exit();
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('📋 Endpoints disponíveis:');
  console.log('  POST /api/test-comments - Testar scraping de comentários');
});
