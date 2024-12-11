const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'document.txt');
const BASE_BRANCH = 'main';
let commitCounter = 0;

// Función para generar el nombre de la rama con la fecha y hora
function generateBranchName() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `feat/branch-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

// Función para ejecutar comandos de Git
function runCommand(command, successMessage) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error: ${stderr || err}`);
        return reject(stderr || err);
      }
      console.log(successMessage || stdout.trim());
      resolve(stdout.trim());
    });
  });
}

// Función principal para manejar el flujo
async function automateGit() {
  try {
    // Incrementar el contador de commits
    commitCounter++;

    // Modificar el archivo para simular cambios
    const content = `Commit ${commitCounter} realizado a las: ${new Date().toISOString()}\n`;
    fs.appendFileSync(filePath, content);
    console.log(`Archivo modificado: ${filePath}`);

    // Agregar y hacer commit
    await runCommand('git add .', 'Archivos agregados.');
    const commitMessage = `Automated Commit ${commitCounter}`;
    await runCommand(
      `git commit -m "${commitMessage}"`,
      `Commit realizado: ${commitMessage}`
    );

    // Crear una nueva rama cada 10 commits
    if (commitCounter % 10 === 0) {
      const newBranch = generateBranchName();
      await runCommand(
        `git checkout ${BASE_BRANCH}`,
        `Cambiado a la rama base: ${BASE_BRANCH}`
      );
      await runCommand(
        `git pull origin ${BASE_BRANCH}`,
        'Actualizado desde la rama base.'
      );
      await runCommand(
        `git checkout -b ${newBranch}`,
        `Nueva rama creada: ${newBranch}`
      );
    }

    // Push a la rama actual
    const currentBranch = await runCommand('git branch --show-current');
    await runCommand(
      `git push origin ${currentBranch}`,
      `Cambios empujados a la rama: ${currentBranch}`
    );
  } catch (error) {
    console.error(`Error durante la automatización: ${error}`);
  }
}

// Ejecutar cada 5 segundos (5000 ms)
setInterval(automateGit, 5000);
