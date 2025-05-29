
require('dotenv').config();
const InstagramScraper = require('./scrapers/InstagramScraper');

async function testScraper() {
  console.log('🧪 Testando Instagram Scraper...');
  
  const scraper = new InstagramScraper({
    username: process.env.BOT_USERNAME,
    password: process.env.BOT_PASSWORD,
    headless: false, // Mostrar navegador para debug
    maxComments: 20
  });

  try {
    // URL de teste - substitua por uma URL real
    const testUrl = 'https://www.instagram.com/p/EXEMPLO/';
    
    console.log('🔗 URL de teste:', testUrl);
    console.log('👤 Username:', process.env.BOT_USERNAME);
    
    const result = await scraper.scrapeComments(testUrl);
    
    console.log('\n✅ RESULTADO DO TESTE:');
    console.log('📊 Total de comentários:', result.comments.length);
    console.log('🔐 Login sucesso:', result.loginSuccess);
    console.log('📄 Página carregada:', result.pageLoaded);
    
    if (result.comments.length > 0) {
      console.log('\n📝 PRIMEIROS COMENTÁRIOS:');
      result.comments.slice(0, 5).forEach((comment, index) => {
        console.log(`${index + 1}. @${comment.username}: ${comment.text}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  } finally {
    await scraper.close();
    console.log('🏁 Teste finalizado');
  }
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testScraper();
}

module.exports = testScraper;
