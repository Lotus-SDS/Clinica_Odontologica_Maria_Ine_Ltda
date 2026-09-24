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
const SEG_TOPO   = 2.0;  // pausa no topo
const SEG_FIM    = 2.5;  // pausa no rodapé

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });

await page.goto(SITE, { waitUntil: 'load' });
// fontes + mapa
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(3500);

// rolagem instantânea (o site usa scroll suave, que atrasaria cada quadro)
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });

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

// pausa no topo (deixa a animação de entrada do hero rodar)
for (let k = 0; k < nTopo; k++) { await tirar(); await page.waitForTimeout(40); }

// rolagem com aceleração/desaceleração suave nas pontas
for (let k = 1; k <= nScroll; k++) {
  const t = k / nScroll;
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  await page.evaluate(y => window.scrollTo(0, y), Math.round(e * max));
  await page.waitForTimeout(30);   // deixa as animações de revelar acontecerem
  await tirar();
}

// pausa no rodapé
for (let k = 0; k < nFim; k++) { await tirar(); await page.waitForTimeout(40); }

console.log('quadros:', i);
await browser.close();
