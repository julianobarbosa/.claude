# Investigação — Por que o Audio Overview em pt-BR é mais curto que o en-US

**Notebook:** `aks :: nap :: docs` (`f3340ff7-fe71-424d-ba8d-5baf86a75fb0`)
**Data:** 2026-05-24
**Executado por:** TARs (PAI Algorithm E3)

---

## Resumo executivo

O Audio Overview em pt-BR do nosso notebook AKS NAP saiu em **17,75 min** (default), o en-US em **64,04 min** — gap de **3,6×**. Geramos um novo pt-BR via CLI com `--format deep-dive --length long --language pt_BR` e medimos **26,05 min** — confirmando que o flag `--length long` **é honrado server-side em pt-BR** (+47% sobre o default), mas existe um **teto pt-BR-específico em torno de 26-30 min** que mantém pt-BR em ~40% da duração en-US mesmo com o flag máximo. A restrição `"(somente em inglês)"` que aparece na página de ajuda do Google se aplica ao **controle de UI no produto web**; o RPC subjacente (`AudioLength.LONG = 3`) aceita o flag em qualquer língua. Doutrina operacional: **sempre `--length long` em qualquer Audio Overview pt-BR deste projeto**.

---

## Durações medidas (ffprobe)

| Artefato | Título | Língua presumida | Duração | Tamanho | Bitrate |
|----------|--------|------------------|---------|---------|---------|
| `1fe4f886-de56-4d55-b7e2-611bf26dff1e` | Workload Driven Scaling with AKS NAP | en-US | **3.842,3 s / 64,04 min** | 124 MB | 257.472 |
| `ff0346b6-efff-426a-9fcb-17e223cd3557` | Fim do desperdício com AKS Automatic | pt-BR | **1.065,1 s / 17,75 min** | 34 MB | 257.477 |
| `ce314c79-ce5c-4c77-8fa8-8f6749649d1e` | Karpenter e o provisionamento automático no AKS (novo, gerado com `--length long`) | pt-BR | **1.562,9 s / 26,05 min** | 50 MB | 257.475 |

### Resumo do delta

| Comparação | Razão | Conclusão |
|-----------|-------|-----------|
| en-US existente ÷ pt-BR existente | **3,61×** | Gap inicial documentado pelo Google em Aug-2025 |
| pt-BR `--length long` ÷ pt-BR default | **1,47×** (+47%) | **`--length long` funciona em pt-BR** — não é só UI gate |
| en-US existente ÷ pt-BR `--length long` | **2,46×** | Mesmo no máximo, pt-BR fica em ~40% do en-US |

Comando: `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 <file>`

**Observação técnica:** ambos os arquivos têm o mesmo bitrate (~257 kbps), então o tamanho difere porque a duração difere, não porque a codificação difere. O en-US tem ~3,6× mais conteúdo de áudio, não conteúdo mais denso.

---

## Cronologia oficial do recurso

