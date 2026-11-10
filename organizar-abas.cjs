const fs = require('node:fs');
const path = require('node:path');

const raiz = __dirname;
const pastaApp = path.join(raiz, 'app');
const pastaAbas = path.join(pastaApp, '(tabs)');

const arquivos = [
  'index.tsx',
  'explorar.tsx',
  'registros.tsx',
  'sobre.tsx',
];

// Confere tudo antes de mover qualquer arquivo.
for (const arquivo of arquivos) {
  const origem = path.join(pastaApp, arquivo);
  const destino = path.join(pastaAbas, arquivo);

  if (!fs.existsSync(origem)) {
    throw new Error(
      `Arquivo não encontrado: app/${arquivo}. ` +
      'Nenhuma alteração foi iniciada.',
    );
  }

  if (fs.existsSync(destino)) {
    throw new Error(
      `Já existe app/(tabs)/${arquivo}. ` +
      'Nenhuma alteração foi iniciada.',
    );
  }
}

const backup = path.join(
  raiz,
  `backup-abas-${Date.now()}`,
);

fs.mkdirSync(backup, { recursive: true });

for (const arquivo of arquivos) {
  fs.copyFileSync(
    path.join(pastaApp, arquivo),
    path.join(backup, arquivo),
  );
}

const layoutAtual = path.join(pastaApp, '_layout.tsx');

if (fs.existsSync(layoutAtual)) {
  fs.copyFileSync(
    layoutAtual,
    path.join(backup, '_layout.tsx'),
  );
}

fs.mkdirSync(pastaAbas, { recursive: true });

for (const arquivo of arquivos) {
  const origem = path.join(pastaApp, arquivo);
  const destino = path.join(pastaAbas, arquivo);

  const conteudo = fs.readFileSync(origem, 'utf8');

  // As páginas estão agora um nível abaixo.
  const ajustado = conteudo.replace(
    /(['"])\.\.\/src\//g,
    '$1../../src/',
  );

  fs.renameSync(origem, destino);
  fs.writeFileSync(destino, ajustado, 'utf8');

  console.log(`Movido: app/(tabs)/${arquivo}`);
}

console.log('');
console.log(`Backup criado em: ${path.basename(backup)}`);
console.log('Agora adicione os dois layouts indicados.');