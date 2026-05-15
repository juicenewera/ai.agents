import { readFileSync } from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
const buf = readFileSync('./drive_google_com_drive_u_7_folders_1jUdU4vv7zmZfqQ_hHu7Uqlg6.pdf');
const d = await pdfParse(buf);
console.log('PAGES:', d.numpages);
console.log(d.text);
