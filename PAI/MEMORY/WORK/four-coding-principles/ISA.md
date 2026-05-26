---
task: Add Four Coding Principles section to CLAUDE.md applying to every work task
slug: four-coding-principles
effort: E3
phase: observe
progress: 0/32
mode: standard
started: 2026-05-26T20:00:00Z
updated: 2026-05-26T20:00:00Z
---

## Problem

Juliano forneceu quatro princípios de trabalho (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution) que descrevem comportamentos desejados em toda task. Hoje, partes desses princípios estão espalhadas pelo system prompt e CLAUDE.md (e.g. "don't add features beyond what task requires", "match scope to what requested") mas o conjunto não é citável como bloco, e itens-chave (the "200→50 lines" test, the imperative→verifiable transformation table, explicit "stop when confused" rule, orphan-vs-pre-existing-dead-code distinction) não existem em lugar nenhum do PAI.

## Vision

Uma única seção `## Work Principles` em CLAUDE.md, ~15-20 linhas, que codifica os quatro princípios em formato denso (não-redundante com regras existentes), referenciável por nome (`Surgical Changes`, `Goal-Driven Execution`), aplicável a toda task de trabalho. Quando Juliano disser "aplique Surgical Changes aqui" ou eu mesma identificar a tensão, há um endereço único no CLAUDE.md.

## Out of Scope

- Não criar hook determinístico — princípios são subjetivos (e.g. "senior engineer would say overcomplicated"), hooks de regra subjetiva causam falsos-positivos.
- Não criar skill `/coding-principles` dedicado — força invocação explícita, mas princípios devem ser sempre-ativos.
- Não alterar system prompt (constitucional) — princípios operacionais vivem em CLAUDE.md.
- Não duplicar regras já existentes em Operational Rules — apenas adicionar o que falta.
- Não modificar a doutrina Azure RG ou qualquer regra existente.

## Constraints

- Editar apenas `/Users/juliano.barbosa/.claude/CLAUDE.md`.
- Manter estilo markdown denso do CLAUDE.md existente (bullets, **bold** títulos, sem fluff).
- ≤25 linhas adicionadas ao arquivo total.
- Português brasileiro (pt-BR) onde houver prosa autoral; nomes/termos em inglês onde já consagrados (Think Before Coding etc.).
- Posição: após `### Operational Rules`, antes de `### Operational Notes` — mesma família de regras de execução.

## Goal

Adicionar uma única seção `## Work Principles` ao CLAUDE.md de Juliano, codificando os quatro princípios (Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution) em formato denso aplicável a toda task de trabalho, sem duplicar Operational Rules existentes e sem exceder 25 linhas.

## Criteria

