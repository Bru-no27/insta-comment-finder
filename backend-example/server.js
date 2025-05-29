
require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/api/test-comments', async (req, res) => {
  const { postUrl } = req.body;
  const username = process.env.BOT_USERNAME;
  const password = process.env.BOT_PASSWORD;

  if (!username || !password) {
    return res.status(400).json({ error: 'Credenciais não configuradas.' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: false, // true em produção
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    console.log('🔐 Fazendo login...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[name="username"]');

    await page.type('input[name="username"]', username, { delay: 50 });
    await page.type('input[name="password"]', password, { delay: 50 });
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✅ Login feito');

    console.log('➡️ Indo para o post...');
    await page.goto(postUrl, { waitUntil: 'networkidle2' });

    await page.waitForSelector('ul ul', { timeout: 10000 });

    const comments = await page.$$eval('ul ul span', spans =>
      spans.map(span => span.textContent).filter(Boolean)
    );

    await browser.close();
    res.json({ comments });
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).json({ error: 'Erro ao buscar comentários.' });
  }
});

app.listen(3001, () => {
  console.log('🚀 Servidor rodando em http://localhost:3001');
});
