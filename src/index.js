const { runCommand, updateFile, path } = require('./utils');

const DATA_DIR = path.join(__dirname, '../data');
const FILE_PATH = path.join(DATA_DIR, 'document.txt');

// Asegurar que el directorio de datos existe
const fs = require('fs');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function makeCommitAndPush() {
  const now = new Date().toISOString();
  const commitMessage = `Update: Regular commit - ${now}`;
  const content = `Registro a las: ${now}\n`;

  try {
    updateFile(FILE_PATH, content);

    await runCommand('git add .', 'Archivos agregados al index.');
    await runCommand(
      `git commit -m "${commitMessage}"`,
      `Commit realizado: ${commitMessage}`,
    );

    const branch = await runCommand('git branch --show-current');
    await runCommand(
      `git push origin ${branch}`,
      `Push realizado a ${branch}.`,
    );

    console.log(`[INFO]: Ciclo completado a las ${now}. Próximo en 2 horas.`);
  } catch (error) {
    console.error(`[CRITICAL]: Error en el ciclo de automatización: ${error}`);
  }
}

// Ejecutar inicialmente y luego cada 2 horas
makeCommitAndPush();
setInterval(makeCommitAndPush, 7200000);
