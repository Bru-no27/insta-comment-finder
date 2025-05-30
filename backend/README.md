
# 🚀 Instagram Comment Finder - Backend

Backend Node.js com Puppeteer para scraping **REAL** de comentários do Instagram usando conta-bot.

## 📋 Funcionalidades

- ✅ **API REST** completa com Express.js
- ✅ **Scraping real** de comentários via Puppeteer
- ✅ **Anti-detecção** com puppeteer-extra-plugin-stealth
- ✅ **Rate limiting** para proteger contra abuse
- ✅ **CORS configurado** para frontend
- ✅ **Deploy automático** no Railway/Render

## 🚀 Deploy Rápido

### Railway (Recomendado)

1. **Conecte o repositório:**
   ```bash
   # No Railway Dashboard
   - New Project → Deploy from GitHub
   - Selecione seu repositório
   ```

2. **Configure variáveis de ambiente:**
   ```env
   BOT_USERNAME=sua_conta_instagram_bot
   BOT_PASSWORD=sua_senha_bot
   NODE_ENV=production
   RATE_LIMIT_MAX_REQUESTS=10
   RATE_LIMIT_WINDOW=900000
   MAX_COMMENTS=100
   SCROLL_DELAY=2000
   CORS_ORIGINS=https://seuapp.lovableproject.com
   ```

3. **Deploy automático:**
   - Railway detecta automaticamente que é Node.js
   - Executa `npm install` e `npm start`
   - Gera URL única: `https://seuapp.up.railway.app`

### Render (Alternativa)

1. **Conecte repositório no Render**
2. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`
3. **Adicione as mesmas variáveis de ambiente**

## 🏃‍♂️ Rodar Localmente

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar ambiente
```bash
# Criar arquivo .env
cp .env.example .env

# Editar com suas credenciais
BOT_USERNAME=sua_conta_bot
BOT_PASSWORD=sua_senha_bot
PORT=3001
NODE_ENV=development
```

### 3. Iniciar servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

### 4. Testar API
```bash
# Verificar se está funcionando
curl http://localhost:3001/

# Resposta esperada:
{
  "status": "API running",
  "service": "Instagram Comment Finder",
  "version": "1.0.0"
}
```

## 🔧 Endpoints da API

### `GET /`
**Descrição:** Status da API  
**Resposta:** Informações básicas do serviço

### `GET /api/health`
**Descrição:** Health check detalhado  
**Resposta:** Status do sistema, uptime, memória

### `POST /api/instagram-comments`
**Descrição:** Extrair comentários de post do Instagram  
**Body:**
```json
{
  "postUrl": "https://www.instagram.com/p/CODIGO_DO_POST/"
}
```

**Resposta de sucesso:**
```json
{
  "status": "success",
  "comments": [
    {
      "id": "comment_1",
      "username": "usuario1",
      "text": "Que legal!",
      "timestamp": "2024-01-01T10:00:00Z",
      "likes": 5
    }
  ],
  "totalFound": 1,
  "message": "✅ 1 comentários extraídos com sucesso!"
}
```

## ⚙️ Variáveis de Ambiente

| Variável | Obrigatória | Padrão | Descrição |
|----------|------------|--------|-----------|
| `BOT_USERNAME` | ✅ | - | Username da conta Instagram bot |
| `BOT_PASSWORD` | ✅ | - | Senha da conta Instagram bot |
| `PORT` | ❌ | 3001 | Porta do servidor |
| `NODE_ENV` | ❌ | development | Ambiente (development/production) |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ | 10 | Máximo de requests por janela |
| `RATE_LIMIT_WINDOW` | ❌ | 900000 | Janela de rate limit (ms) |
| `MAX_COMMENTS` | ❌ | 100 | Máximo de comentários por request |
| `SCROLL_DELAY` | ❌ | 2000 | Delay entre scrolls (ms) |
| `CORS_ORIGINS` | ❌ | localhost | Origins permitidos (separados por vírgula) |

## 🔒 Segurança

### Conta Bot Instagram
- ✅ Use uma conta dedicada (não sua conta principal)
- ✅ Deixe o perfil público
- ✅ Adicione algumas fotos e seguidores para parecer real
- ⚠️ Não use 2FA (Two-Factor Authentication)

### Rate Limiting
- 10 requests por 15 minutos por IP (padrão)
- Configurável via variáveis de ambiente
- Headers de retry incluídos nas respostas

## 🛠️ Troubleshooting

### ❌ Erro de Login
```
Credenciais do bot não configuradas
```
**Solução:** Verifique se `BOT_USERNAME` e `BOT_PASSWORD` estão configurados

### ❌ Erro de CORS
```
Not allowed by CORS
```
**Solução:** Adicione sua URL frontend em `CORS_ORIGINS`

### ❌ Rate Limit
```
Muitas requisições
```
**Solução:** Aguarde o tempo indicado no header `Retry-After`

### ❌ Scraping falha
```
Erro ao extrair comentários
```
**Possíveis causas:**
- Post privado ou inexistente
- Instagram bloqueou a conta bot temporariamente
- Delay muito baixo (aumente `SCROLL_DELAY`)

## 📊 Monitoramento

### Logs importantes:
```bash
🚀 Servidor rodando em http://localhost:3001
🤖 Instagram Scraper inicializado
📱 Nova requisição de scraping recebida
✅ 45 comentários extraídos
```

### Metrics endpoint:
```bash
curl https://seuapp.up.railway.app/api/health
```

## 🚀 Integração com Frontend

No seu app Lovable, configure a URL do backend:

```typescript
// src/services/externalBackendApi.ts
const baseUrl = 'https://seuapp.up.railway.app';
```

## 📝 Próximos Passos

1. ✅ **Deploy funcionando** - API responde em `/`
2. ✅ **Configurar bot** - Adicionar credenciais do Instagram
3. ✅ **Testar scraping** - Usar endpoint `/api/instagram-comments`
4. ✅ **Monitorar logs** - Verificar se tudo está funcionando
5. ✅ **Conectar frontend** - Atualizar URL da API

## 💰 Custos

- **Railway:** Plano gratuito com 500h/mês
- **Render:** Plano gratuito com sleep após inatividade

Para uso intenso, considere planos pagos.

---

**🎯 Pronto para usar!** Depois do deploy, teste com `GET /` e configure as credenciais do bot.
