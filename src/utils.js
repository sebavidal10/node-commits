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

module.exports = {
  runCommand,
  updateFile,
  path,
};
