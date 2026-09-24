import { chromium } from 'playwright';

const OUT = '/home/pedrin/leads/Dra-Maria-Inês-Rocha-Machado/assets';

const ICONES = {
  dentista: `<path d="M32 12c4-2.2 9-2.4 11.7.6 2.9 3.2 2.5 8.2 1.5 12.5-.9 3.6-1.4 5.4-1.9 9.4-.5 4.1-1.3 9.5-4.3 9.5-2.7 0-3-3.9-3.6-7.4-.5-3.6-1-6.8-3.8-6.8s-3.3 3.2-3.8 6.8c-.6 3.5-.9 7.4-3.6 7.4-3 0-3.8-5.4-4.3-9.5-.5-4-1-5.8-1.9-9.4-1-4.3-1.4-9.3 1.5-12.5C23 9.6 28 9.8 32 12Z"/>`,
  pessoa: `<circle cx="32" cy="20" r="10"/><path d="M12 54c0-11 9-20 20-20s20 9 20 20"/>`,
  recepcao: `<path d="M8 50V26l24-14 24 14v24"/><path d="M8 50h48"/><rect x="24" y="34" width="16" height="16" rx="2"/>`,
  cadeira: `<path d="M14 20a6 6 0 0 1 12 0v16h18a8 8 0 0 1 0 16H26a12 12 0 0 1-12-12Z"/><path d="M20 52v8M44 52v8"/>`,
  esteril: `<path d="M32 58s18-8 18-22V14L32 7 14 14v22c0 14 18 22 18 22Z"/><path d="M24 31l6 6 11-11"/>`
};

const base = (w, h, titulo, sub, icone, dim) => `
<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${w}px;height:${h}px;overflow:hidden;font-family:Inter,sans-serif;
    background:
      radial-gradient(120% 100% at 78% 6%, rgba(127,182,227,.55), transparent 60%),
      linear-gradient(150deg,#CFE4F6 0%,#E9F2FA 48%,#F7FBFE 100%);
    display:flex;align-items:center;justify-content:center;position:relative}
  body::before{content:"";position:absolute;inset:0;
    background-image:radial-gradient(rgba(31,111,178,.16) 1.4px, transparent 1.4px);
    background-size:22px 22px;opacity:.5}
  body::after{content:"";position:absolute;inset:${Math.round(Math.min(w,h)*.045)}px;
    border:1.5px dashed rgba(31,111,178,.32);border-radius:${Math.round(Math.min(w,h)*.03)}px}
  .box{position:relative;text-align:center;color:#0E2137;padding:0 8%}
  svg{width:${Math.round(Math.min(w,h)*.22)}px;height:${Math.round(Math.min(w,h)*.22)}px;
    fill:none;stroke:#1F6FB2;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;opacity:.75}
  h1{font-family:'Playfair Display',serif;font-size:${Math.round(Math.min(w,h)*.072)}px;
    margin:${Math.round(Math.min(w,h)*.035)}px 0 ${Math.round(Math.min(w,h)*.018)}px;letter-spacing:-.01em}
  p{font-size:${Math.round(Math.min(w,h)*.032)}px;color:#52697F;line-height:1.5}
  .tag{display:inline-block;margin-top:${Math.round(Math.min(w,h)*.045)}px;
    padding:${Math.round(Math.min(w,h)*.016)}px ${Math.round(Math.min(w,h)*.04)}px;
    border-radius:99px;background:rgba(31,111,178,.12);border:1px solid rgba(31,111,178,.28);
    color:#0E4C82;font-size:${Math.round(Math.min(w,h)*.026)}px;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
</style></head><body>
<div class="box">
  <svg viewBox="0 0 64 64">${icone}</svg>
  <h1>${titulo}</h1>
  <p>${sub}</p>
  <div class="tag">imagem provisória · ${dim}</div>
</div></body></html>`;

const social = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>
 *{margin:0;padding:0;box-sizing:border-box}
 body{width:1200px;height:630px;font-family:Inter,sans-serif;color:#fff;position:relative;overflow:hidden;
   background:radial-gradient(800px 420px at 80% 10%, rgba(127,182,227,.35), transparent 60%),
              linear-gradient(135deg,#0B2B47,#123C63 65%,#0E4C82)}
 .in{position:absolute;inset:0;padding:70px 80px;display:flex;flex-direction:column;justify-content:center}
 .eb{font-size:16px;letter-spacing:.24em;text-transform:uppercase;color:#7FB6E3;font-weight:500;margin-bottom:26px}
 h1{font-family:'Playfair Display',serif;font-size:74px;line-height:1.05;font-weight:900;letter-spacing:-.02em}
 h1 span{color:#7FB6E3}
 p{margin-top:26px;font-size:24px;color:rgba(255,255,255,.75);max-width:22ch}
 .ln{position:absolute;right:-90px;bottom:-120px;width:520px;height:520px;border-radius:50%;
   border:1px solid rgba(127,182,227,.3)}
 .ln2{position:absolute;right:20px;top:-160px;width:380px;height:380px;border-radius:50%;
   background:radial-gradient(circle,rgba(127,182,227,.22),transparent 65%)}
 .bar{position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#7FB6E3,#1F6FB2)}
 .ft{position:absolute;left:80px;bottom:52px;font-size:18px;color:rgba(255,255,255,.6);letter-spacing:.04em}
</style></head><body>
 <div class="ln"></div><div class="ln2"></div>
 <div class="in">
   <div class="eb">Praia do Canto · Vitória — ES</div>
   <h1>Consultório Odontológico<br><span>Dra. Maria Inês</span> Rocha Machado</h1>
   <p>Odontologia moderna e atendimento humanizado.</p>
 </div>
 <div class="ft">(27) 3227-2022 · Av. N. Sra. da Penha, 714</div>
 <div class="bar"></div>
</body></html>`;

const itens = [
  { arq:'dra-maria-ines.jpg', w:900,  h:1200, t:'Retrato da Dra.',        s:'Foto vertical da Dra. Maria Inês — seção principal do site.',      i:ICONES.pessoa },
  { arq:'consultorio-dra.jpg',w:1000, h:1000, t:'Dra. em atendimento',    s:'Foto quadrada para a seção “A Dra. Maria Inês”.',                  i:ICONES.dentista },
  { arq:'estrutura-1.jpg',    w:1200, h:900,  t:'Recepção',               s:'Ambiente de espera do consultório.',                               i:ICONES.recepcao },
  { arq:'estrutura-2.jpg',    w:1200, h:900,  t:'Consultório',            s:'Sala de atendimento e equipamentos.',                              i:ICONES.cadeira },
  { arq:'estrutura-3.jpg',    w:1200, h:900,  t:'Esterilização',          s:'Central de biossegurança e instrumentais.',                        i:ICONES.esteril }
];

const browser = await chromium.launch();
for (const it of itens) {
  const page = await browser.newPage({ viewport:{ width:it.w, height:it.h }, deviceScaleFactor:1 });
  await page.setContent(base(it.w, it.h, it.t, it.s, it.i, `${it.w}×${it.h}`), { waitUntil:'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  await page.screenshot({ path:`${OUT}/${it.arq}`, type:'jpeg', quality:88 });
  await page.close();
  console.log('ok', it.arq, `${it.w}x${it.h}`);
}
const p = await browser.newPage({ viewport:{ width:1200, height:630 }, deviceScaleFactor:1 });
await p.setContent(social, { waitUntil:'load' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(900);
await p.screenshot({ path:`${OUT}/og-capa.jpg`, type:'jpeg', quality:90 });
console.log('ok og-capa.jpg 1200x630');
await browser.close();
