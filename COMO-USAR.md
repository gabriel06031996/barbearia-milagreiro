# 🎯 COMO USAR O SCRIPT CORRIGIDO

## Passo 1: Encontrar sua DATABASE_URL
No painel do Neon, procure por:
- "Connection String"
- "Database URL" 
- "Connect"
- Aba "Settings" ou "Database"

## Passo 2: Editar o Script
1. Abra o arquivo `setup-database-fixed.js`
2. Na linha 4, substitua:
   \`\`\`javascript
   const DATABASE_URL = "COLE_SUA_URL_AQUI"
   \`\`\`

## Passo 3: Executar
Clique em "Run Script" e veja os logs

## Passo 4: Se der erro
Me mande a mensagem de erro que apareceu!

## Exemplo de DATABASE_URL válida:
\`\`\`
postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
