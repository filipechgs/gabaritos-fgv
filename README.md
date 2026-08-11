# Método de estudo por questões + Gabarito Dinâmico (PWA)

Guia **replicável** para montar, com ajuda de um agente de IA (Cursor, Claude, OpenCode, ChatGPT com ferramentas, etc.), um sistema de estudo baseado em:

1. **Edital** → checklist de tópicos  
2. **Provas da mesma banca** → checklist de questões prioritárias  
3. **Gabarito dinâmico (PWA)** → marcar A–E no celular/PC enquanto lê o PDF da prova  

Este repositório aplica o método ao **Concurso Dataprev 2026 — Perfil 1: Análise de Negócios de TI** (banca FGV), mas a mesma lógica serve para **qualquer concurso**.

---

## O que é um PWA? (para quem nunca ouviu falar)

**PWA** significa *Progressive Web App* — em português, algo como “aplicativo web progressivo”.

Na prática, é um **site que se comporta quase como um app de celular**:

- Você abre pelo **navegador** (Chrome, Safari, Edge etc.), sem ir à App Store / Play Store.  
- Pode **“instalar”** na tela inicial (“Adicionar à tela inicial” / “Instalar aplicativo”).  
- Depois abre em **tela cheia**, com ícone próprio, como WhatsApp ou Instagram.  
- Em muitos casos funciona **mesmo sem internet** (ou com conexão ruim), porque o celular guarda uma cópia local.  
- Suas marcações de resposta ficam salvas **no próprio aparelho** (não precisam de login).

Pense assim: em vez de baixar um programa pesado, você usa uma **página web inteligente** que vira atalho no celular. Ideal para estudar no ônibus, na pausa do almoço ou no sofá — com o PDF da prova aberto e o gabarito dinâmico ao lado.

Neste projeto, o PWA é a pasta `gabarito-dinamico/` (publicável no GitHub Pages).

---

## O que construímos aqui (visão geral)

| Artefato | Função |
|----------|--------|
| `edital-*.pdf` + texto extraído | Fonte oficial do conteúdo programático |
| `checklist-*-ti.md` | Checklist dos **tópicos** do edital (o que estudar) |
| `checklist-questoes-edital.md` | Checklist das **questões** das provas FGV alinhadas ao edital |
| `estrategia-estudos-questoes.md` | Como estudar com pouco tempo (ciclo tentativa → erro → estudo mínimo) |
| `provas-fgv/` | PDFs de provas + gabaritos + scripts Python |
| `gabarito-dinamico/` | App PWA instalável: grupos por assunto, destaque de questões-guia, verificação online/offline |

### Ideia central

> Você **não precisa** colar o enunciado no app. Abre o **PDF da prova** ao lado (ou no tablet) e usa o **gabarito dinâmico** só para marcar A–E e conferir. As questões destacadas são o seu **roteiro de prioridade** (guia do edital).

Cores no app deste projeto:

- **Âmbar** = guia **específico** (Módulo II / perfil)  
- **Ciano** = guia **geral** (Português, Inglês, RLM, legislação LAI/LGPD etc.)

---

## Por que funciona

1. **Priorização**: o edital define o que cai; as provas da banca mostram **como** cai.  
2. **Densidade**: estudar por questão evita ler material demais antes de treinar.  
3. **Feedback imediato**: o PWA corrige na hora e guarda respostas no `localStorage`.  
4. **Mobilidade**: GitHub Pages + PWA = estudar no celular sem depender de papel.  
5. **Agente de IA**: automatiza extração de PDF, cruzamento edital×questões e geração do HTML — o trabalho manual pesado some.

---

## Estrutura de pastas recomendada

Crie algo neste formato (adapte os nomes):

```text
meu-concurso/
├── edital.pdf
├── edital-extracted.txt          # opcional: texto extraído do edital
├── checklist-topicos.md          # tópicos do Anexo / conteúdo programático
├── checklist-questoes.md         # questões-guia das provas da banca
├── estrategia-estudos.md
├── provas-banca/
│   ├── prova-orgao-ano-cargo.pdf
│   ├── gabarito-orgao-ano-cargo.pdf
│   ├── extracted/                # .txt extraídos dos PDFs
│   ├── build_gabarito_html.py    # gerador do app
│   └── ...
└── gabarito-dinamico/            # publiquável no GitHub Pages
    ├── index.html
    ├── manifest.webmanifest
    ├── sw.js
    ├── icon.svg
    └── .nojekyll
```

### Como escolher as provas

1. Mesma **banca** do seu concurso (ex.: FGV, Cespe, FCC).  
2. Cargos/áreas **próximos** ao seu perfil (TI, negócios, segurança, etc.).  
3. Preferir provas com **gabarito oficial** (definitivo, se houver).  
4. Anotar o **tipo de caderno** (Tipo 1 / Branca) — o gabarito muda por tipo.

