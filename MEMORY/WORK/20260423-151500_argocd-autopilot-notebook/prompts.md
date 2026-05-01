# 9 Prompts Curados para argocd-autopilot no NotebookLM

Biblioteca de prompts adaptada do `notebooklm-create-skill` para o notebook `argocd :: argocd-autopilot :: docs`. Cole cada prompt diretamente no chat do NotebookLM.

---

## 1. Cinco Perguntas Essenciais (Estudo)

```
Liste e responda às 5 perguntas mais essenciais que um engenheiro de plataforma Kubernetes precisa entender sobre o argocd-autopilot antes de adotá-lo em produção. Para cada pergunta, cite a fonte oficial (URL do readthedocs ou README do repositório argoproj-labs/argocd-autopilot) e forneça um exemplo prático de CLI (repo bootstrap, project create, application create).
```

## 2. Encontre as Partes Interessantes (Garimpo de Insights)

```
Como um arqueólogo técnico, extraia as 10 afirmações mais surpreendentes, contraintuitivas ou subestimadas sobre o argocd-autopilot a partir destas fontes. Inclua: (a) o motivo pelo qual o Codefresh doou o projeto para argoproj-labs, (b) por que a issue #38 (suporte Helm) está aberta desde 2021, (c) a mecânica exata do ciclo auto-gerenciado (autopilot-bootstrap → argo-cd → root), e (d) o que o modo de manutenção desde Set/2025 significa para novos adotantes.
```

## 3. Quiz Show (Revisão Gamificada)

```
Atue como apresentador de um quiz técnico de 10 perguntas sobre argocd-autopilot. Mescle: comandos da CLI (3 perguntas), arquitetura App-of-Apps (3 perguntas), limitações conhecidas (2 perguntas), e casos de uso de disaster recovery (2 perguntas). Para cada pergunta, forneça 4 alternativas, indique a correta com explicação e cite a fonte.
```

## 4. Relatório do Analista de Conteúdo (Reaproveitamento)

```
Transforme o conteúdo deste notebook em um artigo técnico de blog de 1500 palavras no formato "Guia Prático: Como implementar GitOps com argocd-autopilot em 2026". Estruture em: introdução (por que GitOps), problema (ArgoCD vanilla), solução (autopilot), passo a passo do bootstrap, primeiros projetos e apps, armadilhas comuns (repoURL localhost, re-bootstrap manual), e recomendação final. Inclua snippets de código bash e referências numeradas às fontes.
```

## 5. Comunidade → Plano de Ação (Síntese de Roadmap)

```
Analise todas as reclamações recorrentes da comunidade (issues do GitHub, posts do Mixinet, DevOpsMotion, OneUptime) sobre argocd-autopilot e produza um plano de ação em 3 camadas: (1) o que um adotante pode fazer HOJE para contornar as limitações (ex: kustomize --enable-helm), (2) o que um contribuidor externo poderia priorizar no backlog (issues #38, #402, #590), e (3) o que a Codefresh/argoproj-labs deveria focar para uma v1.0. Justifique prioridades com dados das fontes.
```

## 6. Outline SEO (Conteúdo Competitivo)

```
Gere um outline SEO completo para um tutorial definitivo sobre argocd-autopilot otimizado para ranquear contra o post do Codefresh e o guia da OneUptime. Inclua: título H1, meta description (150 char), 8 seções H2 com H3s aninhados, palavras-chave primárias/secundárias (argocd-autopilot, GitOps bootstrap, App-of-Apps pattern, disaster recovery Kubernetes), FAQs (5 perguntas), e pontos de diferenciação vs conteúdo existente.
```

## 7. Feedback 360° em Marketing (Crítica Multi-Persona)

```
Simule um feedback 360° sobre a página oficial do argocd-autopilot (README + readthedocs Getting Started) a partir de 5 personas:
1. Engenheiro de plataforma sênior cético
2. SRE recém-formado estudando GitOps pela primeira vez
3. Arquiteto de soluções em empresa Fortune 500 avaliando Flux vs autopilot
4. Mantenedor open source avaliando o projeto para contribuição
5. CTO de startup decidindo investir 2 semanas de tempo do time

Para cada persona, cite 3 pontos fortes, 3 pontos fracos, e 1 pergunta crítica não respondida pela documentação.
```

## 8. Kit Guia de Estudos (Currículo de Onboarding)

```
Crie um currículo de onboarding de 5 dias para um engenheiro novo no time que precisa dominar argocd-autopilot. Cada dia deve ter: (a) 1-2 fontes do notebook para leitura obrigatória, (b) 1 laboratório prático (ex: dia 1 = bootstrap em k3d local, dia 3 = criar projeto multi-cluster), (c) 3 perguntas de verificação, e (d) uma "armadilha do dia" dos pain points reais reportados pela comunidade (Hoelzel.IT, Mixinet, issues do GitHub).
```

## 9. Script de Palestra de Conferência (Pitch Narrativo)

```
Escreva o script completo de uma palestra de 20 minutos para o KubeCon intitulada "argocd-autopilot em produção: o que o README não te conta". Estruture em: (1) gancho inicial (2 min) - uma história real de disaster recovery, (2) o que é autopilot (3 min), (3) a arquitetura de 4 camadas do App-of-Apps (5 min), (4) demo ao vivo do repo bootstrap (3 min), (5) 3 armadilhas que custaram tempo (4 min - localhost repoURL, Helm missing, re-bootstrap manual), (6) quando usar vs quando evitar (2 min), (7) takeaways e Q&A (1 min). Inclua tempos sugeridos para cada slide e frases de transição.
```

---

**Dica de uso:** Após gerar os artefatos do Studio (áudio, vídeo, mapa mental, relatórios), utilize estes prompts no chat para extrair valor adicional das fontes. Prompts #1, #3, #8 são ótimos para aprendizado; #2, #5, #7 para análise crítica; #4, #6, #9 para geração de conteúdo.
