# Project Asset Capture Plan - JE4NDEV Portfolio

Data: 2026-06-03  
Missao ativa: melhorar a apresentacao visual dos projetos para publico amplo, de landing pages e sites simples ate SaaS, IA/agentes e Web3.

## Objetivo

Criar uma biblioteca confiavel de prints e capas para o portfolio:

- Prova real do produto quando houver app publico, dashboard, fluxo ou demo.
- Capa editorial bonita apenas como apoio visual, nunca como substituta de prova real.
- Links claros para live, GitHub, docs ou contato.
- Separacao por tipo de publico para o visitante entender rapido o que a JE4NDEV entrega.

## Publicos e Tipos de Entrega

1. Sites simples e landing pages
   - Precisa mostrar primeiro viewport bonito, CTA e proposta clara.
   - Serve para cliente que quer presenca online, site institucional ou validacao rapida.
   - Assets ideais: landing hero, secao de prova, mobile hero.

2. SaaS e sistemas operacionais
   - Precisa mostrar dashboard real, tabelas, fluxo de usuario, billing, painel ou area logada.
   - Landing page so entra como galeria secundaria.
   - Assets ideais: dashboard logado, fluxo principal, tela de metricas, mobile se existir.

3. IA, agentes e automacao
   - Precisa mostrar orquestracao, terminal, Kanban, logs, tools, GitHub ou observabilidade.
   - Assets ideais: painel de agentes, terminal real, workflow, repo/documentacao quando open source.

4. Web3 e seguranca
   - Precisa mostrar dashboard de auditoria, scan, report, risco, contrato ou resultado real.
   - Assets ideais: scan com resultado, relatorio, tela de findings, capa editorial especifica por protocolo.

5. Games e produtos consumer
   - Precisa mostrar gameplay, sala, placar, interacao central.
   - Assets ideais: gameplay em andamento, lobby, resultado da rodada, mobile.

## Capturas Geradas Agora

Pasta: `public/projects/captures/2026-06-03/`

- `alchemix-auditor-desktop.jpg`
- `archscene-desktop.jpg`
- `bounty-hunter-mvp-desktop.jpg`
- `ethena-scanner-desktop.jpg`
- `gestaoml-desktop.jpg`
- `hermes-github-desktop.jpg`
- `hypefc-desktop.jpg`
- `mepchat-github-desktop.jpg`
- `nexpanel-desktop.jpg`
- `stopultimate-desktop.jpg`
- `vultrix-3d-desktop.jpg`
- `_contact-sheet.jpg`

## Avaliacao Rapida Das Capturas

| Projeto | Status do print | Uso recomendado agora | Proximo asset necessario |
|---|---|---|---|
| Alchemix Auditor | Bom | Prova real Web3 + capa editorial propria criada | Captura adicional de relatorio/finding se existir |
| ArchScene | Bom para landing | Hero/landing ou galeria | Print de studio logado/render gallery |
| Bounty Hunter | Ruim | Nao usar | Corrigir demo/data ou gerar capa editorial especifica |
| Ethena Scanner | Medio/bom | Prova inicial Web3 + capa editorial propria criada | Print com scan/resultados preenchidos |
| Gestao ML | Ruim | Nao usar | Corrigir env/live ou capturar local com dados demo |
| Hermes Agentes | Medio | GitHub/prova open source | Print do Conductor/Kanban/Operations real |
| HypeFC | Bom | Prova real dashboard | Captura mobile ou secao live scores |
| MepChat | Ruim | Nao usar | Repo publico correto ou mock/prova do painel CNPJ |
| NexPanel | Bom para landing | Landing/site comercial | Print de dashboard logado com dados demo |
| Stop Ultimate | Medio | Print inicial real adotado temporariamente | Print de gameplay/rodada/placar |
| Vultrix 3D | Bom para landing | Landing/site comercial | Print da calculadora/dashboard logado |

## Capas Editoriais Geradas

Pasta: `public/projects/covers/`

- `alchemix-auditor-cover.webp`
- `ethena-scanner-cover.webp`
- `bounty-hunter-mvp-cover.webp`
- `_web3-covers-contact-sheet.jpg`

Observacao: as capas foram geradas como apoio editorial de card. Alchemix e Ethena continuam com prints reais em `image`. Bounty Hunter usa a capa tambem como imagem temporaria porque o screenshot publico atual mostra erro de carregamento; precisa de captura interna limpa com dados demo.

## Decisoes

- Nao substituir automaticamente as imagens atuais pelos novos prints.
- Primeiro revisar visualmente os capturados e escolher por projeto.
- Projetos SaaS precisam de print de produto real, nao so landing.
- Projetos sem acesso publico devem receber uma das opcoes:
  - captura local com dados demo;
  - captura autenticada com confirmacao do Jean;
  - capa editorial gerada, marcada como editorial;
  - terminal/repo real quando a prova principal for tecnica.

## Primeira Rodada de Providencias

1. Trocar cover generico Web3 por tres capas especificas: concluido nesta rodada.

2. Capturar produto real para SaaS:
   - NexPanel dashboard
   - Vultrix calculadora/dashboard
   - Gestao ML dashboard com env corrigido ou local demo
   - ArchScene studio/render gallery

3. Capturar experiencia real para consumer/game:
   - Stop Ultimate gameplay em rodada

4. Capturar prova tecnica para IA/agentes:
   - Hermes Conductor/Kanban/Operations
   - OpenClaw terminal/workflow
   - MepChat painel CNPJ ou bot flow

## Checklist Antes De Usar Um Asset No Site

- [ ] A imagem mostra algo que o usuario final realmente ve ou usa.
- [ ] Nao e estado vazio, erro, loading ou placeholder.
- [ ] Nao e landing page usada como prova principal de SaaS.
- [ ] Se for capa gerada, esta marcada mentalmente como editorial e ha prova real em `image` ou `gallery`.
- [ ] Tem alt text claro.
- [ ] Funciona em crop 16:10 para cards.
- [ ] Funciona em mobile ou tem versao mobile dedicada.
- [ ] Link live/GitHub/docs correspondente esta correto.
