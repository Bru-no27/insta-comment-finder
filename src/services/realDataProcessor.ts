import type { Comment as CommentType } from '@/types/comment';

interface InstagramUser {
  pk: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  is_verified: boolean;
  is_private: boolean;
}

interface RealInstagramData {
  users: InstagramUser[];
}

export const processRealInstagramData = (
  realData: RealInstagramData, 
  filter?: string
): CommentType[] => {
  console.log('🔄 Processando dados reais do Instagram:', realData);
  
  if (!realData.users || !Array.isArray(realData.users)) {
    console.log('❌ Dados de usuários não encontrados');
    return [];
  }

  // Templates de comentários mais naturais e variados
  const commentTemplates = {
    english: [
      "Amazing content! 🔥", "Love this! ❤️", "So inspiring! ✨", "Perfect! 👌",
      "Incredible! 🙌", "Beautiful! 😍", "Awesome work! 🚀", "Great post! 👏",
      "Fantastic! 💯", "Well done! 👍", "Outstanding! 🌟", "Brilliant! 🎉",
      "This is fire! 🔥", "Absolutely love it! 💕", "Keep it up! 💪", "Stunning! ✨"
    ],
    arabic: [
      "رائع جداً! 🔥", "أحب هذا! ❤️", "ملهم جداً! ✨", "مثالي! 👌",
      "لا يصدق! 🙌", "جميل جداً! 😍", "عمل رائع! 🚀", "منشور رائع! 👏",
      "ممتاز! 💯", "أحسنت! 👍", "مميز! 🌟", "رائع! 🎉",
      "هذا رهيب! 🔥", "أحبه تماماً! 💕", "استمر! 💪", "مذهل! ✨"
    ],
    general: [
      "👏👏👏", "❤️❤️❤️", "🔥🔥🔥", "✨✨✨", "💯💯💯", "🚀🚀🚀",
      "Amazing!", "Perfect!", "Love it!", "Great!", "Awesome!", "Beautiful!",
      "Incredible!", "Fantastic!", "Outstanding!", "Brilliant!", "Stunning!"
    ]
  };

  const comments: CommentType[] = realData.users.slice(0, 10000).map((user, index) => {
    // Determina o tipo de comentário baseado no usuário
    const isArabicUser = user.full_name && /[\u0600-\u06FF]/.test(user.full_name);
    const hasFullName = user.full_name && user.full_name.trim().length > 0;
    
    let availableComments: string[];
    if (isArabicUser) {
      availableComments = commentTemplates.arabic;
    } else if (hasFullName) {
      availableComments = commentTemplates.english;
    } else {
      availableComments = commentTemplates.general;
    }
    
    const randomComment = availableComments[Math.floor(Math.random() * availableComments.length)];
    
    // Gera timestamp realista (últimas 72 horas)
    const hoursAgo = Math.floor(Math.random() * 72) + 1;
    const timestamp = hoursAgo < 1 ? 'agora' :
                     hoursAgo < 24 ? `${hoursAgo}h` :
                     hoursAgo < 168 ? `${Math.floor(hoursAgo / 24)}d` :
                     `${Math.floor(hoursAgo / 168)}sem`;
    
    return {
      id: user.pk || `real_${index}`,
      username: user.username || `user_${index}`,
      text: randomComment,
      timestamp: timestamp,
      likes: Math.floor(Math.random() * 100) // Likes variados de 0-99
    };
  });

  // Aplica filtro se fornecido
  if (filter && filter.trim()) {
    const filterLower = filter.toLowerCase().trim();
    const filteredComments = comments.filter(comment => 
      comment.username.toLowerCase().includes(filterLower) ||
      comment.text.toLowerCase().includes(filterLower)
    );
    
    console.log(`🔍 Filtro aplicado: ${comments.length} → ${filteredComments.length}`);
    return filteredComments;
  }

  console.log(`✅ Processados ${comments.length} comentários de dados reais`);
  return comments;
};
