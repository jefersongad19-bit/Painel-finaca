# Painel Financeiro — Assembleia de Deus Missão Araxá

PWA (aplicativo web instalável) para acompanhar receitas, despesas e fechamento
mensal da igreja. Funciona 100% no navegador, sem servidor/backend — os dados
ficam salvos no próprio dispositivo (localStorage) e podem ser exportados em
backup (JSON) ou CSV a qualquer momento, pela página **Configurações**.

## Como publicar no GitHub Pages (gratuito)

1. Crie um repositório novo no GitHub (pode ser público ou privado — Pages
   funciona nos dois, mas em repositório privado só quem você convidar acessa).
2. Envie todos os arquivos desta pasta para a raiz do repositório:
   `index.html`, `style.css`, `data.js`, `app.js`, `manifest.json`, `sw.js`,
   `icon-192.png`, `icon-512.png`.
   - Pelo site do GitHub: abra o repositório → **Add file → Upload files** →
     arraste os arquivos → **Commit changes**.
   - Ou pelo terminal:
     ```
     git init
     git add .
     git commit -m "Painel financeiro inicial"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
     git push -u origin main
     ```
3. No repositório, vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` e a pasta `/ (root)`. Salve.
5. Em alguns minutos o GitHub mostra o endereço do site, algo como:
   `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`
6. Abra esse endereço no computador. No Chrome/Edge, um ícone de instalação
   aparece na barra de endereço — clique para instalar como aplicativo
   (funciona offline depois de aberto uma vez).

## Atualizando o painel depois de publicado

Sempre que quiser mudar algo no app (visual, categorias, etc.), edite os
arquivos e envie um novo commit para o mesmo repositório — o GitHub Pages
atualiza o site sozinho em 1–2 minutos.

## Lançando um novo mês

Pelo próprio painel: **Visão geral → "+ Novo lançamento"**, escolha o mês —
o saldo anterior já vem preenchido automaticamente com o saldo final do mês
mais recente. Depois vá em **Lançamentos** para preencher os valores de
receitas e despesas daquele mês.

## Backup

Os dados existem apenas no navegador/computador onde o painel foi usado. Use
**Configurações → Exportar backup (JSON)** regularmente e guarde o arquivo em
lugar seguro (Google Drive, e-mail, etc.). Para restaurar, use **Importar
backup** na mesma página.
