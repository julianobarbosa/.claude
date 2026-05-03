# Pack Recommendations for Juliano — Workflow-Aligned Install Plan

## Context

Você pediu sugestões de Packs alinhados ao seu workflow. Eu cruzei o catálogo de `Packs/README.md` (45 skills + 11 bundles) com o seu TELOS já carregado:

- **M0/G1** — entregar CaféHyna na Hypera até Q2/2026 (SRE/DevOps em farma regulada).
- **M1/G0** — publicar 1 conteúdo FinOps/mês em pt-BR até dez/2026.
- **C0/C3** — paralelismo excessivo e diluição em ferramentas: instalar tudo é exatamente o anti-padrão. **Pack ≠ skill ativa**; cada pack instalado vira ruído de descoberta.
- **C2** — perfeccionismo de publicação trava o G0; preciso de packs que destravam, não que adicionam fricção.
- **C4** — trabalho solo demais: packs de delegação/agente são leverage real.

A regra orientadora deste plano: **instalar 5 essenciais agora, 4 quando G0 entrar em ritmo, 4 quando G1 ativar build do CaféHyna, deferir o resto**. Total instalado nunca passa de ~13 — o resto fica documentado e disponível sob demanda.

---

## Tier 1 — Instalar Agora (Foundation, 5 packs)

| Pack | Tipo | Por que agora | Mapeamento TELOS |
|------|------|---------------|------------------|
| **Telos** | Bundle | Você já opera com TELOS — dashboard + workflows Update/Interview/Narrative/Report fecham o loop. | M0–M2, G0–G1, C0–C5 |
| **ContextSearch** | Bundle (`/cs`) | Recuperação cold-start: vence o "tudo paralelo, perdi o fio". Combate direto C0/C4. | C0, C4 |
| **Research** | Bundle | Quick/Standard/Extensive/Deep — base do pipeline FinOps content. Sem isso, G0 não escala. | G0, M1, P1 |
| **ContentAnalysis** | Bundle | ExtractWisdom adaptativo + Fabric — transforma podcast/artigo gringo em insumo pt-BR (P1). | G0, P1 |
| **Thinking** | Bundle | Empacota FirstPrinciples + RootCauseAnalysis + Council + RedTeam + WorldModel + Science. SRE diário usa RCA/5-Whys; conteúdo usa FirstPrinciples/RedTeam para steelman. | G1, P2, M0 |

**Justificativa de zero deps externas:** todos os 5 rodam sem API key paga. Risco de instalação ~zero.

---

## Tier 2 — Instalar quando G0 ganhar ritmo (Content Cadence, 4 packs)

Gatilho: você publicar 1ª edição FinOps com sucesso.

| Pack | Por que | Mapeamento |
|------|---------|------------|
| **WriteStory** | Estrutura narrativa em 7 camadas + framework Pressfield. Ataca C2 (perfeccionismo) com scaffolding. | G0, C2 |
| **Aphorisms** | Banco de citações + integração de newsletter, evita repetição. Ritual mensal precisa disso. | G0 |
| **BeCreative** | Verbalized Sampling para gerar 5 ângulos divergentes — destrava bloqueio criativo da edição mensal. | G0, C2 |
| **Daemon** | Perfil público auto-gerado a partir do TELOS/KNOWLEDGE. Camada passiva de presença sem custo de publicação. | M2, G0 |

**Sales** entra como opcional aqui: útil se você for vender FinOps consulting; pular se foco for só content/educação.

---

## Tier 3 — Instalar quando ativar build do CaféHyna (SRE/Infra, 4 packs)

Gatilho: começar implementação do dev env CaféHyna.

| Pack | Por que | Mapeamento |
|------|---------|------------|
| **ISA** | Articula "done" do dev env regulado farma — 12 seções (Problem/Vision/Constraints/Criteria/Test). Indispensável em ambiente com compliance. | G1, P3 |
| **CreateCLI** | Tier 1 llcli zero-deps + TS gera ferramentas internas SRE em ~300 linhas. Combate P2 (over-engineering). | G1, P2 |
| **Interceptor** | Chrome real, zero CDP — verificação obrigatória de qualquer entrega web (regra `CLAUDE.md`). | G1 |
| **Delegation** | 6 padrões de paralelização disciplinados. Combate C0/C4 com estrutura, não com mais frentes. | C0, C4 |

---

## Tier 4 — Deferir até demanda explícita

Documentar como "disponíveis", **não instalar**:

- **Scraping (BrightData + Apify)** — paid keys; só instalar quando aparecer caso de scraping FinOps real (ex: coletar pricing público AWS Brasil).
- **Investigation** — OSINT/PrivateInvestigator: niche, fora do core workflow.
- **Browser** — Interceptor cobre 90% do caso; instalar Browser só se precisar de batch headless paralelo.
- **Migrate** — one-shot quando migrar Obsidian/Notion existente.
- **Art / Media / Remotion** — instalar quando 1ª edição precisar de capa visual editorial.
- **Knowledge** — instalar quando volume de notas FinOps justificar grafo tipado (provavelmente após 6+ edições).
- **Agents (custom composition)** — instalar se Council/RedTeam padrão deixarem de bastar.
- **PAIUpgrade** — meta-skill de melhoria PAI; instalar quando o sistema estiver estável e você quiser otimizar continuamente.
- **BitterPillEngineering** — auditar prompts/regras; instalar quando CLAUDE.md crescer demais.
- **Prompting / Fabric** — meta-stdlib; instalar sob demanda específica.
- **WorldThreatModel** — interessante para análises macro FinOps de longo prazo, mas heavyweight; deferir.
- **USMetrics** — US-focused; baixo fit para audiência Brasil/pt-BR.

---

## Critical Files

- Pack source: `/Users/juliano.barbosa/Repos/github/Personal_AI_Infrastructure/Packs/`
- Cada pack tem `INSTALL.md` (wizard 5-fase: análise → perguntas → backup → instalação → verificação) e `VERIFY.md`.
- Destino instalação esperado: `~/.claude/PAI/Skills/<PackName>/` (PAI 5.0.0 layout).

## Verification (após Tier 1 instalado)

1. `Skill("Telos")` deve listar workflows Update/Interview/Narrative/Report.
2. `/cs` ou `Skill("ContextSearch")` retorna sessões anteriores.
3. `Skill("Research")` aceita modos Quick/Standard/Extensive/Deep.
4. `Skill("ExtractWisdom")` (via ContentAnalysis bundle) detecta domínio do conteúdo.
5. `Skill("RootCauseAnalysis")` (via Thinking) lista 5 workflows: FiveWhys, Fishbone, Postmortem, FaultTree, KepnerTregoe.

VERIFY.md de cada pack tem checklist próprio — rodar após cada install.

## Open Question

Confirma o sequenciamento Tier 1 → 2 → 3, ou prefere Tier 1 + Tier 3 já (CaféHyna em Q2 está próximo) e adiar Tier 2 até a 1ª edição FinOps sair?
