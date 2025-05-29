
import type { InstagramComment } from './types';

// Gerador de dados ultra-realistas para demonstração
export class RealisticDemoGenerator {
  private static readonly REALISTIC_USERNAMES = [
    'mari_silva2024', 'carlos.santos_', 'ana_costa_oficial', 'pedro_oliveira23', 'julia.ferreira',
    'lucas_batista_', 'camila.souza', 'rafael_lima_br', 'bianca.gomes23', 'thiago_alves_',
    'larissa.rocha', 'felipe_martins', 'amanda_reis_', 'gustavo.silva2024', 'isabela_santos',
    'rodrigo.costa_', 'fernanda_lima', 'bruno.santos_br', 'carolina_oliveira', 'daniel_souza23',
    'melissa_carvalho', 'victor.nunes', 'patricia_mendes', 'leonardo_dias', 'natalia.rodrigues',
    'andre_pereira_', 'vanessa.lima', 'ricardo_santos', 'priscila.costa', 'eduardo_silva23'
  ];

  private static readonly REALISTIC_COMMENTS = [
    'Que foto incrível! 😍 Amei demais!', 'Perfeita como sempre! ✨💕', 'Que lugar maravilhoso! 🌟',
    'Você está radiante! 💫', 'Inspiração total! 🔥', 'Que beleza! 😍',
    'Amando esse conteúdo! 👏', 'Que energia boa! ✨', 'Você arrasa sempre! 💪',
    'Que foto maravilhosa! 📸', 'Perfeição define! 💯', 'Que sorriso lindo! 😊',
    'Linda demais! 💖', 'Você é uma inspiração! 🌟', 'Que momento especial! 💕',
    'Que lugar paradisíaco! 🏝️', 'Deslumbrante! ✨', 'Que post incrível! 👌',
    'Amando essa vibe! 🌈', 'Energia positiva! ☀️', 'Você é incrível! 💫',
    'Que beleza natural! 🌸', 'Perfeito! 👏', 'Momento único! 📷',
    'Você brilha! ⭐', 'Que inspiração! 💪', 'Amei essa foto! 😍',
    'Lugar lindo! 🌺', 'Você é luz! ✨', 'Que trabalho incrível! 🎨',
    'Parabéns! 🎉', 'Sucesso sempre! 🚀', 'Que talento! 🎭',
    'Maravilhosa! 💎', 'Top demais! 🔝', 'Que estilo! 👗',
    'Arrasou! 💅', 'Que produção! 📽️', 'Espetacular! 🎪',
    'Que conquista! 🏆', 'Muito orgulho! 🥹', 'Merecido! 👑'
  ];

  private static readonly EMOJIS = [
    '😍', '💕', '✨', '🔥', '👏', '💯', '🌟', '💫', '😊', '💖',
    '🌈', '☀️', '⭐', '💪', '📸', '🎉', '🚀', '💎', '🔝', '👑'
  ];

  public static generateRealisticComments(count: number = 25, filter?: string): InstagramComment[] {
    const comments: InstagramComment[] = [];
    
    for (let i = 0; i < count; i++) {
      const username = this.getRandomUsername();
      const text = this.getRandomComment();
      const timestamp = this.getRandomTimestamp();
      const likes = this.getRandomLikes();
      
      comments.push({
        id: `demo_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
        username,
        text,
        timestamp,
        likes
      });
    }

    // Aplica filtro se fornecido
    if (filter?.trim()) {
      const filterLower = filter.toLowerCase();
      return comments.filter(comment => 
        comment.username.toLowerCase().includes(filterLower) ||
        comment.text.toLowerCase().includes(filterLower)
      );
    }

    return comments;
  }

  private static getRandomUsername(): string {
    return this.REALISTIC_USERNAMES[Math.floor(Math.random() * this.REALISTIC_USERNAMES.length)];
  }

  private static getRandomComment(): string {
    const baseComment = this.REALISTIC_COMMENTS[Math.floor(Math.random() * this.REALISTIC_COMMENTS.length)];
    
    // 40% de chance de adicionar emoji extra
    if (Math.random() < 0.4) {
      const emoji = this.EMOJIS[Math.floor(Math.random() * this.EMOJIS.length)];
      return `${baseComment} ${emoji}`;
    }
    
    return baseComment;
  }

  private static getRandomTimestamp(): string {
    const now = new Date();
    const minutesAgo = Math.floor(Math.random() * 43200); // Últimas 30 dias em minutos
    
    if (minutesAgo < 60) {
      return `${minutesAgo}m`;
    } else if (minutesAgo < 1440) {
      const hours = Math.floor(minutesAgo / 60);
      return `${hours}h`;
    } else if (minutesAgo < 10080) {
      const days = Math.floor(minutesAgo / 1440);
      return `${days}d`;
    } else {
      const weeks = Math.floor(minutesAgo / 10080);
      return `${weeks}w`;
    }
  }

  private static getRandomLikes(): number {
    // Distribuição mais realista de curtidas
    const rand = Math.random();
    if (rand < 0.6) {
      return Math.floor(Math.random() * 10) + 1; // 1-10 curtidas (60%)
    } else if (rand < 0.85) {
      return Math.floor(Math.random() * 40) + 11; // 11-50 curtidas (25%)
    } else if (rand < 0.95) {
      return Math.floor(Math.random() * 100) + 51; // 51-150 curtidas (10%)
    } else {
      return Math.floor(Math.random() * 400) + 151; // 151-550 curtidas (5%)
    }
  }
}
