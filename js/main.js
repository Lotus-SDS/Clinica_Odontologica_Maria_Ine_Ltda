/* =========================================================
   Dra. Maria Inês Rocha Machado — scripts do site
   ========================================================= */
(function () {
  'use strict';

  /* ---- Ajustes rápidos ------------------------------------------------- */
  const CONFIG = {
    // Número do WhatsApp que recebe as solicitações do formulário (DDI+DDD+número)
    whatsapp: '5527999999999',
    // 'whatsapp' abre a conversa já com a mensagem | 'email' abre o cliente de e-mail
    modoEnvio: 'whatsapp',
    email: 'contato@draMariaInes.com.br'
  };

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const html = document.documentElement;

  // O <head> já marca .js (e .anim, quando há movimento) antes da primeira
  // pintura. Aqui só garantimos .js caso aquela linha tenha sido removida.
  html.classList.add('js');
  const comMovimento = html.classList.contains('anim');

  /* ---- Ano no rodapé --------------------------------------------------- */
  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---- Rolagem: header fixo, barra de progresso e voltar ao topo ------- */
  // Um único ouvinte, agrupado por quadro de animação.
  const header = $('#header');
  const toTop = $('#toTop');
  let agendado = false;

  const aoRolar = () => {
    agendado = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) {
      header.classList.toggle('is-stuck', y > 24);
      header.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    }
    if (toTop) toTop.classList.toggle('is-visible', y > window.innerHeight * 1.2);
  };
  aoRolar();
  window.addEventListener('scroll', () => {
    if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  window.addEventListener('resize', aoRolar);

  /* ---- Menu mobile ----------------------------------------------------- */
  const burger = $('#burger');
  const nav = $('#nav');

  if (burger && nav) {
    const focaveis = () =>
      $$('a[href], button:not([disabled])', nav).filter(el => el.offsetParent !== null);

    const abrirMenu = () => {
      nav.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fechar menu');
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      const alvo = focaveis()[0];
      if (alvo) alvo.focus();
    };

    const fecharMenu = ({ devolverFoco = false } = {}) => {
      if (!nav.classList.contains('is-open')) return;
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menu');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
      if (devolverFoco) burger.focus();
    };

    burger.addEventListener('click', () => {
      nav.classList.contains('is-open') ? fecharMenu({ devolverFoco: true }) : abrirMenu();
    });

    $$('a', nav).forEach(a => a.addEventListener('click', () => fecharMenu()));

    // Toque no véu escuro (pseudo-elemento do body) fecha a gaveta.
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') && e.target === document.body) {
        fecharMenu({ devolverFoco: true });
      }
    });

    // Escape fecha; Tab fica preso dentro da gaveta enquanto ela estiver aberta.
    document.addEventListener('keydown', (e) => {
      if (!nav.classList.contains('is-open')) return;

      if (e.key === 'Escape') { fecharMenu({ devolverFoco: true }); return; }
      if (e.key !== 'Tab') return;

      const itens = focaveis();
      if (!itens.length) return;
      const primeiro = itens[0];
      const ultimo = itens[itens.length - 1];

      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault(); ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault(); primeiro.focus();
      }
    });

    // Volta ao estado fechado se a janela crescer além do breakpoint da gaveta.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) fecharMenu();
    });
  }

  /* ---- Entradas na rolagem --------------------------------------------- */
  // Cada seletor recebe um tipo de entrada. O CSS só esconde .rv sob .anim,
  // então sem este bloco (ou sem JS) a página inteira aparece normalmente.
  const ENTRADAS = [
    ['main h2:not(.sr-only)', 'rv--mask'],
    ['.head__lead, .head .demo-note, .split__copy > p, .split__copy > .checks, ' +
     '.split__copy > .btn, .band p, .band__cta, .head__after', ''],
    ['.strip .card, .services .card, #estrutura .card, .quote, .faq details', 'rv--card'],
    ['.frame--about', 'rv--frame'],
    ['.stat', 'rv--pop'],
    ['.info li, .map, .form', ''],
    ['.footer__in > *, .footer__bar', '']
  ];

  const revelarTudo = () => {
    $$('.rv:not(.is-in)').forEach(el => el.classList.add('is-in', 'is-instant'));
  };

  if (comMovimento) {
    const alvos = [];
    ENTRADAS.forEach(([sel, tipo]) => {
      $$(sel).forEach(el => {
        if (el.classList.contains('rv')) return;
        el.classList.add('rv');
        if (tipo) el.classList.add(tipo);
        alvos.push(el);
      });
    });

    const PASSO = 90, TETO = 4;   // escalonamento: 90 ms por item, no máximo 4 passos

    const io = new IntersectionObserver((entradas) => {
      const novos = [];
      entradas.forEach(e => {
        const el = e.target;
        const r = e.boundingClientRect;
        if (e.isIntersecting) {
          // entrou pelo topo (rolando para cima depois de um salto): aparece sem animar
          if (r.top < 0) { el.classList.add('is-in', 'is-instant'); io.unobserve(el); }
          else novos.push(e);
        } else if (r.bottom < 0) {
          // ficou para trás sem ter sido visto (salto de âncora, rolagem muito rápida)
          el.classList.add('is-in', 'is-instant');
          io.unobserve(el);
        }
      });

      // Ordem de leitura (de cima para baixo, da esquerda para a direita), não a
      // ordem em que o navegador entregou as entradas: a coreografia se repete igual.
      novos.sort((a, b) =>
        (Math.round(a.boundingClientRect.top) - Math.round(b.boundingClientRect.top)) ||
        (a.boundingClientRect.left - b.boundingClientRect.left));

      novos.forEach((e, i) => {
        e.target.style.setProperty('--d', Math.min(i, TETO) * PASSO + 'ms');
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

    alvos.forEach(el => io.observe(el));

    // Impressão e troca para "menos movimento" no meio da visita: tudo aparece.
    window.addEventListener('beforeprint', revelarTudo);
    const pedeMenos = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aoMudar = (m) => { if (m.matches) { revelarTudo(); html.classList.remove('anim'); } };
    if (pedeMenos.addEventListener) pedeMenos.addEventListener('change', aoMudar);
  }

  /* ---- Link ativo conforme a seção ------------------------------------- */
  // Mantém um mapa de visibilidade e escolhe a seção mais visível, em vez de
  // acender a última que entrou e nunca apagar.
  const secoes = $$('main section[id]');
  const links = $$('#nav a[href^="#"]');
  if ('IntersectionObserver' in window && secoes.length) {
    const visivel = new Map();
    const spy = new IntersectionObserver((entradas) => {
      entradas.forEach(e => visivel.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));

      let topo = null, maior = 0;
      visivel.forEach((v, id) => { if (v > maior) { maior = v; topo = id; } });

      links.forEach(l => l.classList.toggle('is-active', topo !== null && l.getAttribute('href') === '#' + topo));
    }, { threshold: [0, .25, .5, .75, 1], rootMargin: '-20% 0px -45%' });
    secoes.forEach(s => spy.observe(s));
  }

  /* ---- Mapa: brilho de carregamento até o iframe chegar ---------------- */
  const mapa = $('.map');
  if (mapa) {
    const iframe = $('iframe', mapa);
    const pronto = () => mapa.classList.add('is-loaded');
    if (iframe) iframe.addEventListener('load', pronto, { once: true });
    // Se o Google não responder, o cartão não fica brilhando para sempre.
    if ('IntersectionObserver' in window) {
      const obsMapa = new IntersectionObserver((ents) => {
        if (ents.some(e => e.isIntersecting)) { setTimeout(pronto, 8000); obsMapa.disconnect(); }
      });
      obsMapa.observe(mapa);
    } else {
      pronto();
    }
  }

  /* ---- Dock: sai de cena quando o formulário está na tela --------------- */
  const dock = $('#dock');
  const contato = $('#contato');
  if (dock && contato && 'IntersectionObserver' in window) {
    const obsDock = new IntersectionObserver((entradas) => {
      entradas.forEach(e => dock.classList.toggle('is-hidden', e.isIntersecting));
    }, { threshold: .18 });
    obsDock.observe(contato);
  }

  const dockWpp = $('#dockWpp');
  if (dockWpp) dockWpp.href = `https://wa.me/${CONFIG.whatsapp}`;

  /* ---- Máscara de telefone --------------------------------------------- */
  // Descarta o DDI 55 colado junto (ex.: +55 27 99999-8888) antes de formatar,
  // para não transformar um número correto em outro plausível e errado.
  const tel = $('#tel');
  if (tel) {
    tel.addEventListener('input', () => {
      let v = tel.value.replace(/\D/g, '');
      if (v.length > 11 && v.startsWith('55')) v = v.slice(2);
      v = v.slice(0, 11);

      if (v.length > 6) {
        v = v.length === 11
          ? `(${v.slice(0, 2)}) ${v[2]} ${v.slice(3, 7)}-${v.slice(7)}`
          : `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      } else if (v.length) {
        v = `(${v}`;
      }
      tel.value = v;
    });
  }

  /* ---- Formulário ------------------------------------------------------ */
  const form = $('#form');
  if (form) {
    const nota = $('#formNote');
    const notaPadrao = nota ? nota.textContent : '';
    const botao = $('button[type="submit"]', form);
    const botaoPadrao = botao ? botao.innerHTML : '';

    // Reinicia uma animação de classe mesmo que ela já tenha rodado antes.
    const pulsar = (el, classe) => {
      if (!el) return;
      el.classList.remove(classe);
      void el.offsetWidth;
      el.classList.add(classe);
    };

    const avisar = (conteudo, comoHtml = false) => {
      if (!nota) return;
      if (comoHtml) nota.innerHTML = conteudo; else nota.textContent = conteudo;
      pulsar(nota, 'is-flash');
    };

    const erro = (campo, msg) => {
      const box = campo.closest('div').querySelector('[data-err]');
      if (box) box.textContent = msg || '';
      campo.classList.toggle('is-bad', Boolean(msg));
      campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };

    // O erro some assim que a pessoa corrige o campo, sem esperar novo envio.
    $$('#nome, #tel, #email', form).forEach(campo => {
      campo.addEventListener('input', () => {
        if (campo.classList.contains('is-bad')) erro(campo, '');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = $('#nome'), fone = $('#tel'), mail = $('#email'), lgpd = $('#lgpd');

      // Valida TUDO antes de olhar a autorização, para que os problemas
      // apareçam de uma vez só e não em duas rodadas.
      let ok = true;
      ok = erro(nome, nome.value.trim().length < 3 ? 'Informe seu nome completo.' : '') && ok;
      ok = erro(fone, fone.value.replace(/\D/g, '').length < 10 ? 'Informe um telefone válido com DDD.' : '') && ok;
      ok = erro(mail, mail.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value) ? 'E-mail inválido.' : '') && ok;

      const faltas = [];
      if (!ok) faltas.push('revise os campos destacados');
      if (!lgpd.checked) faltas.push('autorize o contato');

      if (faltas.length) {
        avisar(`Para enviar, ${faltas.join(' e ')}.`);
        $$('.is-bad', form).forEach(c => pulsar(c, 'tremer'));
        if (!lgpd.checked) pulsar(lgpd.closest('.check'), 'tremer');
        const primeiroRuim = $('.is-bad', form) || (!lgpd.checked ? lgpd : null);
        if (primeiroRuim) primeiroRuim.focus();
        return;
      }

      const texto =
        `Olá! Gostaria de agendar uma avaliação.\n\n` +
        `Nome: ${nome.value.trim()}\n` +
        `WhatsApp: ${fone.value}\n` +
        (mail.value ? `E-mail: ${mail.value}\n` : '') +
        `Assunto: ${$('#assunto').value}\n` +
        ($('#msg').value.trim() ? `Mensagem: ${$('#msg').value.trim()}\n` : '');

      if (CONFIG.modoEnvio === 'email') {
        window.location.href =
          `mailto:${CONFIG.email}?subject=${encodeURIComponent('Agendamento pelo site')}&body=${encodeURIComponent(texto)}`;
        avisar('Abrimos seu programa de e-mail com a mensagem pronta.');
        form.reset();
        return;
      }

      const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
      const janela = window.open(url, '_blank', 'noopener');

      // Bloqueador de pop-up, navegador embutido ou aba negada: NÃO limpar o
      // formulário e NÃO dizer que deu certo. Oferecer o link como saída.
      if (!janela) {
        avisar(
          'Não conseguimos abrir o WhatsApp automaticamente. ' +
          `<a href="${url}" target="_blank" rel="noopener">Toque aqui para abrir a conversa</a> — ` +
          'seus dados continuam preenchidos.', true);
        return;
      }

      avisar('Pronto! Conclua o envio na janela do WhatsApp que abriu.');
      if (botao) {
        botao.classList.add('is-done');
        botao.innerHTML = 'Mensagem pronta no WhatsApp <svg class="ico" aria-hidden="true"><use href="#i-check"></use></svg>';
        setTimeout(() => { botao.classList.remove('is-done'); botao.innerHTML = botaoPadrao; }, 5000);
      }
      form.reset();
      $$('[data-err]', form).forEach(b => { b.textContent = ''; });
      $$('.is-bad', form).forEach(c => c.classList.remove('is-bad'));
      setTimeout(() => { if (nota.textContent.startsWith('Pronto')) avisar(notaPadrao); }, 8000);
    });
  }
})();
