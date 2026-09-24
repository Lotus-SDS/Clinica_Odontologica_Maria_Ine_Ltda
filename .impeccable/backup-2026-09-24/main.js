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

  /* ---- Ano no rodapé --------------------------------------------------- */
  const ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---- Header fixo ----------------------------------------------------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Menu mobile ----------------------------------------------------- */
  const burger = $('#burger');
  const nav = $('#nav');

  const fecharMenu = () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    const aberto = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(aberto));
    document.body.style.overflow = aberto ? 'hidden' : '';
  });

  $$('#nav a').forEach(a => a.addEventListener('click', fecharMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharMenu(); });

  /* ---- Revelar ao rolar ------------------------------------------------ */
  const alvos = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e, i) => {
        if (!e.isIntersecting) return;
        setTimeout(() => e.target.classList.add('is-in'), (i % 4) * 90);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    alvos.forEach(el => obs.observe(el));
  } else {
    alvos.forEach(el => el.classList.add('is-in'));
  }

  /* ---- Link ativo conforme a seção ------------------------------------- */
  const secoes = $$('main section[id]');
  const links = $$('#nav a[href^="#"]');
  if ('IntersectionObserver' in window && secoes.length) {
    const spy = new IntersectionObserver((entradas) => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50%' });
    secoes.forEach(s => spy.observe(s));
  }

  /* ---- Slider de depoimentos ------------------------------------------- */
  const slider = $('[data-slider]');
  if (slider) {
    const track = $('[data-track]', slider);
    const itens = $$('.quote', track);
    const dots  = $('[data-dots]', slider);
    let idx = 0, timer = null;

    const porVista = () => (window.innerWidth <= 640 ? 1 : window.innerWidth <= 1080 ? 2 : 3);
    const maxIdx = () => Math.max(0, itens.length - porVista());

    function render() {
      idx = Math.min(idx, maxIdx());
      track.style.transform = `translateX(-${idx * (100 / porVista())}%)`;
      $$('button', dots).forEach((b, i) => b.classList.toggle('is-on', i === idx));
    }

    function montarDots() {
      dots.innerHTML = '';
      for (let i = 0; i <= maxIdx(); i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Ir para o depoimento ${i + 1}`);
        b.addEventListener('click', () => { idx = i; render(); reiniciar(); });
        dots.appendChild(b);
      }
    }

    const ir = (passo) => {
      idx = (idx + passo + (maxIdx() + 1)) % (maxIdx() + 1);
      render();
    };

    $('[data-prev]', slider).addEventListener('click', () => { ir(-1); reiniciar(); });
    $('[data-next]', slider).addEventListener('click', () => { ir(1);  reiniciar(); });

    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function reiniciar() {
      clearInterval(timer);
      if (!reduzir) timer = setInterval(() => ir(1), 6500);
    }

    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', reiniciar);

    // arrastar no toque
    let x0 = null;
    track.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { ir(dx < 0 ? 1 : -1); reiniciar(); }
      x0 = null;
    });

    let redim;
    window.addEventListener('resize', () => {
      clearTimeout(redim);
      redim = setTimeout(() => { montarDots(); render(); }, 180);
    });

    montarDots(); render(); reiniciar();
  }

  /* ---- Máscara de telefone --------------------------------------------- */
  const tel = $('#tel');
  if (tel) {
    tel.addEventListener('input', () => {
      let v = tel.value.replace(/\D/g, '').slice(0, 11);
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

    const erro = (campo, msg) => {
      const box = campo.closest('div').querySelector('[data-err]');
      if (box) box.textContent = msg || '';
      campo.classList.toggle('is-bad', Boolean(msg));
      return !msg;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = $('#nome'), fone = $('#tel'), mail = $('#email'), lgpd = $('#lgpd');

      let ok = true;
      ok = erro(nome, nome.value.trim().length < 3 ? 'Informe seu nome completo.' : '') && ok;
      ok = erro(fone, fone.value.replace(/\D/g, '').length < 10 ? 'Informe um telefone válido com DDD.' : '') && ok;
      ok = erro(mail, mail.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value) ? 'E-mail inválido.' : '') && ok;

      if (!lgpd.checked) {
        nota.textContent = 'É preciso autorizar o contato para enviar a solicitação.';
        return;
      }
      if (!ok) { nota.textContent = 'Revise os campos destacados.'; return; }

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
      } else {
        window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      }

      nota.textContent = 'Solicitação preparada! Conclua o envio na janela que abriu.';
      form.reset();
    });
  }
})();
