
import type { BotAccount, BotPool } from './botConfig';
import { createBotPool, BOT_CONFIG } from './botConfig';

export class BotPoolManager {
  private static instance: BotPoolManager;
  private botPool: BotPool;

  private constructor() {
    this.botPool = createBotPool();
  }

  public static getInstance(): BotPoolManager {
    if (!BotPoolManager.instance) {
      BotPoolManager.instance = new BotPoolManager();
    }
    return BotPoolManager.instance;
  }

  // Seleciona próxima conta disponível
  public getAvailableBot(): BotAccount | null {
    const now = new Date();
    const availableBots = this.botPool.accounts.filter(bot => {
      if (!bot.isActive || bot.failCount >= bot.maxFails) return false;
      
      if (bot.lastUsed) {
        const timeSinceLastUse = now.getTime() - bot.lastUsed.getTime();
        return timeSinceLastUse >= this.botPool.minDelayBetweenUses;
      }
      
      return true;
    });

    if (availableBots.length === 0) {
      console.log('⚠️ Nenhuma conta bot disponível no momento');
      return null;
    }

    // Seleciona a conta que foi usada há mais tempo
    const selectedBot = availableBots.sort((a, b) => {
      if (!a.lastUsed) return -1;
      if (!b.lastUsed) return 1;
      return a.lastUsed.getTime() - b.lastUsed.getTime();
    })[0];

    selectedBot.lastUsed = now;
    console.log(`🤖 Selecionada conta bot: ${selectedBot.id}`);
    
    return selectedBot;
  }

  // Marca conta como com falha
  public markBotFailed(botId: string): void {
    const bot = this.botPool.accounts.find(b => b.id === botId);
    if (bot) {
      bot.failCount++;
      console.log(`❌ Conta ${botId} falhou (${bot.failCount}/${bot.maxFails})`);
      
      if (bot.failCount >= bot.maxFails) {
        bot.isActive = false;
        console.log(`🚫 Conta ${botId} desativada por excesso de falhas`);
      }
    }
  }

  // Reset contador de falhas (quando funciona)
  public markBotSuccess(botId: string): void {
    const bot = this.botPool.accounts.find(b => b.id === botId);
    if (bot) {
      bot.failCount = 0;
      console.log(`✅ Conta ${botId} funcionou corretamente`);
    }
  }

  // Reativa conta após cooldown
  public reactivateBot(botId: string): void {
    const bot = this.botPool.accounts.find(b => b.id === botId);
    if (bot) {
      bot.isActive = true;
      bot.failCount = 0;
      console.log(`🔄 Conta ${botId} reativada`);
    }
  }

  // Status do pool
  public getPoolStatus() {
    const total = this.botPool.accounts.length;
    const active = this.botPool.accounts.filter(b => b.isActive).length;
    const available = this.botPool.accounts.filter(b => {
      if (!b.isActive) return false;
      if (!b.lastUsed) return true;
      
      const now = new Date();
      const timeSinceLastUse = now.getTime() - b.lastUsed.getTime();
      return timeSinceLastUse >= this.botPool.minDelayBetweenUses;
    }).length;

    return {
      total,
      active,
      available,
      inCooldown: active - available
    };
  }
}
