const { exec } = require('child_process');

// Función para hacer un commit
function makeCommit() {
  const commitMessage = `Commit automático - ${new Date().toISOString()}`;

  // Ejecutar el comando Git para agregar cambios y hacer commit
  exec('git add .', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error al agregar archivos: ${stderr}`);
      return;
    }
    exec(`git commit -m "${commitMessage}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error al hacer commit: ${stderr}`);
        return;
      }
      console.log(`Commit realizado: ${commitMessage}`);
      // Puedes hacer un push si lo deseas:
      // exec('git push origin main', (err, stdout, stderr) => { ... });
    });
  });
}

// Ejecutar cada 1 minuto (60000 ms)
setInterval(makeCommit, 10000);