---

## Fluxo completo (passo a passo)

### Fase 1 — Base documental

1. Baixe o **edital** e as **provas + gabaritos**.  
2. Coloque tudo nas pastas acima.  
3. Extraia texto dos PDFs (o agente pode fazer isso com `pymupdf` / `pdfplumber` / ferramentas do IDE).

**Prompt sugerido:**

```text
Extraia o texto do edital.pdf e das provas/gabaritos em provas-banca/.
Salve em arquivos .txt em provas-banca/extracted/ e edital-extracted.txt.
Preserve a ordem das páginas e os números das questões.
```

### Fase 2 — Checklist de tópicos (edital)

**Prompt sugerido:**

```text
Com base no Anexo de conteúdo programático do edital (perfil X),
crie checklist-topicos.md com checkboxes para cada tópico.
Separe Módulo I (gerais) e Módulo II (específicos).
Não invente tópicos que não estejam no edital.
```

### Fase 3 — Mapear questões das provas × edital

**Prompt sugerido:**

```text
Analise as provas em provas-banca/extracted/ e cruze com o conteúdo
do edital (perfil X).

Para cada prova, liste apenas as questões que claramente contemplam
assuntos do edital.

Gere checklist-questoes.md com:
- resumo por prova (quantidades)
- seções Gerais vs Específicas
- tags curtas (ex.: PORT, RLM, COBIT, SQL)
- uma linha por questão: Qn — TAG — tema curto

Ignore assuntos da prova que NÃO estão no edital
(ex.: Direito local, Regimento interno do órgão da prova-fonte).
```

### Fase 4 — Estratégia de estudo

**Prompt sugerido:**

```text
Com base na tabela de pesos do edital (gerais vs específicos),
escreva estrategia-estudos.md para quem tem pouco tempo:
ciclo tentativa → estudo mínimo do erro → refazer → revisão espaçada.
Inclua ordem sugerida usando o checklist-questoes.md.
```

### Fase 5 — Gabarito dinâmico (HTML/PWA)

Peça ao agente para gerar um app com:

- abas/modal por prova (Tipo 1 / Branca);  
- só número da questão + opções A–E (sem enunciado);  
- grupos por assunto (Português, Inglês, Específicas…);  
- destaque das questões do checklist (cores diferentes para geral vs específico);  
- verificar gabarito, localStorage, filtro “só guia”;  
- PWA: `manifest`, `service worker`, ícone, nome curto.

**Prompt sugerido (geração inicial):**

```text
Crie um gerador Python que leia provas/gabaritos em extracted/ e
gere gabarito-dinamico/index.html.

Requisitos:
1) Parsear gabarito oficial Tipo 1 (Branca) com cuidado para não
   misturar cargos/tipos vizinhos no PDF.
2) Interface: marcar A–E; verificar; mostrar acerto/erro/anulada.
3) Sem enunciado — só número + alternativas.
4) Agrupar questões por seção da prova (Português, Inglês, etc.).
5) Destacar questões listadas no checklist-questoes.md
   (âmbar = específico, ciano = geral).
6) Tornar instalável como PWA (manifest + service worker + icon.svg).
7) Nome do app: "Gabarito FGV" (ou o nome da sua banca).
8) Auditar questão a questão: HTML deve bater 100% com o gabarito oficial.
```

**Prompt sugerido (auditoria — faça sempre):**

```text
Revise cuidadosamente se o gabarito aplicado a cada prova no HTML
está 100% igual ao gabarito oficial do PDF/txt.
Compare questão a questão. Se houver erro de parser (ex.: vazamento
para o próximo cargo), corrija e regenere.
```

**Prompt sugerido (PWA / UX):**

```text
Transforme o HTML em PWA instalável.
Ícone SVG e favicon = 📝 (ou outro emoji).
Nome do app = Gabarito FGV.
Troque o seletor de provas por modal; mostre a prova atual fixa na navbar.
```

### Fase 6 — Publicar e usar

1. Crie um repositório Git **só** da pasta `gabarito-dinamico/` (ou publique essa pasta no Pages).  
2. Ative **GitHub Pages** (branch `main`, root).  
3. Inclua `.nojekyll` se necessário.  
4. No celular: abra o site → “Adicionar à tela inicial”.  
5. Estude: PDF da prova + app lado a lado → marque → “Verificar gabarito”.

---

## Como estudar no dia a dia (método)