- [ ] ISC-1: Seção `## Work Principles` existe em CLAUDE.md (grep retorna match)
- [ ] ISC-2: Seção posicionada após `### Operational Rules` e antes de `### Operational Notes`
- [ ] ISC-3: Seção usa cabeçalho `##` (não `###`) — paridade com outras seções top-level
- [ ] ISC-4: Seção tem frase introdutória declarando escopo "toda task de trabalho"
- [ ] ISC-5: Seção usa lista numerada 1-4 para os princípios
- [ ] ISC-6: Cada princípio tem título em **bold** seguido de explicação
- [ ] ISC-7: Total de linhas adicionadas ao CLAUDE.md ≤ 25 (`git diff --stat`)
- [ ] ISC-8: Princípio 1 nomeado "Think before coding" (literalmente)
- [ ] ISC-9: Princípio 1 menciona explicitar assunções
- [ ] ISC-10: Princípio 1 menciona apresentar múltiplas interpretações quando ambíguo
- [ ] ISC-11: Princípio 1 menciona parar e perguntar quando confuso
- [ ] ISC-12: Princípio 2 nomeado "Simplicity first"
- [ ] ISC-13: Princípio 2 inclui o "senior engineer" test ou equivalente
- [ ] ISC-14: Princípio 2 referencia regra "200 lines could be 50"
- [ ] ISC-15: Princípio 2 proíbe error handling para cenários impossíveis
- [ ] ISC-16: Princípio 3 nomeado "Surgical changes"
- [ ] ISC-17: Princípio 3 proíbe "improving" código adjacente não solicitado
- [ ] ISC-18: Princípio 3 distingue orphans-do-seu-trabalho vs pre-existing-dead-code
- [ ] ISC-19: Princípio 3 inclui teste "every changed line traces to request"
- [ ] ISC-20: Princípio 4 nomeado "Goal-driven execution"
- [ ] ISC-21: Princípio 4 inclui tabela ou exemplos de imperative→verifiable transformation
- [ ] ISC-22: Princípio 4 inclui exemplo "Add validation" → write tests
- [ ] ISC-23: Princípio 4 inclui exemplo "Fix the bug" → write reproducing test
- [ ] ISC-24: Princípio 4 referencia formato `step → verify: check` para planos multi-step
- [ ] ISC-25: Seção declara aplicabilidade a "toda task de trabalho" (escopo escolhido pelo usuário)
- [ ] ISC-26: Read-back do arquivo confirma conteúdo após Edit
- [ ] ISC-27: `markdownlint`-style sanity: heading sem trailing whitespace, lista com indentação consistente
- [ ] ISC-28: Anti: NÃO modifica nenhuma linha da seção `### Operational Rules` existente
- [ ] ISC-29: Anti: NÃO modifica a doutrina `## Azure Resource Group & Subscription Doctrine`
- [ ] ISC-30: Anti: NÃO introduz regra que contradiga rule existente do system prompt (verificar "Don't add features" alignment com Simplicity First)
- [ ] ISC-31: Anti: NÃO duplica frase literal de Operational Rules existente
- [ ] ISC-32: Anti: NÃO adiciona attribution "🤖 Generated with Claude Code" ou similar

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1 | grep | `grep -c "^## Work Principles" CLAUDE.md` | =1 | Bash |
| ISC-2 | grep -n | linhas: Work Principles > Operational Rules, < Operational Notes | ordem correta | Bash |
| ISC-3 | regex | `^## Work Principles` match exato | true | Grep |
| ISC-4-6 | inspection | Read seção, confere intro + numbered list + bold titles | manual visual | Read |
| ISC-7 | git diff --stat | linhas adicionadas <=25 | <=25 | Bash |
| ISC-8-24 | grep -i | substrings literais por princípio | match | Grep |
| ISC-25 | grep -i | "every work task" or "toda task" | match | Grep |
| ISC-26 | Read | conteúdo gravado === intent | match | Read |
| ISC-27 | inspection | visual scan | OK | Read |
| ISC-28-31 | git diff | diff cobre apenas range esperado | true | Bash |
| ISC-32 | grep | "Generated with Claude\|Co-Authored-By" | =0 | Bash |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| draft-section | Escrever o markdown da seção `## Work Principles` em buffer | ISC-3..ISC-25 | - | no |
| edit-claude-md | Inserir seção em CLAUDE.md na posição correta | ISC-1, ISC-2 | draft-section | no |
| readback-verify | Read CLAUDE.md range, confirma conteúdo gravado | ISC-26 | edit-claude-md | no |
| anti-verify | git diff confere que outras seções não foram tocadas | ISC-28..ISC-32 | edit-claude-md | no |
| isc-grep-sweep | Bash grep cada ISC content claim | ISC-8..ISC-24 | edit-claude-md | yes (single bash) |

## Decisions

- 2026-05-26T20:00Z: Posição = após `### Operational Rules`, antes de `### Operational Notes`. Justificativa: princípios são da família de regras-de-execução; agrupar com Operational Rules dá afinidade semântica. Alternativa rejeitada: top-level antes de Context Routing (cria nova categoria sem ganho).
- 2026-05-26T20:00Z: Show-your-math para skip do Forge (E3 coding auto-include): trabalho é markdown doctrine, não código TypeScript. Forge especialização (GPT-5.4 code quality + completeness) seria ruído. Skip também Engineer agent pelo mesmo motivo + single-file Edit não precisa de executor paralelo.
- 2026-05-26T20:00Z: Skip Rule 2 (advisor call): aplica apenas a multi-step ISAs com multi-file edits ou architecture changes. Single-file CLAUDE.md edit não qualifica.
- 2026-05-26T20:00Z: Skip Rule 2a (Cato cross-vendor audit): E4/E5 only, este é E3.

## Verification

(pendente — preenchido em VERIFY phase)
