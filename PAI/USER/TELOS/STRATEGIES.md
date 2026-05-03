# Strategies

> How you approach your missions, goals, and problems — the playbook.

- **S0:** Simples > Sofisticado (sempre). Default para a ferramenta mais simples que resolve. Kubernetes só quando há razão real; Terraform só quando IaC paga; service mesh só com tráfego que justifique. Complexidade precisa ganhar o direito de existir.
  - *Aponta para: M0 · P2*
- **S1:** Conteúdo em pt-BR primeiro. Escrevo sobre FinOps e infra em português brasileiro, com contexto local (preços BRL, contratos AWS/Azure Brasil, realidade de empresas reguladas). Inglês é tradução depois, não direção primária.
  - *Aponta para: G0 · P1 · M2*
- **S2:** Custo é feature, não bug. Trato custo como requisito de design desde o dia 1, junto com confiabilidade e segurança. Toda arquitetura que proponho vem com unit economics; toda automação vem com estimativa de gasto.
  - *Aponta para: M0 · M1 · G2 · P0*
- **S3:** Dogfood antes de prescrever. Uso o que recomendo no meu próprio trabalho antes de levar pro time/cliente. PAI no fluxo pessoal, automações no meu dia, FinOps na minha conta — só depois vira pauta de palestra/post.
  - *Aponta para: M0 · G0 (conteúdo vem de prática real, não teoria)*
- **S4:** Métricas antes de soluções. Começo qualquer iniciativa de FinOps/observabilidade pelo "qual número estamos tentando mexer e como medimos hoje". Sem baseline, qualquer solução parece boa.
  - *Aponta para: G2 · P0 · M1*

## Notes

Strategies are the *how* that connects goals to missions. A strategy is durable across specific goals — if you changed all your goals, your strategies might still apply.

---
*The DA uses strategies to suggest *methods* aligned with how you actually operate, not generic best practices that don't match your style.*
