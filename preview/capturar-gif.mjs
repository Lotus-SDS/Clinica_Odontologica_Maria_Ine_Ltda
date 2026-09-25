import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Caminho derivado da localização deste arquivo: roda em qualquer máquina.
const AQUI   = path.dirname(fileURLToPath(import.meta.url));
const SITE   = process.env.SITE_URL || pathToFileURL(path.join(AQUI, '..', 'index.html')).href;
const OUT    = process.argv[2] || './frames';

// RETRATO DE CELULAR, não paisagem de desktop.
// A apresentação chega por WhatsApp e é assistida no telefone. Capturar em
// 1280x800 e exibir num aparelho de ~390px reduz tudo a 30%: o corpo do texto
// vira 4,9px e nenhuma frase do site é legível no momento que decide a venda.
// Em 390x844 cada letra é renderizada 1:1 e o quadro preenche a tela.
// Os valores abaixo são o padrão (mobile). Para gerar a versão desktop sem
// editar o arquivo, sobrescreva por variável de ambiente:
//   VP_W=1280 VP_H=800 VP_DPR=2 SEG_SCROLL=30 node capturar-gif.mjs ./frames
const W = Number(process.env.VP_W) || 390;
const H = Number(process.env.VP_H) || 844;
const FPS = Number(process.env.VP_FPS) || 30;
const DPR = Number(process.env.VP_DPR) || 3;   // 3 = captura em triplo e reduz depois (mais nitidez)

// A página no celular tem ~14.400px (contra ~7.900 no desktop), porque os
// depoimentos deixaram de ser carrossel e as dúvidas abrem por padrão — nada
// mais depende de clique. Mais altura exige mais tempo: 50s dá ~270px/s.
// Diminua para uma peça mais curta; aumente para dar mais tempo de leitura.
const SEG_SCROLL = Number(process.env.SEG_SCROLL) || 50;   // segundos de rolagem
const SEG_TOPO   = 3.5;  // pausa no topo: a abertura do hero dura ~3,3s
const SEG_FIM    = 2.5;  // pausa no rodapé

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });

// RELÓGIO DE VÍDEO
// Cada captura em DPR 3 leva bem mais que os 33 ms de um quadro a 30 fps. Se as
// animações do site corressem em tempo real, no vídeo elas pareceriam pular.
// Então congelamos todas as animações CSS desde o primeiro instante e, a cada
// quadro, avançamos exatamente 1000/FPS ms. A abertura do hero também entra no
// vídeo, em vez de terminar durante a espera pelas fontes.
await page.addInitScript(() => {
  const congelar = () => {
    const st = document.createElement('style');
    st.id = 'captura-congela';
    st.textContent = '*,*::before,*::after{animation-play-state:paused !important}';
    document.documentElement.appendChild(st);
  };
  if (document.documentElement) congelar();
  else document.addEventListener('readystatechange', congelar, { once: true });
});

await page.goto(SITE, { waitUntil: 'load' });
// fontes + mapa
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(3500);

// rolagem instantânea (o site usa scroll suave, que atrasaria cada quadro)
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });

// Assume o controle: toda animação existente volta ao início, pausada pela API
// (pause() tem precedência sobre animation-play-state), e o congelamento sai.
await page.evaluate(() => {
  document.getAnimations().forEach(a => { a.pause(); a.currentTime = 0; });
  document.getElementById('captura-congela')?.remove();
});

const QUADRO_MS = 1000 / FPS;
// Espera o navegador processar a rolagem (IntersectionObserver incluso), pausa o
// que nasceu nesse meio-tempo e avança todas as animações em um quadro de vídeo.
const avancar = () => page.evaluate(async (ms) => {
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  for (const a of document.getAnimations()) {
    if (a.playState === 'finished') continue;
    a.pause();
    a.currentTime = (a.currentTime || 0) + ms;
  }
}, QUADRO_MS);

const max = await page.evaluate(() => {
  window.scrollTo(0, 0);
  return document.documentElement.scrollHeight - window.innerHeight;
});
console.log('altura rolável:', max, 'px');

const nTopo   = Math.round(SEG_TOPO * FPS);
const nScroll = Math.round(SEG_SCROLL * FPS);
const nFim    = Math.round(SEG_FIM * FPS);
let i = 0;

const tirar = async () => {
  await page.screenshot({ path: path.join(OUT, `f${String(++i).padStart(4, '0')}.png`) });
};

// pausa no topo (a abertura do hero roda aqui, quadro a quadro)
for (let k = 0; k < nTopo; k++) { await avancar(); await tirar(); }

// rolagem com aceleração/desaceleração suave nas pontas
for (let k = 1; k <= nScroll; k++) {
  const t = k / nScroll;
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  await page.evaluate(y => window.scrollTo(0, y), Math.round(e * max));
  await avancar();                 // as entradas na rolagem andam no tempo do vídeo
  await tirar();
}

// pausa no rodapé
for (let k = 0; k < nFim; k++) { await avancar(); await tirar(); }

console.log('quadros:', i);
await browser.close();
