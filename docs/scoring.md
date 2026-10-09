# Metodologia do Score de Segurança

> Status: rascunho v0.1. Esta é a única fonte da verdade do cálculo.
> O front-end NUNCA recalcula o score, só exibe o que o contrato entrega.

## Princípios

1. **Explicável:** todo ponto perdido pode ser atribuído a achados concretos.
2. **Determinístico:** o mesmo conjunto de achados sempre gera o mesmo score.
3. **Resistente a manipulação:** a IA não altera o score (ver "O que NÃO afeta").
4. **Honesto:** o score mede o que foi analisado, não prova que o código é seguro.

## Fórmula

    score = max(0, 100 − Σ penalidade(achado))
    penalidade(achado) = peso(severidade) × multiplicador(confiança)

Resultado arredondado para o inteiro mais próximo.

### Peso por severidade

| Severidade | Peso |
|---|---|
| Crítica | 10 |
| Alta | 5 |
| Média | 2 |
| Baixa | 0,5 |

### Multiplicador por confiança

| Confiança | Multiplicador |
|---|---|
| Alta | 1,0 |
| Média | 0,6 |
| Baixa | 0,3 |

A confiança vem da ferramenta e da regra (ex.: segredo com formato de token
conhecido = alta; heurística de entropia = baixa).

## Quais achados contam

Só contam achados com `triage.status = "open"`.

- `ignored`, `false_positive` e `fixed` **não** descontam pontos.
- Marcar como ignorado ou falso positivo exige justificativa e fica registrado.
- Reabrir um achado volta a descontar.

## Teto contra excesso de achados repetidos

Para evitar que 200 ocorrências do mesmo problema zerem o score:

- Para cada `ruleId`, só os **3 primeiros** achados abertos descontam.
- Os demais continuam listados no relatório, mas sem penalidade.
- O teto é aplicado após ordenar por severidade e depois por arquivo/linha.
- O contrato expõe `cappedCount` por severidade, e a interface deve mostrar
  quantas ocorrências ficaram sem penalidade (ex.: "3 de 12 contadas").
  
## O que NÃO afeta o score

- **Veredito da IA** (`verdict`): é só um palpite de triagem. Se afetasse o
  score, um prompt injection no código analisado poderia inflar a nota.
- **Falha da etapa `ai_triage`:** o scan fica `partial`, mas o score não muda.
- **Linguagens com cobertura parcial:** não penalizam, porém são sinalizadas.

## Faixas e rótulos

| Score | Rótulo |
|---|---|
| 90–100 | Bom |
| 70–89 | Atenção |
| 40–69 | Risco alto |
| 0–39 | Crítico |

**Regra de rebaixamento:** se existir qualquer achado crítico aberto, o rótulo
nunca fica acima de "Atenção", mesmo com score alto.

## Avisos obrigatórios na interface

- Score alto **não** significa ausência de vulnerabilidades: ferramentas
  estáticas têm falsos negativos.
- Se `coverage` indicar cobertura parcial, o aviso aparece junto ao score.
- Se o scan for `partial`, o aviso aparece junto ao score.

## Exemplo (fixture scan-partial)

| Achado | Severidade | Confiança | Cálculo | Pontos |
|---|---|---|---|---|
| Chave AWS exposta | Crítica | Alta | 10 × 1,0 | 10 |
| SQL Injection | Alta | Alta | 5 × 1,0 | 5 |
| lodash vulnerável | Alta | Alta | 5 × 1,0 | 5 |
| eval() com entrada do usuário | Alta | Média | 5 × 0,6 | 3 |
| MD5 para senhas | Média | Alta | 2 × 1,0 | 2 |
| **Total perdido** | | | | **25** |

Score = 100 − 25 = **75** → "Atenção" (e rebaixado de qualquer forma pelo crítico aberto).

## Limitações conhecidos e evolução

- Os pesos são julgamento inicial, não estatística. Devem ser calibrados com
  o benchmark (Juice Shop, PyGoat) na Fase 1.
- Não considera exploração real, exposição à internet ou valor do ativo
  (o que CVSS ambiental e EPSS tentam capturar). Candidato à Fase 2.
- Dependências: severidade vem da base OSV/CVSS; achados duplicados entre
  ferramentas serão deduplicados por `fingerprint`.