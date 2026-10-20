# PRIVE CHAT — fluxo de modelos e vídeos

## Recursos desta versão
- Painel administrativo para criar, editar e excluir modelos.
- Cada modelo tem nome, idade, localização, status, foto, apresentação e arquivo de vídeo de chamada.
- Seleção aleatória entre modelos ativos que tenham vídeo anexado; o vídeo é reproduzido até o fim, sem duração fixa imposta pelo app.
- Opção de câmera local do visitante (permissão do navegador). Não existe conexão de vídeo ao vivo entre o visitante e a modelo.
- Fluxo demonstrativo de conta: e-mail/senha e acesso rápido.

## Limitação essencial
Este pacote é um protótipo front-end. Vídeos são guardados no IndexedDB do navegador do administrador e dados de perfis/contas no localStorage. Eles NÃO ficam disponíveis para outros visitantes/dispositivos e a autenticação local não é segura para produção. Não use senhas reais.

Para produção, criar endpoints server-side para autenticação (hash de senha, sessão segura, rate limiting), armazenar os perfis no Neon e subir vídeos para Vercel Blob ou outro object storage, guardando apenas a URL/ID no banco. Nunca colocar credenciais administrativas em JavaScript do cliente.

O conteúdo de vídeo deve ser autorizado e a interface identifica claramente que a imagem é gravada.

## Deploy estático
Importe a pasta no GitHub e conecte o repositório à Vercel. Como é HTML estático, não precisa de build command. Isso não implementa o backend descrito acima.
