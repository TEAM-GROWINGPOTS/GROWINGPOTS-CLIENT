import fs from 'fs';
import path from 'path';

const svgsDir = path.resolve('./public/svgs');
const outputPath = path.resolve('./public/sprite.svg');

const files = fs.readdirSync(svgsDir).filter((f) => f.endsWith('.svg'));

if (files.length === 0) {
  console.log('No SVG files found in public/svgs/');
  process.exit(0);
}

const symbols = files.map((file) => {
  const isColorIcon = file.endsWith('.color.svg');
  const name = path.basename(file, isColorIcon ? '.color.svg' : '.svg');
  const content = fs.readFileSync(path.join(svgsDir, file), 'utf-8');

  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  const svgFillMatch = content.match(/<svg[^>]*\sfill="([^"]+)"/s);
  const svgFill = svgFillMatch ? svgFillMatch[1] : null;

  const rawInner = content
    .replace(/<svg[^>]*>/s, '')
    .replace(/<\/svg>/, '')
    .trim();

  const innerContent = isColorIcon
    ? rawInner
    : rawInner
        .replace(/fill="(?!none)[^"]+"/g, 'fill="currentColor"')
        .replace(/stroke="(?!none)[^"]+"/g, 'stroke="currentColor"');

  const fillAttr = svgFill ? ` fill="${svgFill}"` : '';
  return `  <symbol id="${name}" viewBox="${viewBox}"${fillAttr}>\n    ${innerContent}\n  </symbol>`;
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join('\n')}\n</svg>`;

fs.writeFileSync(outputPath, sprite);
console.log(`Generated sprite.svg with ${files.length} icons`);
