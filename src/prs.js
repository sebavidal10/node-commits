const { runCommand, updateFile, path } = require('./utils');

const DATA_DIR = path.join(__dirname, '../data');
const FILE_PATH = path.join(DATA_DIR, 'document.txt');
const BASE_BRANCH = 'main';

let commitCounter = 0;
let lastBranch = null;

async function automateGit() {
  try {
    commitCounter++;
    const now = new Date().toISOString();
    const content = `PR Sim - Commit ${commitCounter} - ${now}\n`;

    updateFile(FILE_PATH, content);

    await runCommand('git add .', 'Cambios agregados.');
    const commitMessage = `Automated commit #${commitCounter}`;
    await runCommand(
      `git commit -m "${commitMessage}"`,
      `Commit #${commitCounter} guardado.`,
    );

    // Lógica de ramificación (cada 10 commits)
    if (commitCounter % 10 === 0) {
      const timestamp = new Date().getTime();
      const newBranch = `feature/auto-${timestamp}`;
      const sourceBranch = lastBranch || BASE_BRANCH;

      console.log(`[FLOW]: Iniciando nueva rama desde ${sourceBranch}`);

      await runCommand(`git checkout ${sourceBranch}`);
      await runCommand(`git pull origin ${sourceBranch}`).catch(() =>
        console.log('Sin cambios remotos.'),
      );
      await runCommand(
        `git checkout -b ${newBranch}`,
        `Rama creada: ${newBranch}`,
      );

      lastBranch = newBranch;
    }

    const currentBranch = await runCommand('git branch --show-current');
    await runCommand(
      `git push origin ${currentBranch}`,
      `Empujado a ${currentBranch}`,
    );
  } catch (error) {
    console.error(`[ERROR]: Fallo en automateGit: ${error}`);
  }
}

// Ejecutar cada 5 segundos (intensivo) o 2 horas según se desee.
// Por defecto dejamos el intervalo corto para demostración, pero configurable.
const INTERVAL = process.env.GIT_INTERVAL || 5000;
console.log(`[START]: Iniciando automatización intensiva cada ${INTERVAL}ms`);
setInterval(automateGit, INTERVAL);
