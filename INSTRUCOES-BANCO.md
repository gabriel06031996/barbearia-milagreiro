# 🎯 INSTRUÇÕES PARA CONFIGURAR O BANCO NEON

## Passo 1: Criar Conta no Neon
1. Acesse: https://neon.tech
2. Clique em "Sign Up"
3. Use GitHub, Google ou Email

## Passo 2: Criar Projeto
1. Clique em "Create Project"
2. Nome: `imovel-prime`
3. Database: `imovel_prime_db`
4. Região: `US East (Ohio)`

## Passo 3: Copiar Connection String
1. No dashboard, procure "Connection Details"
2. Copie a "Connection String" completa
3. Será algo como:
   \`\`\`
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/imovel_prime_db?sslmode=require
   \`\`\`

## Passo 4: Configurar Banco
1. Abra o arquivo `scripts/setup-database.js`
2. Cole sua DATABASE_URL na linha 4:
   \`\`\`javascript
   const DATABASE_URL = "SUA_DATABASE_URL_AQUI"
   \`\`\`
3. Execute o script (no v0 ou localmente)

## Passo 5: Deploy
1. Use o botão "Deploy" do v0
2. Ou faça upload manual no Vercel
3. Adicione a DATABASE_URL nas variáveis de ambiente

## URLs Finais
- Landing Page: `https://seu-projeto.vercel.app/`
- Dashboard Admin: `https://seu-projeto.vercel.app/admin`

## Suporte
Se tiver problemas, me avise qual erro apareceu!
