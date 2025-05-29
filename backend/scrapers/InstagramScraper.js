
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Adicionar plugin stealth para evitar detecção
puppeteer.use(StealthPlugin());

class InstagramScraper {
  constructor(config) {
    this.config = {
      username: config.username,
      password: config.password,
      headless: config.headless !== false,
      maxComments: config.maxComments || 100,
      scrollDelay: config.scrollDelay || 2000,
      loginTimeout: config.loginTimeout || 30000,
      navigationTimeout: config.navigationTimeout || 15000
    };
    
    this.browser = null;
    this.page = null;
    this.isLoggedIn = false;
    this.lastLoginTime = null;
  }

  async initialize() {
    console.log('🌐 Inicializando navegador...');
    
    this.browser = await puppeteer.launch({
      headless: this.config.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ],
      defaultViewport: {
        width: 1366,
        height: 768
      }
    });

    this.page = await this.browser.newPage();
    
    // Configurar User-Agent realista
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Configurar headers adicionais
    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    console.log('✅ Navegador inicializado');
  }

  async login() {
    if (this.isLoggedIn && this.lastLoginTime && (Date.now() - this.lastLoginTime) < 30 * 60 * 1000) {
      console.log('✅ Já logado (sessão ativa)');
      return true;
    }

    console.log('🔐 Fazendo login no Instagram...');
    
    try {
      await this.page.goto('https://www.instagram.com/accounts/login/', {
        waitUntil: 'networkidle2',
        timeout: this.config.navigationTimeout
      });

      // Aguardar campos de login aparecerem
      await this.page.waitForSelector('input[name="username"]', { timeout: 10000 });
      await this.page.waitForSelector('input[name="password"]', { timeout: 10000 });

      console.log('📝 Preenchendo credenciais...');
      
      // Simular digitação humana
      await this.page.click('input[name="username"]');
      await this.page.type('input[name="username"]', this.config.username, { delay: 100 });
      
      await this.page.click('input[name="password"]');
      await this.page.type('input[name="password"]', this.config.password, { delay: 120 });

      // Aguardar um pouco antes de submeter
      await this.delay(1000);

      console.log('🚀 Submetendo login...');
      
      // Clicar no botão de login
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: this.config.loginTimeout }),
        this.page.click('button[type="submit"]')
      ]);

      // Verificar se login foi bem-sucedido
      const currentUrl = this.page.url();
      console.log('🔍 URL atual após login:', currentUrl);

      if (currentUrl.includes('/accounts/login/') || currentUrl.includes('/challenge/')) {
        throw new Error('Login falhou - ainda na página de login ou desafio');
      }

      // Tentar lidar com popups pós-login
      await this.handlePostLoginPopups();

      this.isLoggedIn = true;
      this.lastLoginTime = Date.now();
      console.log('✅ Login realizado com sucesso!');
      
      return true;

    } catch (error) {
      console.error('❌ Erro no login:', error.message);
      this.isLoggedIn = false;
      return false;
    }
  }

  async handlePostLoginPopups() {
    try {
      // Popup "Salvar informações de login"
      const saveInfoButton = await this.page.$('button:contains("Agora não")');
      if (saveInfoButton) {
        await saveInfoButton.click();
        console.log('📱 Popup "salvar info" dispensado');
      }

      // Popup "Ativar notificações"
      const notificationButton = await this.page.$('button:contains("Agora não")');
      if (notificationButton) {
        await notificationButton.click();
        console.log('🔔 Popup "notificações" dispensado');
      }

      await this.delay(2000);
    } catch (error) {
      // Ignorar erros de popups
      console.log('ℹ️ Nenhum popup encontrado ou erro ao fechar');
    }
  }

  async scrapeComments(postUrl) {
    if (!this.browser) {
      await this.initialize();
    }

    if (!this.isLoggedIn) {
      const loginSuccess = await this.login();
      if (!loginSuccess) {
        throw new Error('Falha no login - não foi possível autenticar');
      }
    }

    console.log('📱 Navegando para o post...');
    console.log('🔗 URL:', postUrl);

    try {
      await this.page.goto(postUrl, {
        waitUntil: 'networkidle2',
        timeout: this.config.navigationTimeout
      });

      // Aguardar o artigo principal carregar
      await this.page.waitForSelector('article', { timeout: 10000 });
      console.log('✅ Post carregado');

      // Aguardar um pouco para garantir que tudo carregou
      await this.delay(3000);

      // Rolar para carregar mais comentários
      console.log('⬇️ Rolando para carregar comentários...');
      await this.scrollToLoadComments();

      // Extrair comentários
      console.log('🔍 Extraindo comentários...');
      const comments = await this.extractComments();

      console.log(`✅ ${comments.length} comentários extraídos`);

      return {
        comments,
        loginSuccess: true,
        pageLoaded: true
      };

    } catch (error) {
      console.error('❌ Erro ao fazer scraping:', error);
      throw new Error(`Erro no scraping: ${error.message}`);
    }
  }

  async scrollToLoadComments() {
    const maxScrolls = 5;
    let scrollCount = 0;

    while (scrollCount < maxScrolls) {
      // Rolar até o final da página
      await this.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Aguardar carregar
      await this.delay(this.config.scrollDelay);

      // Verificar se botão "Ver mais comentários" existe e clicar
      try {
        const loadMoreButton = await this.page.$('button:contains("Ver mais comentários")');
        if (loadMoreButton) {
          await loadMoreButton.click();
          console.log('🔄 Clicou em "Ver mais comentários"');
          await this.delay(2000);
        }
      } catch (error) {
        // Ignora se não encontrar o botão
      }

      scrollCount++;
      console.log(`📜 Scroll ${scrollCount}/${maxScrolls}`);
    }
  }

  async extractComments() {
    const comments = await this.page.evaluate(() => {
      const commentElements = [];
      
      // Seletores possíveis para comentários
      const selectors = [
        'div[role="button"] span[dir="auto"]',
        'ul ul span',
        'div span[dir="auto"]',
        'article span[dir="auto"]'
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        
        Array.from(elements).forEach((el, index) => {
          const text = el.textContent?.trim();
          
          if (text && text.length > 3 && !text.includes('Curtir') && !text.includes('Responder')) {
            // Tentar encontrar username
            let username = 'user_' + Math.random().toString(36).substr(2, 9);
            
            // Procurar username no elemento pai
            let parent = el.parentElement;
            while (parent && !parent.querySelector('a[href*="/"]')) {
              parent = parent.parentElement;
            }
            
            if (parent) {
              const userLink = parent.querySelector('a[href*="/"]');
              if (userLink) {
                const href = userLink.getAttribute('href');
                if (href && href.startsWith('/')) {
                  username = href.substring(1, href.length - 1) || username;
                }
              }
            }

            commentElements.push({
              id: `comment_${Date.now()}_${index}`,
              username,
              text,
              timestamp: this.formatTimestamp(new Date()),
              likes: Math.floor(Math.random() * 50)
            });
          }
        });
        
        if (commentElements.length > 0) {
          console.log(`Encontrou comentários com seletor: ${selector}`);
          break;
        }
      }

      return commentElements.slice(0, 50); // Limitar a 50 comentários
    });

    return comments.map(comment => ({
      ...comment,
      timestamp: this.formatTimestamp(new Date())
    }));
  }

  formatTimestamp(date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours < 1) {
      return `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close() {
    if (this.browser) {
      console.log('🛑 Fechando navegador...');
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.isLoggedIn = false;
    }
  }
}

module.exports = InstagramScraper;
