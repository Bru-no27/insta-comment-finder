
# Backend de Scraping de Comentários do Instagram

Este é um backend Node.js com Puppeteer para extrair comentários do Instagram usando uma conta-bot.

## 🚀 Instalação Rápida

```bash
# 1. Criar pasta do backend
mkdir backend
cd backend

# 2. Copiar os arquivos server.js e package.json para esta pasta

# 3. Instalar dependências
npm install

# 4. Iniciar servidor
npm start
```

## 📋 Como Usar

1. **Configure uma conta Instagram dedicada** (não use sua conta principal)

2. **Inicie o backend**:
   ```bash
   npm start
   ```
   O servidor ficará disponível em `http://localhost:3001`

3. **Teste via frontend** ou diretamente com curl:
   ```bash
   curl -X POST http://localhost:3001/api/test-comments \
     -H "Content-Type: application/json" \
     -d '{
       "postUrl": "https://instagram.com/p/CODIGO_DO_POST",
       "botCredentials": {
         "username": "sua_conta_bot",
         "password": "sua_senha"
       }
     }'
   ```

## ⚠️ Importante

- Use uma conta Instagram dedicada para bot (não sua conta principal)
- Respeite os rate limits do Instagram
- Este código é para fins educacionais e de teste
- Verifique os Termos de Uso do Instagram antes de usar em produção

## 🔧 Configurações

- **Porta**: 3001 (pode ser alterada na variável PORT)
- **Headless**: true (mude para false para debug visual)
- **Timeout**: 15s para login, 10s para carregamento de páginas

## 📝 Logs

O servidor mostra logs detalhados de cada etapa:
- 🌐 Iniciando navegador
- 🔐 Fazendo login
- 📱 Navegando para post
- ⬇️ Rolando página
- 🔍 Extraindo comentários
- ✅ Resultado final
