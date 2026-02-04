require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Ejecuta un comando de la terminal y devuelve una promesa.
 * @param {string} command - El comando a ejecutar.
 * @param {string} successMessage - Mensaje opcional a mostrar en caso de éxito.
 */
function runCommand(command, successMessage) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`[ERROR]: ${stderr || err}`);
        return reject(stderr || err);
      }
      if (successMessage) console.log(`[SUCCESS]: ${successMessage}`);
      resolve(stdout.trim());
    });
  });
}

/**
 * Modifica un archivo de texto con un nuevo contenido.
 * @param {string} filePath - Ruta absoluta del archivo.
 * @param {string} content - Contenido a añadir.
 */
function updateFile(filePath, content) {
  try {
    fs.appendFileSync(filePath, content);
    console.log(`[INFO]: Archivo modificado en ${filePath}`);
  } catch (err) {
    console.error(`[ERROR]: No se pudo modificar el archivo: ${err}`);
    throw err;
  }
}

/**
 * Configura la identidad de git localmente si las variables de entorno están presentes.
 */
async function configureGitIdentity() {
  const name = process.env.GIT_COMMITTER_NAME;
  const email = process.env.GIT_COMMITTER_EMAIL;

  if (name) {
    await runCommand(`git config user.name "${name}"`);
  }
  if (email) {
    await runCommand(`git config user.email "${email}"`);
  }
}

/**
 * Obtiene la URL remota autenticada si hay credenciales, o devuelve 'origin'.
 */
function getRemoteRef() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  const repoUrl = process.env.GIT_REPO_URL;

  if (token && username && repoUrl) {
    // Insertar credenciales en la URL HTTPS
    const urlParts = repoUrl.replace('https://', '');
    return `https://${username}:${token}@${urlParts}`;
  }

  // Si no hay URL explícita pero hay credenciales, intentar construirla (más arriesgado sin saber el repo, mejor requerir URL o usar origin con credenciales globales)
  // Para simplificar, si no hay repoUrl, confiamos en 'origin' o requerimos que el usuario configure el remote.
  // Pero si queremos forzar el uso del token, necesitamos saber el repo.
  // Vamos a asumir que si usan token, idealmente deberían poner la URL del repo, O podemos intentar leer la URL de origin y modificarla.

  return 'origin';
}

async function getAuthenticatedRemote() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (token && username) {
    try {
      const remoteUrl = await runCommand('git remote get-url origin');
      if (remoteUrl.startsWith('https://')) {
        const urlParts = remoteUrl.replace('https://', '');
        return `https://${username}:${token}@${urlParts}`;
      }
    } catch (e) {
      console.warn('[WARN]: No se pudo obtener la URL del remote origin.');
    }
  }
  return 'origin';
}

module.exports = {
  runCommand,
  updateFile,
  path,
  configureGitIdentity,
  getAuthenticatedRemote,
};
