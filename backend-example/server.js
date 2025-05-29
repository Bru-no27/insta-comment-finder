
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3001;

let browserInstance = null;
let loggedInPage = null;
let lastLoginTime = null;

app.use(cors());
app.use(express.json());

// Login na conta bot
async function loginInstagram() {
  const credentials = {
    username: process.env.BOT_USERNAME,
    password: process.env.BOT_PASSWORD
  };

  try {
    if (!browserInstance) {
      browserInstance = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browserInstance.newPage();
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });

    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', credentials.username, { delay: 100 });
    await page.type('input[name="password"]', credentials.password, { delay: 100 });

    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const currentUrl = page.url();
    if (currentUrl.includes('/accounts/login/') || currentUrl.includes('/challenge/')) {
      throw new Error('Login falhou ou requer verificação adicional');
    }

    loggedInPage = page;
    lastLoginTime = new Date();
    console.log('✅ Login realizado com sucesso');
    return true;

  } catch (error) {
    console.error('❌ Erro no login:', error.message);
    return false;
  }
}

// Scraping dos comentários
async function scrapeComments(postUrl) {
  try {
    console.log('📱 Indo para o post...');
    await loggedInPage.goto(postUrl, { waitUntil: 'networkidle2' });

    await loggedInPage.waitForSelector('article', { timeout: 10000 });

    for (let i = 0; i < 3; i++) {
      await loggedInPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 1500));
    }

    console.log('🔍 Extraindo comentários...');
    const comments = await loggedInPage.evaluate(() => {
      const commentNodes = document.querySelectorAll('ul ul span');
      return Array.from(commentNodes)
        .map(el => el.textContent)
        .filter(text => text && text.length > 5)
        .slice(0, 20);
    });

    console.log(`✅ ${comments.length} comentários extraídos`);
    return comments;

  } catch (error) {
    console.error('❌ Erro ao extrair comentários:', error.message);
    throw error;
  }
}

// Rota principal
app.post('/api/test-comments', async (req, res) => {
  const { postUrl } = req.body;

  if (!postUrl) {
    return res.status(400).json({ error: 'URL do post é obrigatória.' });
  }

  if (!loggedInPage || (new Date() - lastLoginTime) > 1000 * 60 * 15) {
    console.log('🔐 Reautenticando...');
    const success = await loginInstagram();
    if (!success) {
      return res.status(500).json({ error: 'Falha ao logar no Instagram' });
    }
  }

  try {
    const comments = await scrapeComments(postUrl);
    res.json({ comments });
  } catch (err) {
    res.status(500).json({ error: 'Erro no scraping' });
  }
});

// Cleanup
process.on('SIGINT', async () => {
  if (browserInstance) await browserInstance.close();
  process.exit();
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
