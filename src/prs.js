const {
  runCommand,
  updateFile,
  path,
  configureGitIdentity,
  getAuthenticatedRemote,
} = require('./utils');

const DATA_DIR = path.join(__dirname, '../data');
const FILE_PATH = path.join(DATA_DIR, 'document.txt');

// Configuración dinámica
const BASE_BRANCH = process.env.GIT_BASE_BRANCH || 'main';
const BATCH_SIZE = process.env.GIT_PRS_BATCH || 10;
const INTERVAL = process.env.GIT_INTERVAL || 5000;

let commitCounter = 0;
let lastBranch = null;

async function automateGit() {
  try {
    // Configurar identidad
    await configureGitIdentity();

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

    // Lógica de ramificación (cada BATCH_SIZE commits)
    if (commitCounter % BATCH_SIZE === 0) {
      const timestamp = new Date().getTime();
      const newBranch = `feature/auto-${timestamp}`;
      const sourceBranch = lastBranch || BASE_BRANCH;

      console.log(`[FLOW]: Iniciando nueva rama desde ${sourceBranch}`);

      const remote = await getAuthenticatedRemote();

      await runCommand(`git checkout ${sourceBranch}`);
      // Usar remote autenticado para pull también si es necesario
      await runCommand(`git pull ${remote} ${sourceBranch}`).catch(() =>
        console.log('Sin cambios remotos.'),
      );
      await runCommand(
        `git checkout -b ${newBranch}`,
        `Rama creada: ${newBranch}`,
      );

      lastBranch = newBranch;
    }

    const currentBranch = await runCommand('git branch --show-current');
    const remote = await getAuthenticatedRemote();
    await runCommand(
      `git push ${remote} ${currentBranch}`,
      `Empujado a branch ${currentBranch}`,
    );
  } catch (error) {
    console.error(`[ERROR]: Fallo en automateGit: ${error}`);
  }
}

if (require.main === module) {
  console.log(
    `[START]: Iniciando automatización intensiva cada ${INTERVAL}ms (Batch: ${BATCH_SIZE}, Base: ${BASE_BRANCH})`,
  );
  setInterval(automateGit, INTERVAL);
}

module.exports = { automateGit };
