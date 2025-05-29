
export interface BotAccount {
  id: string;
  username: string;
  password: string;
  isActive: boolean;
  lastUsed: Date | null;
  proxy?: string;
  sessionFile?: string;
  failCount: number;
  maxFails: number;
}

export interface BotPool {
  accounts: BotAccount[];
  currentIndex: number;
  minDelayBetweenUses: number; // ms
}

export const BOT_CONFIG = {
  maxRetries: 3,
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
  minDelayBetweenAccounts: 5 * 60 * 1000, // 5 minutos
  maxCommentsPerRequest: 500,
  scrollDelay: 2000, // delay entre scrolls
  maxScrollAttempts: 20,
  
  // Headers para simular navegador real
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ],
  
  // Configurações do Puppeteer
  puppeteerOptions: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
};

// Pool de contas bot - CONFIGURAR COM SUAS CONTAS REAIS
export const createBotPool = (): BotPool => ({
  accounts: [
    {
      id: 'bot1',
      username: 'SEU_BOT_USERNAME_1', // ⚠️ CONFIGURE AQUI
      password: 'SEU_BOT_PASSWORD_1', // ⚠️ CONFIGURE AQUI
      isActive: true,
      lastUsed: null,
      proxy: '', // opcional: 'proxy1.exemplo.com:8080'
      failCount: 0,
      maxFails: 3
    },
    {
      id: 'bot2',
      username: 'SEU_BOT_USERNAME_2', // ⚠️ CONFIGURE AQUI
      password: 'SEU_BOT_PASSWORD_2', // ⚠️ CONFIGURE AQUI
      isActive: true,
      lastUsed: null,
      proxy: '', // opcional: 'proxy2.exemplo.com:8080'
      failCount: 0,
      maxFails: 3
    }
    // Adicione mais contas conforme necessário
  ],
  currentIndex: 0,
  minDelayBetweenUses: 5 * 60 * 1000 // 5 minutos
});
