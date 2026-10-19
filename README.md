# PRIVE CHAT — Vercel + Neon

Este projeto mantém a página pública em `index.html` e adiciona funções serverless da Vercel, configuração compartilhada no Neon Postgres e upload de mídia pelo Vercel Blob.

## O que está preparado

- Página pública sem cadastro; a confirmação de 18 anos continua antes de iniciar.
- Botão de navegação **Entrar** apenas na página inicial. A tela de login é genérica (e-mail e senha), sem link ou texto de administrador.
- Login validado no servidor e sessão assinada em cookie `HttpOnly`, `Secure` em produção e `SameSite=Strict`. O painel e as rotas de escrita exigem sessão válida para `admin@privechat.com`.
- Configurações públicas lidas do Neon e salvas no banco: vídeo do topo, perfis, fotos, ordem dos vídeos de chamada e planos/links de checkout.
- Upload de mídia para Vercel Blob, com token emitido apenas após validar sessão administrativa.
- Atualização da configuração na página inicial a cada 5 segundos para refletir mudanças feitas pelo painel.
- Sequência de vídeos por chamada, custo de 5 moedas e bônus local inicial de 25 moedas; câmera frontal sem espelhamento.

## Configuração necessária antes de publicar

1. Crie um projeto no Neon e copie a **pooled connection string**.
2. Crie um Blob Store no projeto Vercel e obtenha `BLOB_READ_WRITE_TOKEN`.
3. Adicione as variáveis de ambiente no projeto Vercel (Production, Preview e Development):
   - `DATABASE_URL`: connection string do Neon.
   - `AUTH_SECRET`: segredo aleatório forte, com pelo menos 32 caracteres.
   - `ADMIN_PASSWORD`: configure aqui, somente como variável secreta da Vercel, a senha inicial informada pelo proprietário. Não coloque a senha em `index.html`, GitHub ou variáveis `NEXT_PUBLIC_*`.
   - `BLOB_READ_WRITE_TOKEN`: token do Blob Store.
4. Faça deploy do diretório inteiro na Vercel. A primeira chamada à API cria a tabela `prive_settings` e grava a configuração inicial.
5. Abra o site e teste o login administrativo; em seguida envie um vídeo e confirme que aparece em outro navegador/dispositivo.

Para gerar `AUTH_SECRET` localmente: `openssl rand -base64 48`.

## Observações importantes

- **Não há credenciais de infraestrutura neste pacote.** O código não fica operacional em produção até as variáveis acima serem configuradas na Vercel e o projeto ser publicado.
- Os vídeos e fotos ficam no Vercel Blob; URLs e ordem ficam no Neon.
- Os saldos de moedas grátis continuam no armazenamento local do aparelho, conforme o fluxo original do app. O checkout apenas redireciona para o link configurado. Para creditar compras automaticamente depois do pagamento, ainda será necessário integrar o webhook do provedor de checkout e definir uma forma de identificar o comprador sem cadastro.
- A chamada usa o vídeo cadastrado como vídeo remoto e a câmera local como vídeo inferior; não implementa matchmaking real entre duas pessoas. O fluxo de busca existente é uma simulação de 5–10 segundos.
- Configure os domínios/URLs autorizados no provedor de checkout e teste o conteúdo de vídeo antes de abrir o site ao público.
