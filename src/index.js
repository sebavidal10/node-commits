const {
  runCommand,
  updateFile,
  path,
  configureGitIdentity,
  getAuthenticatedRemote,
} = require('./utils');

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
    // Configurar identidad si es necesario
    await configureGitIdentity();

    updateFile(FILE_PATH, content);

    await runCommand('git add .', 'Archivos agregados al index.');
    await runCommand(
      `git commit -m "${commitMessage}"`,
      `Commit realizado: ${commitMessage}`,
    );

    const branch = await runCommand('git branch --show-current');
    const remote = await getAuthenticatedRemote();

    // Si usas tokens, evita loguear la URL completa en el mensaje de éxito para seguridad básica
    await runCommand(
      `git push ${remote} ${branch}`,
      `Push realizado a branch ${branch}.`,
    );

    console.log(`[INFO]: Ciclo completado a las ${now}. Próximo en 2 horas.`);
  } catch (error) {
    console.error(`[CRITICAL]: Error en el ciclo de automatización: ${error}`);
  }
}

// Ejecutar inicialmente y luego cada 2 horas
makeCommitAndPush();
setInterval(makeCommitAndPush, 7200000);
