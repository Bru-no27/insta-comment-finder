
# 🚀 Instruções de Deploy - Instagram Scraper Backend

## 📍 Opção 1: Railway.app (Recomendado)

### Passo a passo:

1. **Acesse https://railway.app**
   - Crie conta com Google/GitHub

2. **Novo Projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"

3. **Upload do Código**
   - Faça upload da pasta `backend/` para um repositório GitHub
   - Conecte o repositório no Railway

4. **Configurar Variáveis de Ambiente**
   No painel do Railway, vá em "Variables" e adicione:
   ```
   BOT_USERNAME=sua_conta_bot_instagram
   BOT_PASSWORD=sua_senha_bot_instagram
   NODE_ENV=production
   RATE_LIMIT_MAX_REQUESTS=10
   RATE_LIMIT_WINDOW=900000
   MAX_COMMENTS=100
   SCROLL_DELAY=2000
   CORS_ORIGINS=https://seuapp.lovableproject.com
   ```

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build finalizar
   - Copie a URL gerada (ex: `https://seuapp.up.railway.app`)

## 📍 Opção 2: Render.com

### Passo a passo:

1. **Acesse https://render.com**
   - Crie conta

2. **Novo Web Service**
   - Clique em "New +" > "Web Service"
   - Conecte seu repositório GitHub

3. **Configurações**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Variáveis de Ambiente**
   Adicione as mesmas variáveis do Railway

5. **Deploy**
   - Clique em "Create Web Service"
   - Copie a URL gerada

## 🔧 Configurar Frontend na Lovable

Após o deploy, configure a URL do backend na Lovable:

1. **Criar arquivo .env.local**
   ```
   VITE_BACKEND_URL=https://sua-url-do-railway-ou-render.com
   ```

2. **Testar Conexão**
   - Acesse seu app na Lovable
   - Teste com uma URL do Instagram
   - Verifique os logs no Railway/Render

## ⚠️ Credenciais do Bot

**IMPORTANTE**: Use uma conta Instagram dedicada para bot:

1. Crie uma conta Instagram nova
2. Deixe o perfil público
3. Siga algumas contas para parecer real
4. Use essas credenciais nas variáveis de ambiente

## 🛠️ Troubleshooting

### Erro de CORS
- Verifique se `CORS_ORIGINS` inclui sua URL da Lovable

### Erro de Login
- Verifique se `BOT_USERNAME` e `BOT_PASSWORD` estão corretos
- Conta pode ter sido bloqueada temporariamente

### Timeout
- Aumente `SCROLL_DELAY` para 3000-5000ms
- Reduza `MAX_COMMENTS` para 50

### Rate Limit
- Reduza `RATE_LIMIT_MAX_REQUESTS`
- Aumente `RATE_LIMIT_WINDOW`

## 📊 Monitoramento

- Railway: Vá em "Deployments" para ver logs
- Render: Vá em "Logs" na dashboard

## 💰 Custos

- **Railway**: Plano gratuito com 500h/mês
- **Render**: Plano gratuito com limitações

Para uso intenso, considere planos pagos.
