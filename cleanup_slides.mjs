import fs from 'fs';

const htmlPath = 'c:/Users/juice/Desktop/PROJETOS/aula-ai-agents/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Recreate Slide 2 (Anthropic)
const anthropicRegex = /<!-- ══ S2: ANTHROPIC ══ -->[\s\S]*?<!-- ══ S3: ANDREJ KARPATHY ══ -->/;
const newAnthropic = `<!-- ══ S2: ANTHROPIC ══ -->
<div class="slide" data-i="1">
  <div class="bg-orb" style="width:500px;height:500px;top:-150px;right:-100px;background:rgba(26,86,255,.06)"></div>
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--gold3),transparent);z-index:10"></div>
  <div class="si" style="justify-content:center;align-items:center;padding:44px 64px">
    <div style="max-width:900px;width:100%;background:#fff;padding:50px 60px;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.08);border:1px solid var(--ln);display:flex;flex-direction:column">
       <div style="font-family:'Georgia',serif;font-size:40px;font-weight:700;color:#111;line-height:1.2;margin-bottom:16px;letter-spacing:-0.02em">IA já escreve 90% do código da Anthropic, mas CEO considera engenheiros essenciais</div>
       <div style="font-size:17px;color:#555;line-height:1.5;margin-bottom:30px;max-width:800px;font-family:var(--dp)">Apesar de o chatbot Claude escrever a maioria do código, o CEO Dario Amodei diz que o foco se move para a supervisão e edição, exigindo "mais" engenheiros.</div>
       <div style="width:100%;height:340px;border-radius:8px;background-image:url('assets/anthropic_article.png');background-size:cover;background-position:center 70%"></div>
       <div style="font-size:12px;color:#888;margin-top:12px;font-family:var(--dp)">Dario Amodei: CEO da Anthropic (Kimberly White/Getty Images)</div>
    </div>
  </div>
</div>
<!-- ══ S3: ANDREJ KARPATHY ══ -->`;
html = html.replace(anthropicRegex, newAnthropic);

// 2. Remove Andrej Karpathy (Slide 3)
const andrejRegex = /<!-- ══ S3: ANDREJ KARPATHY ══ -->[\s\S]*?<!-- ══ S4: PONTO DE INFLEXÃO ══ -->/;
html = html.replace(andrejRegex, '<!-- ══ S4: PONTO DE INFLEXÃO ══ -->');

// 3. Remove Sobre Mim (Slide 5, currently marked as S2 in comments from reordering)
const sobreMimRegex = /<!-- ══ S2: SOBRE MIM ══ -->[\s\S]*?<!-- ══ S5: ENTÃO NÃO TEREMOS PROGRAMADORES\? ══ -->/;
html = html.replace(sobreMimRegex, '<!-- ══ S5: ENTÃO NÃO TEREMOS PROGRAMADORES? ══ -->');

// 4. Remove S15: E OS AI AGENTS? and move subtitle to S16
const s15Regex = /<!-- ══ S15: E OS AI AGENTS\? ══ -->[\s\S]*?<p style="margin-top:24px;font-size:16px;color:var\(--tx5\);max-width:500px">([^<]+)<\/p>[\s\S]*?<!-- ══ S16: ESTRUTURA BÁSICA DO AGENTE ══ -->/;
const s15Match = s15Regex.exec(html);
if (s15Match) {
  const subtitle = s15Match[1];
  html = html.replace(s15Regex, '<!-- ══ S16: ESTRUTURA BÁSICA DO AGENTE ══ -->');
  
  // Inject into S16
  const s16Target = '<h2 class="h1" style="margin-bottom:20px">Estrutura básica<br><em>de um agente</em></h2>\n    <div class="div" style="margin-bottom:28px"></div>';
  html = html.replace(s16Target, s16Target + `\n    <p class="lede" style="margin-bottom:24px;font-size:15px">${subtitle}</p>`);
}

// 5. Remove S18: COMO EU CRIO UM AGENTE? and move subtitle to S19
const s18Regex = /<!-- ══ S18: COMO EU CRIO UM AGENTE\? ══ -->[\s\S]*?<p style="margin-top:24px;font-size:16px;color:var\(--tx5\);max-width:500px">([^<]+)<\/p>[\s\S]*?<!-- ══ S19: MAPEAMENTO DOS USE CASES ══ -->/;
const s18Match = s18Regex.exec(html);
if (s18Match) {
  const subtitle = s18Match[1];
  html = html.replace(s18Regex, '<!-- ══ S19: MAPEAMENTO DOS USE CASES ══ -->');
  
  // Inject into S19
  const s19TargetRegex = /(<p class="lede" style="margin-bottom:24px;font-size:15px">)([^<]+)(<\/p>)/;
  html = html.replace(s19TargetRegex, `$1${subtitle}<br><br>$2$3`);
}

// 6. Re-index all slides
const slideRegex = /<div class="slide([^"]*)" data-i="\d+"/g;
let currentIndex = 0;
html = html.replace(slideRegex, (match, classes) => {
  const replacement = `<div class="slide${classes}" data-i="${currentIndex}"`;
  currentIndex++;
  return replacement;
});

// Update total slides text
html = html.replace(/\d+ SLIDES/g, `${currentIndex} SLIDES`);
html = html.replace(/totalSlides = \d+/g, `totalSlides = ${currentIndex}`);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully applied layout fixes and removed slides. Total slides:', currentIndex);
