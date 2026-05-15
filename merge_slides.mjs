import fs from 'fs';

const htmlPath = 'c:/Users/juice/Desktop/PROJETOS/aula-ai-agents/index.html';
const middlePath = 'c:/Users/juice/Desktop/PROJETOS/aula-ai-agents/middle_slides.html';

let html = fs.readFileSync(htmlPath, 'utf8');
const middle = fs.readFileSync(middlePath, 'utf8');

// Replace the slides count in Capa
html = html.replace('19 SLIDES', '27 SLIDES');

// Find start and end indices for the replacement
const startStr = '<!-- ══ S2: EVOLUÇÃO DA IA (NOVO) ══ -->';
const endStr = '<!-- ══ S17: PLANO DE FUNDADOR ══ -->';

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find start or end markers.");
  process.exit(1);
}

// Reconstruct HTML
const newHtml = html.slice(0, startIndex) + middle + '\n' + html.slice(endIndex);

// Update indices for Plano Fundador and Perguntas
let finalHtml = newHtml.replace('<div class="slide" data-i="17">', '<div class="slide" data-i="25">');
finalHtml = finalHtml.replace('<div class="slide" data-i="18">', '<div class="slide" data-i="26">');

// Also update the comment names for Plano Fundador and Perguntas
finalHtml = finalHtml.replace('<!-- ══ S17: PLANO DE FUNDADOR ══ -->', '<!-- ══ S26: PLANO DE FUNDADOR ══ -->');
finalHtml = finalHtml.replace('<!-- ══ S18: PERGUNTAS ══ -->', '<!-- ══ S27: PERGUNTAS ══ -->');

fs.writeFileSync(htmlPath, finalHtml, 'utf8');
console.log('Successfully updated index.html');