1. Abra o `checklist-questoes.md` (ou filtre “só guia” no app).  
2. Pegue um **bloco pequeno** (3–8 questões).  
3. Responda **sem consultar**.  
4. Verifique no gabarito dinâmico.  
5. Para cada erro: estude **só** o ponto necessário (parágrafo, verbete, vídeo curto).  
6. Refaça a questão no dia seguinte / na semana.  
7. Marque `[x]` no checklist quando consolidar.

Regra de ouro com peso desigual (comum em concursos):

> Se a específica vale mais (ex.: 2,5×), dedique a maior parte do tempo a ela — mas não abandone Português/Inglês/RLM.

---

## Boas práticas com o agente de IA

| Faça | Evite |
|------|--------|
| Peça para **auditar** gabaritos contra o oficial | Confiar no parser na primeira tentativa |
| Exija **só** assuntos do edital no checklist | Incluir tudo da prova-fonte “porque está no PDF” |
| Trabalhe com **Tipo 1 / Branca** de forma explícita | Misturar tipos de caderno |
| Versionar a pasta do PWA no Git | Commits gigantes com PDFs enormes no mesmo repo (opcional: LFS ou repo separado) |
| Regenerar o HTML pelo script após mudanças | Editar só o HTML gerado e perder alterações no próximo build |

### Extração de PDF

PDFs de prova costumam ser “sujos” (marcas d’água, quebras de linha). Oriente o agente a:

- ignorar cabeçalhos/rodapés de site;  
- não confundir números do enunciado (`100`, `200`) com número de questão;  
- cortar o bloco do gabarito no **próximo cargo/tipo**, não só em Tipo 2/3/4.

---

## Este projeto (referência Dataprev / FGV)

### Provas usadas

- Fortaleza 2024 — Analista de Informática  
- Senado 2022 — Análise de Sistemas  
- Senado 2022 — Análise de Suporte  
- Câmara 2023 — Informática Legislativa  
- TCE-PA 2024 — Analista de Segurança  

### Scripts úteis (`provas-fgv/`)

| Script | Função |
|--------|--------|
| `build_gabarito_html.py` | Gera `gabarito-dinamico/index.html` |
| `audit_gabaritos_hardcoded.py` | Confere gabarito HTML × oficial |
| `verify_gabaritos.py` | Verificação alternativa do parser |
| `map_questions.py` | Apoio ao cruzamento edital × questões |

Regenerar o app após alterar guias/seções:

```bash
py provas-fgv/build_gabarito_html.py
py provas-fgv/audit_gabaritos_hardcoded.py
```

### Pasta publicada

`gabarito-dinamico/` — PWA com modal de provas, grupos por assunto e destaques de guia.

---

## Checklist rápido para replicar em outro concurso

- [ ] Edital baixado e conteúdo programático identificado  
- [ ] Pasta `provas-banca/` com PDF prova + PDF gabarito  
- [ ] Texto extraído em `extracted/`  
- [ ] `checklist-topicos.md` gerado a partir do edital  
- [ ] `checklist-questoes.md` só com questões alinhadas ao edital  
- [ ] Gerador HTML + auditoria 100% do gabarito  
- [ ] PWA (manifest, SW, ícone, nome curto)  
- [ ] Publicado (GitHub Pages ou similar)  
- [ ] Rotina semanal: blocos do checklist + revisão de erros  

---

## Prompt “mestre” (copiar e colar)

Use no início de um chat novo com o agente, adaptando os colchetes:

```text
Quero montar um sistema de estudos replicável para o concurso [NOME],
banca [BANCA], cargo/perfil [PERFIL].

Contexto:
- Edital em [caminho]
- Provas e gabaritos em [pasta]
- Quero estudar por questões, com pouco tempo.

Faça, nesta ordem:
1) Extrair textos dos PDFs.
2) Checklist de tópicos do edital (gerais e específicos).
3) Cruzar provas × edital e gerar checklist de questões-guia
   (apenas assuntos do edital).
4) Estratégia de estudos por ciclo de questões.
5) App HTML/PWA de gabarito dinâmico:
   - só número + A–E
   - grupos por assunto da prova
   - destaque das questões-guia (cor para geral, cor para específico)
   - verificar gabarito + localStorage
   - instalável no celular
6) Auditar gabaritos questão a questão contra o oficial.
7) Escrever um README explicando o método para outras pessoas replicarem.

Não invente tópicos fora do edital. Se algo for incerto, pergunte.
```

---

## Aviso

- Gabaritos oficiais podem ser **alterados** (recursos/anulações). Atualize os PDFs e regenere o app.  
- Este material é de **estudo**; a fonte da verdade é sempre o edital e o gabarito da organizadora.  
- Respeite direitos autorais dos PDFs das bancas ao republicar conteúdo.

---

*Método aplicado originalmente ao Dataprev 2026 · Perfil 1 · provas FGV · gabarito dinâmico como PWA.*
