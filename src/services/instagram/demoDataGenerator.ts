
import type { InstagramComment } from './types';

// Gerador de dados de demonstração mais realistas
export class RealisticDemoGenerator {
  private static readonly BRAZILIAN_USERNAMES = [
    'mari_silva23', 'carlos_santos', 'ana.costa', 'pedro_oliveira', 'julia.ferreira',
    'lucas_batista', 'camila.souza', 'rafael_lima', 'bianca.gomes', 'thiago_alves',
    'larissa.rocha', 'felipe_martins', 'amanda_reis', 'gustavo.silva', 'isabela_santos',
    'rodrigo.costa', 'fernanda_lima', 'bruno.santos', 'carolina_oliveira', 'daniel_souza'
  ];

  private static readonly REALISTIC_COMMENTS = [
    'Que foto linda! 😍', 'Amei esse look! 💕', 'Perfeita como sempre! ✨',
    'Que lugar incrível! 🌟', 'Você está radiante! 💫', 'Inspiração total! 🔥',
    'Que beleza! 😍💕', 'Amando esse conteúdo! 👏', 'Que energia boa! ✨',
    'Você arrasa sempre! 💪', 'Que foto maravilhosa! 📸', 'Perfeição define! 💯',
    'Que sorriso lindo! 😊', 'Amei demais! 💖', 'Você é uma inspiração! 🌟',
    'Que momento especial! 💕', 'Que lugar paradisíaco! 🏝️', 'Você está deslumbrante! ✨',
    'Que post incrível! 👌', 'Amando essa vibe! 🌈', 'Que energia positiva! ☀️',
    'Você é incrível! 💫', 'Que beleza natural! 🌸', 'Perfeito! 👏',
    'Que momento único! 📷', 'Você brilha! ⭐', 'Que inspiração! 💪',
    'Amei essa foto! 😍', 'Que lugar lindo! 🌺', 'Você é luz! ✨'
  ];

  private static readonly EMOJIS = ['😍', '💕', '✨', '🔥', '👏', '💯', '🌟', '💫', '😊', '💖', '🌈', '☀️', '⭐', '💪', '📸'];

  public static generateRealisticComments(count: number = 20, filter?: string): InstagramComment[] {
    const comments: InstagramComment[] = [];
    
    for (let i = 0; i < count; i++) {
      const username = this.getRandomUsername();
      const text = this.getRandomComment();
      const timestamp = this.getRandomTimestamp();
      const likes = Math.floor(Math.random() * 100) + 1;
      
      comments.push({
        id: `demo_${Date.now()}_${i}`,
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
    return this.BRAZILIAN_USERNAMES[Math.floor(Math.random() * this.BRAZILIAN_USERNAMES.length)];
  }

  private static getRandomComment(): string {
    const baseComment = this.REALISTIC_COMMENTS[Math.floor(Math.random() * this.REALISTIC_COMMENTS.length)];
    
    // 30% de chance de adicionar emoji extra
    if (Math.random() < 0.3) {
      const emoji = this.EMOJIS[Math.floor(Math.random() * this.EMOJIS.length)];
      return `${baseComment} ${emoji}`;
    }
    
    return baseComment;
  }

  private static getRandomTimestamp(): string {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30); // Últimos 30 dias
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    
    const commentDate = new Date(now);
    commentDate.setDate(commentDate.getDate() - daysAgo);
    commentDate.setHours(commentDate.getHours() - hoursAgo);
    commentDate.setMinutes(commentDate.getMinutes() - minutesAgo);
    
    if (daysAgo === 0) {
      if (hoursAgo === 0) {
        return `${minutesAgo}m`;
      }
      return `${hoursAgo}h`;
    } else if (daysAgo === 1) {
      return '1d';
    } else if (daysAgo < 7) {
      return `${daysAgo}d`;
    } else {
      const weeks = Math.floor(daysAgo / 7);
      return `${weeks}w`;
    }
  }
}
