/* Prova FGV — só questões-guia; uma questão por vez */
(function () {
  "use strict";

  const DATA = window.PROVA_DATA;
  const main = document.getElementById("main");
  const navStatus = document.getElementById("navStatus");

  if (!DATA || !Array.isArray(DATA.questions) || !DATA.questions.length) {
    main.innerHTML =
      '<p class="empty">Falha ao carregar as questões. Rode <code>py provas-fgv/build_prova_pwa.py</code> e recarregue com Ctrl+F5.</p>';
    navStatus.textContent = "Erro nos dados";
    return;
  }

  const STORAGE_KEY = "prova_fgv_guide_v2";
  const FILTER_KEY = "prova_fgv_filters_v2";
  const PAGE_SIZE = 1;

  function safeObject(raw) {
    if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
    return {};
  }

  function loadStore() {
    try {
      const raw = safeObject(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
      return {
        answers: safeObject(raw.answers),
        revealed: safeObject(raw.revealed),
      };
    } catch (e) {
      return { answers: {}, revealed: {} };
    }
  }

  function saveStore() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function loadFilters() {
    try {
      const raw = safeObject(JSON.parse(localStorage.getItem(FILTER_KEY) || "{}"));
      return {
        examId: typeof raw.examId === "string" ? raw.examId : "",
        subject: typeof raw.subject === "string" ? raw.subject : "",
        guideKind: typeof raw.guideKind === "string" ? raw.guideKind : "",
        index: Number.isFinite(raw.index) && raw.index >= 0 ? raw.index : 0,
      };
    } catch (e) {
      return { examId: "", subject: "", guideKind: "", index: 0 };
    }
  }

  function saveFilters() {
    localStorage.setItem(FILTER_KEY, JSON.stringify(filters));
  }

  let store = loadStore();
  let filters = loadFilters();
  let view = "home";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function filteredQuestions() {
    return DATA.questions.filter(function (q) {
      if (filters.examId && q.examId !== filters.examId) return false;
      if (filters.subject && q.subject !== filters.subject) return false;
      if (filters.guideKind && q.guideKind !== filters.guideKind) return false;
      return true;
    });
  }

  function subjectsForCurrentFilters() {
    var set = {};
    DATA.questions.forEach(function (q) {
      if (filters.examId && q.examId !== filters.examId) return;
      if (filters.guideKind && q.guideKind !== filters.guideKind) return;
      set[q.subject] = true;
    });
    return Object.keys(set).sort();
  }

  function filterLabel() {
    var parts = [];
    if (filters.examId) {
      var ex = DATA.exams.find(function (e) {
        return e.id === filters.examId;
      });
      parts.push(ex ? ex.title : filters.examId);
    } else {
      parts.push("Todas as provas");
    }
    if (filters.guideKind === "geral") parts.push("Guia geral");
    if (filters.guideKind === "esp") parts.push("Guia específico");
    if (filters.subject) parts.push(filters.subject);
    return parts.join(" · ");
  }

  function clampIndex(qs) {
    if (!qs.length) {
      filters.index = 0;
      return;
    }
    if (filters.index >= qs.length) filters.index = qs.length - 1;
    if (filters.index < 0) filters.index = 0;
  }

  function updateNav() {
    var qs = filteredQuestions();
    var answered = qs.filter(function (q) {
      return store.answers[q.id];
    }).length;
    navStatus.textContent =
      answered + "/" + qs.length + " · " + filterLabel();
  }

  function setView(name) {
    view = name;
    document.querySelectorAll(".bottom-nav button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-view") === name);
    });
    render();
  }

  function renderHome() {
    var examId = filters.examId;
    var subject = filters.subject;
    var guideKind = filters.guideKind;
    var subjects = subjectsForCurrentFilters();
    var qs = filteredQuestions();
    var answered = qs.filter(function (q) {
      return store.answers[q.id];
    }).length;
    var checked = qs.filter(function (q) {
      return store.revealed[q.id];
    }).length;

    var examOpts =
      '<option value="">Todas as provas</option>' +
      DATA.exams
        .map(function (e) {
          return (
            '<option value="' +
            esc(e.id) +
            '"' +
            (e.id === examId ? " selected" : "") +
            ">" +
            esc(e.title) +
            " (" +
            e.total +
            ")</option>"
          );
        })
        .join("");

    var subOpts =
      '<option value="">Todos os assuntos</option>' +
      subjects
        .map(function (s) {
          return (
            '<option value="' +
            esc(s) +
            '"' +
            (s === subject ? " selected" : "") +
            ">" +
            esc(s) +
            "</option>"
          );
        })
        .join("");

    return (
      "<h1>Questões-guia do edital</h1>" +
      '<p class="lead">Apenas as questões alinhadas ao edital Dataprev. Filtre por prova e/ou assunto, responda e confira com <strong>Ver resposta</strong>.</p>' +
      '<div class="panel">' +
      "<h2>Filtros</h2>" +
      '<label class="field" for="selExam">Prova</label>' +
      '<select id="selExam">' +
      examOpts +
      "</select>" +
      '<label class="field" for="selKind">Tipo de guia</label>' +
      '<select id="selKind">' +
      '<option value="">Geral + específico</option>' +
      '<option value="geral"' +
      (guideKind === "geral" ? " selected" : "") +
      ">Só guia geral (Módulo I)</option>" +
      '<option value="esp"' +
      (guideKind === "esp" ? " selected" : "") +
      ">Só guia específico (Módulo II)</option>" +
      "</select>" +
      '<label class="field" for="selSubject">Assunto</label>' +
      '<select id="selSubject">' +
      subOpts +
      "</select>" +
      '<p class="lead" style="margin:0">' +
      "Neste filtro: <strong>" +
      qs.length +
      "</strong> questões · <strong>" +
      answered +
      "</strong> respondidas · <strong>" +
      checked +
      "</strong> conferidas</p>" +
      '<div class="meta-chips">' +
      '<span class="chip accent">Só checklist do edital</span>' +
      '<span class="chip warn">Anuladas excluídas</span>' +
      '<span class="chip img">Imagem → PDF</span>' +
      "</div>" +
      '<div class="row" style="margin-top:1rem">' +
      '<button type="button" class="btn btn-primary" id="btnStart">Abrir questões</button>' +
      '<button type="button" class="btn btn-secondary" id="btnResults">Ver resultados</button>' +
      "</div></div>" +
      '<div class="panel"><h2>Provas (questões-guia)</h2>' +
      DATA.exams
        .map(function (e) {
          var an = (e.anuladas || []).length
            ? " · " + e.anuladas.length + " anulada(s) fora"
            : "";
          return (
            '<div class="mini-q"><strong>' +
            esc(e.title) +
            '</strong><span class="chip">' +
            e.total +
            " guia" +
            an +
            "</span></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderQuestionCard(q) {
    var picked = store.answers[q.id] || "";
    var revealed = !!store.revealed[q.id];
    var cardClass = "q-card";
    var feedback = "";

    if (revealed) {
      var ok = picked === q.answer;
      cardClass += ok ? " ok" : " err";
      feedback = ok
        ? '<span class="feedback ok">✓ Correto — gabarito ' + esc(q.answer) + "</span>"
        : '<span class="feedback err">✗ Incorreto — gabarito ' +
          esc(q.answer) +
          (picked ? " (você: " + esc(picked) + ")" : "") +
          "</span>";
    }

    var opts = "ABCDE"
      .split("")
      .map(function (letter) {
        var cls = "opt";
        if (picked === letter) cls += " selected";
        if (revealed) {
          if (letter === q.answer) cls += " correct";
          else if (picked === letter) cls += " wrong";
        }
        return (
          '<button type="button" class="' +
          cls +
          '" data-action="pick" data-qid="' +
          esc(q.id) +
          '" data-letter="' +
          letter +
          '"' +
          (revealed ? " disabled" : "") +
          '><span class="opt-letter">' +
          letter +
          '</span><span class="opt-text">' +
          esc(q.options[letter] || "") +
          "</span></button>"
        );
      })
      .join("");

    var imgBanner = q.hasImage
      ? '<div class="img-banner">🖼 Esta questão tem imagem no enunciado. Consulte a figura no PDF (' +
        esc(q.examTitle) +
        ", Q" +
        q.n +
        ").</div>"
      : "";

    var actionBtn = revealed
      ? '<button type="button" class="btn btn-ghost" data-action="hide" data-qid="' +
        esc(q.id) +
        '">Ocultar gabarito</button>'
      : '<button type="button" class="btn btn-primary" data-action="reveal" data-qid="' +
        esc(q.id) +
        '"' +
        (picked ? "" : " disabled") +
        ">Ver resposta</button>";

    return (
      '<article class="' +
      cardClass +
      '" id="current-q">' +
      '<div class="q-head">' +
      '<span class="q-num">Q' +
      q.n +
      "</span>" +
      '<span class="chip">' +
      esc(q.subject) +
      "</span>" +
      (q.guideKind === "geral"
        ? '<span class="chip accent">Geral</span>'
        : '<span class="chip warn">Específico</span>') +
      (q.hasImage ? '<span class="chip img">Imagem no PDF</span>' : "") +
      '<span class="q-exam">' +
      esc(q.examTitle) +
      "</span></div>" +
      imgBanner +
      '<p class="lead" style="margin:0 0 .65rem;font-size:.8rem">' +
      esc(q.topic) +
      (q.tags ? " · " + esc(q.tags) : "") +
      "</p>" +
      '<div class="stem">' +
      esc(q.stem) +
      "</div>" +
      '<div class="opts">' +
      opts +
      "</div>" +
      '<div class="q-actions">' +
      actionBtn +
      feedback +
      "</div></article>"
    );
  }

  function renderQuiz() {
    var qs = filteredQuestions();
    if (!qs.length) {
      return (
        '<p class="empty">Nenhuma questão-guia com estes filtros.</p>' +
        '<div class="row"><button type="button" class="btn btn-secondary" data-action="go-home">Voltar ao início</button></div>'
      );
    }

    clampIndex(qs);
    var q = qs[filters.index];
    var pos = filters.index + 1;

    return (
      '<div class="toolbar-sticky">' +
      '<div class="row" style="justify-content:space-between;width:100%">' +
      "<div><strong>" +
      pos +
      "</strong> / " +
      qs.length +
      ' <span style="color:var(--muted);font-size:.8rem">· ' +
      esc(filterLabel()) +
      "</span></div>" +
      '<div class="row">' +
      '<button type="button" class="btn btn-secondary" data-action="prev"' +
      (filters.index <= 0 ? " disabled" : "") +
      ">Anterior</button>" +
      '<button type="button" class="btn btn-secondary" data-action="next"' +
      (filters.index >= qs.length - 1 ? " disabled" : "") +
      ">Próxima</button>" +
      "</div></div></div>" +
      renderQuestionCard(q)
    );
  }

  function renderResults() {
    var qs = filteredQuestions();
    var answered = qs.filter(function (q) {
      return store.answers[q.id];
    });
    var checked = answered.filter(function (q) {
      return store.revealed[q.id];
    });
    var correct = checked.filter(function (q) {
      return store.answers[q.id] === q.answer;
    });
    var wrong = checked.filter(function (q) {
      return store.answers[q.id] !== q.answer;
    });

    var byTheme = {};
    checked.forEach(function (q) {
      var key = q.subject;
      if (!byTheme[key]) byTheme[key] = { ok: [], err: [] };
      if (store.answers[q.id] === q.answer) byTheme[key].ok.push(q);
      else byTheme[key].err.push(q);
    });

    var themes = Object.keys(byTheme).sort();
    var themeHtml;
    if (!themes.length) {
      themeHtml =
        '<p class="empty">Ainda não há questões conferidas neste filtro. Abra as questões e use “Ver resposta”.</p>';
    } else {
      themeHtml = themes
        .map(function (theme) {
          var block = byTheme[theme];
          var total = block.ok.length + block.err.length;
          var pct = Math.round((block.ok.length / total) * 100);
          var lines = block.ok
            .concat(block.err)
            .sort(function (a, b) {
              return a.examTitle.localeCompare(b.examTitle) || a.n - b.n;
            })
            .map(function (q) {
              var ok = store.answers[q.id] === q.answer;
              return (
                '<div class="mini-q ' +
                (ok ? "ok" : "err") +
                '"><strong>' +
                (ok ? "✓" : "✗") +
                " Q" +
                q.n +
                "</strong><span>" +
                esc(q.examTitle) +
                '</span><span class="chip">' +
                esc(store.answers[q.id]) +
                " → " +
                esc(q.answer) +
                "</span><span class=\"chip\">" +
                esc(q.topic) +
                "</span></div>"
              );
            })
            .join("");
          return (
            '<div class="theme-block"><h3>' +
            esc(theme) +
            " — " +
            block.ok.length +
            "/" +
            total +
            " (" +
            pct +
            "%)</h3>" +
            lines +
            "</div>"
          );
        })
        .join("");
    }

    return (
      "<h1>Resultados</h1>" +
      '<p class="lead">' +
      esc(filterLabel()) +
      "</p>" +
      '<div class="stat-grid">' +
      '<div class="stat"><div class="val">' +
      qs.length +
      '</div><div class="lbl">No filtro</div></div>' +
      '<div class="stat"><div class="val">' +
      answered.length +
      '</div><div class="lbl">Respondidas</div></div>' +
      '<div class="stat"><div class="val" style="color:var(--ok)">' +
      correct.length +
      '</div><div class="lbl">Acertos</div></div>' +
      '<div class="stat"><div class="val" style="color:var(--err)">' +
      wrong.length +
      '</div><div class="lbl">Erros</div></div></div>' +
      '<div class="row" style="margin-bottom:1rem">' +
      '<button type="button" class="btn btn-secondary" data-action="clear-progress">Limpar progresso deste filtro</button>' +
      "</div>" +
      '<h2 style="font-size:1rem;margin:0 0 .75rem">Por assunto</h2>' +
      themeHtml
    );
  }

  function render() {
    try {
      updateNav();
      if (view === "home") main.innerHTML = renderHome();
      else if (view === "quiz") main.innerHTML = renderQuiz();
      else main.innerHTML = renderResults();
    } catch (err) {
      console.error(err);
      main.innerHTML =
        '<p class="empty">Erro ao montar a tela: ' +
        esc(err && err.message ? err.message : String(err)) +
        ". Recarregue com Ctrl+F5.</p>";
    }
  }

  function onPick(qid, letter) {
    if (store.revealed[qid]) return;
    store.answers[qid] = letter;
    saveStore();
    var qs = filteredQuestions();
    var q = qs[filters.index];
    if (q && q.id === qid) {
      main.innerHTML = renderQuiz();
      updateNav();
    } else {
      render();
    }
  }

  function onReveal(qid) {
    if (!store.answers[qid]) return;
    store.revealed[qid] = true;
    saveStore();
    render();
  }

  function onHide(qid) {
    delete store.revealed[qid];
    saveStore();
    render();
  }

  function goDelta(delta) {
    var qs = filteredQuestions();
    if (!qs.length) return;
    filters.index = Math.max(0, Math.min(qs.length - 1, filters.index + delta));
    saveFilters();
    render();
    window.scrollTo(0, 0);
  }

  main.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-action], #btnStart, #btnResults");
    if (!t) return;

    if (t.id === "btnStart") {
      filters.index = 0;
      saveFilters();
      setView("quiz");
      return;
    }
    if (t.id === "btnResults") {
      setView("results");
      return;
    }

    var action = t.getAttribute("data-action");
    if (!action) return;

    if (action === "pick") {
      onPick(t.getAttribute("data-qid"), t.getAttribute("data-letter"));
    } else if (action === "reveal") {
      onReveal(t.getAttribute("data-qid"));
    } else if (action === "hide") {
      onHide(t.getAttribute("data-qid"));
    } else if (action === "prev") {
      goDelta(-1);
    } else if (action === "next") {
      goDelta(1);
    } else if (action === "go-home") {
      setView("home");
    } else if (action === "clear-progress") {
      var qs = filteredQuestions();
      if (!qs.length) return;
      if (
        !confirm(
          "Limpar respostas e conferências das " + qs.length + " questões deste filtro?"
        )
      ) {
        return;
      }
      qs.forEach(function (q) {
        delete store.answers[q.id];
        delete store.revealed[q.id];
      });
      saveStore();
      render();
    }
  });

  main.addEventListener("change", function (ev) {
    var t = ev.target;
    if (!t) return;
    if (t.id === "selExam") {
      filters.examId = t.value;
      filters.index = 0;
      if (filters.subject && subjectsForCurrentFilters().indexOf(filters.subject) < 0) {
        filters.subject = "";
      }
      saveFilters();
      render();
    } else if (t.id === "selSubject") {
      filters.subject = t.value;
      filters.index = 0;
      saveFilters();
      render();
    } else if (t.id === "selKind") {
      filters.guideKind = t.value;
      filters.index = 0;
      if (filters.subject && subjectsForCurrentFilters().indexOf(filters.subject) < 0) {
        filters.subject = "";
      }
      saveFilters();
      render();
    }
  });

  document.querySelectorAll(".bottom-nav button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setView(btn.getAttribute("data-view"));
    });
  });

  setView("home");
})();
