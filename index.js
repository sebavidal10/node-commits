const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ruta al archivo de texto plano
const filePath = path.join(__dirname, 'document.txt');

// Función para hacer un commit y push
function makeCommitAndPush() {
  const commitMessage = `Update document - ${new Date().toISOString()}`;

  // Modificar el archivo de texto para forzar un cambio
  const content = `Último commit realizado a las: ${new Date().toISOString()}\n`;
  fs.appendFile(filePath, content, (err) => {
    if (err) {
      console.error(`Error al modificar el archivo: ${err}`);
      return;
    }

    console.log(`Archivo modificado: ${filePath}`);

    // Ejecutar el comando Git para agregar cambios y hacer commit
    exec('git add .', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error al agregar archivos: ${stderr}`);
        return;
      }
      exec(`git commit -m "${commitMessage}"`, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error al hacer commit: ${stderr || err}`);
          return;
        }
        console.log(`Commit realizado: ${commitMessage}`);

        // Hacer push al repositorio remoto
        exec('git push origin main', (err, stdout, stderr) => {
          if (err) {
            console.error(`Error al hacer push: ${stderr || err}`);
            return;
          }
          console.log('Push realizado al repositorio remoto.');
        });
      });
    });
  });
}

// Ejecutar cada 1 minuto (60000 ms)
// Ejecutar cada 2 horas (7200000 ms)
setInterval(makeCommitAndPush, 7200000);
