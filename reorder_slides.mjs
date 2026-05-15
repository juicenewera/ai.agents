import fs from 'fs';

const htmlPath = 'c:/Users/juice/Desktop/PROJETOS/aula-ai-agents/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// The goal is to rearrange the first few slides:
// S1: Capa (0)
// S2: Anthropic (1) - New slide with the anthropic image
// S3: Andrej Karpathy (2)
// S4: Ponto de Inflexão (3) - With graph_inflexao.png
// S5: Sobre Mim (4)
// Then S5 becomes S6, etc.

// 1. Extract blocks
const getBlock = (startStr, endStr) => {
  const start = html.indexOf(startStr);
  const end = html.indexOf(endStr, start);
  if(start === -1 || end === -1) return null;
  return html.slice(start, end);
};

const s2SobreMim = getBlock('<!-- ══ S2: SOBRE MIM ══ -->', '<!-- ══ S3: ANDREJ KARPATHY ══ -->');
const s3Andrej = getBlock('<!-- ══ S3: ANDREJ KARPATHY ══ -->', '<!-- ══ S4: PONTO DE INFLEXÃO ══ -->');
const s4Inflexao = getBlock('<!-- ══ S4: PONTO DE INFLEXÃO ══ -->', '<!-- ══ S5: ENTÃO NÃO TEREMOS PROGRAMADORES? ══ -->');

// 2. Modify S4 Inflexao to use the graph image instead of SVG + Anthropic image side-by-side
let newS4Inflexao = s4Inflexao.replace(
  /<div style="background:var\(--s1\);border:1px solid var\(--ln\);border-radius:var\(--r\);padding:24px 28px">[\s\S]*?<\/div>\s*<\/div>\s*<div class="divv"><\/div>\s*<div style="flex:\.85;padding-left:52px;display:flex;align-items:center;justify-content:center">[\s\S]*?<\/div>/,
  `<div style="background:var(--s1);border:1px solid var(--ln);border-radius:var(--r);padding:0;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.08);display:flex;justify-content:center;align-items:center;width:100%;max-width:800px">
        <img src="assets/graph_inflexao.png" alt="Ponto de inflexão" style="width:100%;height:auto;display:block">
      </div>
    </div>`
);
// Remove the flex:1.1 and padding-right from the first column since it now takes full width or center it
newS4Inflexao = newS4Inflexao.replace('<div style="flex:1.1;display:flex;flex-direction:column;justify-content:center;padding-right:52px">', '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">');
newS4Inflexao = newS4Inflexao.replace('<div class="pre gold" style="margin-bottom:12px">', '<div class="pre gold" style="margin-bottom:12px;margin-left:auto;margin-right:auto">');
newS4Inflexao = newS4Inflexao.replace('class="h1" style="margin-bottom:28px"', 'class="h1" style="margin-bottom:28px;text-align:center"');
newS4Inflexao = newS4Inflexao.replace('<div class="div" style="margin-bottom:28px"></div>', '<div class="div" style="margin-bottom:28px;margin-left:auto;margin-right:auto"></div>');
newS4Inflexao = newS4Inflexao.replace('flex-direction:row;padding:44px 64px 100px', 'flex-direction:column;padding:44px 64px 100px;align-items:center');


// 3. Create new Anthropic slide (S2)
const newS2Anthropic = `<!-- ══ S2: ANTHROPIC ══ -->
<div class="slide" data-i="1">
  <div class="bg-orb" style="width:500px;height:500px;top:-150px;right:-100px;background:rgba(26,86,255,.06)"></div>
  <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--gold3),transparent);z-index:10"></div>
  <div class="si" style="justify-content:center;align-items:center;padding:44px 64px">
    <div style="border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.15);max-width:900px;width:100%;background:#fff">
      <img src="assets/anthropic_article.png" alt="IA já escreve 90% do código da Anthropic" style="width:100%;display:block">
    </div>
  </div>
</div>
`;

// 4. Combine in new order
const newContent = newS2Anthropic + s3Andrej + newS4Inflexao + s2SobreMim;

// 5. Replace in HTML
const startIndex = html.indexOf('<!-- ══ S2: SOBRE MIM ══ -->');
const endIndex = html.indexOf('<!-- ══ S5: ENTÃO NÃO TEREMOS PROGRAMADORES? ══ -->');

let finalHtml = html.slice(0, startIndex) + newContent + html.slice(endIndex);

// 6. Fix all data-i indices
// Extract all slides
const slideRegex = /<div class="slide([^"]*)" data-i="\d+"/g;
let currentIndex = 0;
finalHtml = finalHtml.replace(slideRegex, (match, classes) => {
  const replacement = `<div class="slide${classes}" data-i="${currentIndex}"`;
  currentIndex++;
  return replacement;
});

// Update total slides text
finalHtml = finalHtml.replace(/27 SLIDES/g, `${currentIndex} SLIDES`);
finalHtml = finalHtml.replace(/totalSlides = 27/g, `totalSlides = ${currentIndex}`);

fs.writeFileSync(htmlPath, finalHtml, 'utf8');
console.log('Successfully reordered slides and updated indices. Total slides:', currentIndex);
