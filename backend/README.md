
# Backend Instagram Scraper - Puppeteer Real

Backend Node.js com Puppeteer para scraping **REAL** de comentários do Instagram usando conta-bot.

## 🚀 Instalação e Configuração

### 1. Preparar o Ambiente

```bash
# Criar diretório do backend
mkdir backend
cd backend

# Copiar os arquivos deste projeto para a pasta backend/

# Instalar dependências
npm install
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env` com suas credenciais:

```env
# Conta Instagram dedicada para bot
BOT_USERNAME=sua_conta_bot
BOT_PASSWORD=sua_senha_bot

# Configurações do servidor
PORT=3001
NODE_ENV=development
```

### 3. Testar o Scraper

```bash
# Teste isolado (com navegador visível)
npm run test

# Ou executar o servidor
npm run dev
```

## 🔧 Como Usar

### Via Frontend (Recomendado)
1. Inicie o backend: `npm run dev`
2. Use a interface web no frontend
3. Cole uma URL de post do Instagram
4. Clique em "Testar Scraping"

### Via cURL (Debug)
```bash
curl -X POST http://localhost:3001/api/test-comments \
  -H "Content-Type: application/json" \
  -d '{
    "postUrl": "https://www.instagram.com/p/CODIGO_DO_POST/"
  }'
```

## 📋 Funcionalidades

### ✅ O que funciona:
- **Login automático** com conta-bot
- **Scraping real** de comentários via Puppeteer
- **Anti-detecção** com puppeteer-extra-plugin-stealth
- **Rate limiting** para proteger contra abuse
- **Sessão persistente** (evita re-logins desnecessários)
- **Scroll automático** para carregar mais comentários
- **Extração completa** de username, texto, timestamp, likes

### 🔒 Recursos de Segurança:
- Headers de navegador real
- Delays humanizados
- Rate limiting por IP
- Validação de entrada
- CORS configurado
- Helmet para segurança

## 🛠 Arquitetura

```
backend/
├── .env                     # Configurações
├── server.js               # Servidor Express
├── package.json            # Dependências
├── test-scraper.js         # Teste isolado
└── scrapers/
    └── InstagramScraper.js # Classe principal
```

## 🐛 Troubleshooting

### Erro de Login:
- Verifique se a conta está ativa
- Teste login manual no navegador
- Verifique se não há 2FA ativo
- Use conta dedicada (não sua conta principal)

### Comentários não aparecem:
- Verifique se o post é público
- Aguarde mais tempo para carregamento
- Teste com posts que têm muitos comentários

### Performance:
- Execute em `NODE_ENV=production` para headless
- Use `headless: false` apenas para debug
- Monitore uso de RAM com muitos requests

## ⚠️ Importante

- **Use conta dedicada** para bot (não sua conta principal)
- **Respeite rate limits** do Instagram
- **Monitore logs** para detectar problemas
- **Teste regularmente** pois Instagram muda estrutura

## 📊 Logs Detalhados

O sistema gera logs completos:
```
🚀 Servidor rodando em http://localhost:3001
🌐 Inicializando navegador...
🔐 Fazendo login no Instagram...
📱 Navegando para o post...
⬇️ Rolando para carregar comentários...
🔍 Extraindo comentários...
✅ 45 comentários extraídos
```

## 🔄 Próximos Passos

1. **Configure sua conta-bot** no `.env`
2. **Teste com posts públicos** primeiro
3. **Monitore performance** e ajuste delays
4. **Implemente cache** se necessário
5. **Configure proxy** para scale (opcional)
