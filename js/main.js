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

  // Marca que o JS está vivo. O CSS só anima o hero sob .js, então uma falha
  // de script deixa a página inteira visível em vez de escondê-la.
  document.documentElement.classList.add('js');

  /* ---- Ano no rodapé --------------------------------------------------- */
  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---- Header fixo ----------------------------------------------------- */
  const header = $('#header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Menu mobile ----------------------------------------------------- */
  const burger = $('#burger');
  const nav = $('#nav');

  if (burger && nav) {
    const focaveis = () =>
      $$('a[href], button:not([disabled])', nav).filter(el => el.offsetParent !== null);

    const abrirMenu = () => {
      nav.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const alvo = focaveis()[0];
      if (alvo) alvo.focus();
    };

    const fecharMenu = ({ devolverFoco = false } = {}) => {
      if (!nav.classList.contains('is-open')) return;
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (devolverFoco) burger.focus();
    };

    burger.addEventListener('click', () => {
      nav.classList.contains('is-open') ? fecharMenu({ devolverFoco: true }) : abrirMenu();
    });

    $$('a', nav).forEach(a => a.addEventListener('click', () => fecharMenu()));

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

    const erro = (campo, msg) => {
      const box = campo.closest('div').querySelector('[data-err]');
      if (box) box.textContent = msg || '';
      campo.classList.toggle('is-bad', Boolean(msg));
      campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    };

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
        nota.textContent = `Para enviar, ${faltas.join(' e ')}.`;
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
        nota.textContent = 'Abrimos seu programa de e-mail com a mensagem pronta.';
        form.reset();
        return;
      }

      const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
      const janela = window.open(url, '_blank', 'noopener');

      // Bloqueador de pop-up, navegador embutido ou aba negada: NÃO limpar o
      // formulário e NÃO dizer que deu certo. Oferecer o link como saída.
      if (!janela) {
        nota.innerHTML =
          'Não conseguimos abrir o WhatsApp automaticamente. ' +
          `<a href="${url}" target="_blank" rel="noopener">Toque aqui para abrir a conversa</a> — ` +
          'seus dados continuam preenchidos.';
        return;
      }

      nota.textContent = 'Pronto! Conclua o envio na janela do WhatsApp que abriu.';
      form.reset();
      $$('[data-err]', form).forEach(b => { b.textContent = ''; });
      $$('.is-bad', form).forEach(c => c.classList.remove('is-bad'));
      setTimeout(() => { if (nota.textContent.startsWith('Pronto')) nota.textContent = notaPadrao; }, 8000);
    });
  }
})();