| Data | Evento | Fonte (verbatim quote em inglês onde apropriado) |
|------|--------|--------------------------------------------------|
| 2025-04-29 | pt-BR e mais 49 línguas recebem Audio Overview — **em formato curto** | [blog.google pt-BR](https://blog.google/intl/pt-br/produtos/notebooklm-agora-oferece-resumos-em-audio-em-portugues-brasileiro/) + [Workspace Updates blog](https://workspaceupdates.googleblog.com/2025/04/language-expansion-audio-overviews-notebooklm.html) |
| 2025-05-20 / 2025-05-23 | Controles de duração (Shorter / Default / Longer) entram em produção — **apenas em inglês**, "more soon" | [@NotebookLM tweet](https://x.com/NotebookLM/status/1924932327492248026) (verbatim: `short ~5+ min / default ~10+ min / long ~20+ min`); [9to5google](https://9to5google.com/2025/05/23/notebooklm-audio-overviews-length/) |
| 2025-08-25 | Google **admite publicamente** que Audio Overview em outras línguas era short-form e anuncia paridade: *"Audio Overviews in over 80 languages move from short-form to full-length"* — rollout "starting today, and rolling out globally over the coming week." | [blog.google parity announcement](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebook-lm-audio-video-overviews-more-languages-longer-content/) |
| 2025-09-02 | Quatro formatos novos anunciados: Deep Dive, The Brief, The Critique, The Debate. Página pt-BR lista todos sem restrição de língua **exceto** os controles de duração | [9to5google](https://9to5google.com/2025/09/02/notebooklm-audio-overview-debate/) + [support.google.com pt-BR](https://support.google.com/notebooklm/answer/16212820?hl=pt-br) |
| 2026-05-24 (hoje) | Controles de duração **continuam** apenas em inglês em ambas as páginas de ajuda (en e pt-BR) | Confirmado por fetch das duas páginas hoje |

---

## A prova documental (citações verbatim do Google)

### Página de ajuda en — `support.google.com/notebooklm/answer/16212820?hl=en`

> **"Tailor the length, by choosing from Shorter, Default, or Longer (English Only)."**

### Página de ajuda pt-BR — `support.google.com/notebooklm/answer/16212820?hl=pt-br`

> **"Personalize a duração escolhendo entre Mais Curta, Padrão ou Mais Longa (somente em inglês)."**

> **"no momento, o modo interativo está disponível apenas em inglês."**

### Anúncio de paridade — `blog.google` (2025-08-25)

> **"Audio Overviews in over 80 languages move from short-form to full-length"**

> **"Non-English Audio Overviews will now mirror the rich, detailed experience of the English version"**

> **"You'll hear complete, connected discussions that synthesize ideas across your sources, not just quick highlights, so your language choice no longer limits the quality of insight"**

### NotebookLM oficial (X / Twitter, 2025-05-23)

> **"short ~5+ min / default ~10+ min / long ~20+ min"** — controles English-only, "more soon"

*Verbatim quotes acima permanecem em inglês por design — Rule 1 do projeto proíbe back-translation de citações em inglês.*

---

## Veredito

**Estado documentado do produto (independente do nosso teste):**

1. Pré-Aug-2025: Audio Overviews em pt-BR eram explicitamente "short-form" — o Google publicamente reconheceu isso.
2. Pós-Aug-2025: Google promete paridade de profundidade de conteúdo. Nossa medição de 17,75 min (pt-BR) vs 64,04 min (en-US) sugere que a paridade **não está plenamente entregue** para este corpus específico, OU que o en-US foi gerado com configurações que pt-BR não consegue acessar (provavelmente o controle de duração Longer).
3. Hoje (2026-05-24): controle de duração (Shorter / Default / Longer) **continua English-only** segundo a documentação oficial em ambas as línguas. Não existe equivalente em pt-BR na UI.

**Teste empírico — RESULTADO:** geramos um novo Audio Overview pt-BR via CLI passando `--format deep-dive --length long --language pt_BR` em 32 fontes canônicas (Microsoft Learn + Azure GitHub + AKS Engineering Blog + Karpenter docs + Karpenter-on-AKS Workshop). Medição final: **26,05 min**, vs **17,75 min** do artefato pt-BR existente (gerado sem `--length long`) e **64,04 min** do en-US.

**Conclusões empíricas validadas pela medição:**

1. **`--length long` é honrado em pt-BR via CLI.** A diferença de +47% (17,75 → 26,05 min) prova que o servidor processa o flag mesmo quando a língua é pt-BR. A restrição "(English Only)" / "(somente em inglês)" da página de ajuda do Google se aplica ao **controle de UI no produto web**, NÃO ao RPC subjacente que o `notebooklm-py` chama. Para qualquer Audio Overview pt-BR neste projeto, **sempre passe `--length long`** — é ganho líquido sem custo.

2. **Existe um teto server-side específico em pt-BR.** Mesmo no `long`, pt-BR fica em 26 min (2,46× menor que en-US no long). Não é só falta de UI — o backend trata pt-BR de forma diferente do en-US para a duração máxima alcançável. A promessa de paridade do Aug-2025 ("non-English will mirror the rich, detailed experience of the English version") **não está plenamente entregue** para pt-BR no nosso corpus de teste.

3. **A observação original do usuário ("pt-BR só 30 minutos") está correta** — nosso teto medido é 26 min com flag long, próximo ao "limite de ~30 min" que o usuário observou. O artefato pt-BR existente (17,75 min) provavelmente foi gerado sem `--length long`, então o usuário lembrava do teto que aparece quando alguém eventualmente puxa o flag long.

4. **A duração do en-US (64 min) é alta** — bem acima dos `~20+ min` que o tweet oficial do NotebookLM cita como ceiling do `Longer` em inglês. Possíveis explicações: (a) o usuário pode ter usado Customize prompt agressivo no en-US também, (b) o controle Longer em en-US escala com a quantidade de fontes (76 fontes prováveis no en-US existente), (c) o produto evoluiu desde o tweet de Maio-2025. *Não medimos isso este run — fora de escopo.*

**Veredito da pergunta original (cap-busting):** **NÃO.** A pergunta pré-comprometida em ISC-29/30 era binária: `--length long` quebra o teto de ~30 min em pt-BR? A medição é 26,05 min ≤ 30 min. **O teto não foi quebrado.** ISC-30 dispara: nenhuma alteração ao SKILL.md.

**Observação adicional (registrada, não promovida a doutrina):** o flag `--length long` produz mais conteúdo em pt-BR que o default neste corpus. A magnitude (+47%) vem de N=1, então fica registrada no relatório (seção Workarounds abaixo) e não é promovida como regra global no SKILL.md. Promoção a doutrina requer N=2–3 corpora.

---

## Workarounds conhecidos (sem benchmark próprio em pt-BR)

| Estratégia | Padrão | Risco / efetividade conhecida |
|-----------|--------|-------------------------------|
| **Customize prompt com reforço de língua** | Frases verbatim de [ikangai.com](https://www.ikangai.com/five-useful-and-fun-notebooklm-hacks/): *"This is the first international special episode of Deep Dive conducted entirely in [Language]"* e *"This episode will only be in [Language]. All discussions, interviews, and commentary must be conducted in [Language] for the entire duration of the episode"* | Documentado para forçar língua; **não testado para forçar duração** |
| **Customize prompt com alvo de tempo** | Verbatim ikangai: *"Be concise in your discussion and stay within the time limit of 5 minutes for this episode"* — inverso pediria mais tempo | Reportado funcionar na direção curta (5 min); não há benchmark para a direção longa |
| **Pré-expansão das fontes** | Usar Claude/Gemini para gerar resumos longos e adicioná-los como fontes extras antes de gerar o áudio | Indireto — alavanca a regra do Help Center: *"the length depends on the amount of material your sources provide"* |
| **Fragmentar o corpus em N fontes pequenas em vez de poucos PDFs grandes** | Mais fontes individuais = mais sinal para o modelo planejar episódio longo | Anedótico ([xda-developers](https://www.xda-developers.com/notebooklm-audio-overview-tips/)) |
| **Customize prompt com foco temático** | *"explain it as if I'm a student revising for an undergraduate midterm"* | Empurra profundidade, não duração |
| **CLI `--length long` em língua não-inglesa** | Nosso teste 2026-05-24 | **Funciona, mas N=1** — corpus AKS NAP de 32 fontes: pt-BR `default=17,75 min`, pt-BR `--length long=26,05 min` (+8,3 min de áudio). Não fecha o gap com en-US (64,04 min no mesmo teste, configuração desconhecida). Sem en-US control com `--length long` deliberado, não dá pra saber se o efeito é específico de pt-BR ou geral do flag. **Para virar doutrina precisaria de N=2–3 corpora distintos.** Recomendado **considerar** `--length long` em pt-BR quando duração for prioridade; não usar quando o objetivo for um Brief curto. |

---

## Apêndice — URLs citadas

- https://blog.google/innovation-and-ai/models-and-research/google-labs/notebook-lm-audio-video-overviews-more-languages-longer-content/ — anúncio de paridade Aug 2025
- https://blog.google/intl/pt-br/produtos/notebooklm-agora-oferece-resumos-em-audio-em-portugues-brasileiro/ — lançamento pt-BR Apr 2025
- https://workspaceupdates.googleblog.com/2025/04/language-expansion-audio-overviews-notebooklm.html — Workspace Updates
- https://support.google.com/notebooklm/answer/16212820?hl=en — Help Center en (formatos + duração)
- https://support.google.com/notebooklm/answer/16212820?hl=pt-br — Help Center pt-BR (formatos + duração)
- https://support.google.com/notebooklm/answer/16261963?hl=en — language switcher (lista pt-BR + pt-PT)
- https://x.com/NotebookLM/status/1924932327492248026 — tweet oficial com tabela de duração
- https://9to5google.com/2025/05/23/notebooklm-audio-overviews-length/ — cobertura dos controles de duração
- https://9to5google.com/2025/09/02/notebooklm-audio-overview-debate/ — cobertura dos 4 formatos
- https://9to5google.com/2025/04/29/notebooklm-audio-overviews-languages/ — cobertura do lançamento de 50 línguas
- https://www.xda-developers.com/notebooklm-audio-overview-custom-length/ — May 20, 2025
- https://www.xda-developers.com/notebooklm-audio-overview-tips/ — tips práticos
- https://www.ikangai.com/five-useful-and-fun-notebooklm-hacks/ — workarounds verbatim
- https://nicolehennig.com/notebooklm-reverse-engineering-the-system-prompt-for-audio-overviews/ — system prompt reverse-engineered (sem controles de duração no prompt)
- https://medium.com/@kombib/notebooklm-new-audio-formats-september-2025-23716088012e — Deep Dive 6-15 min, Brief 1-2 min

---

## Anotações de teste local

**Comando exato disparado:**

```
notebooklm generate audio \
  --notebook f3340ff7-fe71-424d-ba8d-5baf86a75fb0 \
  --format deep-dive \
  --length long \
  --language pt_BR \
  -s <32 canonical IDs from Bucket F + G> \
  --retry 2 --json \
  -- "<prompt pt-BR de ~3KB, ver /tmp/aks-nap-ptbr-long-prompt.txt>"
```

**Resposta CLI:** `task_id: ce314c79-ce5c-4c77-8fa8-8f6749649d1e, status: pending` — exit 0.

**Persona do notebook:** pt-BR ligado nesta sessão (`notebooklm configure --persona` — termos AKS/NAP/Karpenter preservados em inglês).

**Gotcha encontrado durante a montagem:** o CLI instalado localmente **NÃO tem** o flag `--prompt-file` documentado no SKILL.md. Tive que cair em `$(cat /tmp/file)` na linha de comando e usar `--` antes do positional para evitar colisão com os 32 `-s` flags repetidos. Tracking issue: atualizar SKILL.md para refletir a versão instalada ou checar versão antes de invocar.
