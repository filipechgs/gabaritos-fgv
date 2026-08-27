# Prova FGV (PWA)

App instalável com **enunciado + alternativas** — **somente questões-guia** do edital Dataprev (checklist), uma por vez.

## Como usar

1. Abra via servidor estático (ex.: `py -m http.server` na pasta) ou GitHub Pages.
2. Se algo parecer “travado” de uma versão antiga: **Ctrl+F5** (recarrega sem cache).
3. No **Início**, filtre por **prova**, tipo de guia (geral/específico) e/ou **assunto**.
4. Em **Abrir questões**, marque A–E e toque em **Ver resposta**; use Anterior/Próxima.
5. Em **Resultados**, veja acertos/erros por assunto.

Questões **anuladas** não entram. Questões com **imagem** no PDF mostram a tag “Imagem no PDF”.

## Regenerar os dados

A partir da pasta do workspace:

```bash
py provas-fgv/build_prova_pwa.py
```

Isso atualiza `data.js` a partir dos textos em `provas-fgv/extracted/`.

O gerador antigo só de gabarito (sem enunciado) continua em `provas-fgv/build_gabarito_html.py`.

## Arquivos

| Arquivo | Função |
|---------|--------|
| `index.html` | Shell + CSS |
| `app.js` | Filtros, quiz, resultados, localStorage |
| `data.js` | Questões geradas (não editar à mão) |
| `manifest.webmanifest` / `sw.js` | PWA |
| `icon.svg`, `favicon-32.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` | Favicon e ícones PWA |
| `gen_icons.py` | Regenera os ícones |
