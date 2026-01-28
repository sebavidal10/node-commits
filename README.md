# node-commits 🚀

**Automatización de actividad en Git: Commits periódicos y creación dinámica de ramas con Node.js.**

## 📋 Descripción

`node-commits` es una suite de herramientas diseñada para generar actividad automatizada en repositorios de Git. Es ideal para validar configuraciones de CI/CD, probar scripts de integración, o mantener flujos de trabajo activos.

### Temas (Topics)

`git-automation`, `nodejs`, `github-activity`, `ci-cd-test`, `git-scripts`

## 📂 Estructura del Proyecto

```text
node-commits/
├── data/           # Archivos generados durante la automatización
│   └── document.txt
├── src/            # Código fuente
│   ├── index.js    # Automatización básica (main branch)
│   ├── prs.js      # Automatización avanzada (PRs/Branches)
│   └── utils.js    # Utilidades compartidas
├── package.json    # Configuración y scripts
└── README.md       # Documentación
```

## 🛠️ Requisitos

- [Node.js](https://nodejs.org/) instalado.
- Permisos configurados para hacer `push` al repositorio remoto (SSH o Token).

## 🚀 Instalación y Uso

1.  Clona el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```

### Automatización básica (`index.js`)

Realiza un registro en `data/document.txt` y hace push a la rama actual cada 2 horas.

```bash
npm start
```

### Automatización intensiva (`prs.js`)

Genera commits cada 5 segundos y crea una rama nueva cada 10 commits para simular un flujo de trabajo intensivo.

```bash
npm run prs
```

## 📄 Características de la Refactorización

- **Modularidad**: Lógica común extraída a `src/utils.js`.
- **Organización**: Archivos de código y datos separados en directorios dedicados.
- **Robustez**: Mejor manejo de errores y mensajes de consola claros.

---

> [!WARNING]
> Ten en cuenta que el uso excesivo de scripts de automatización de commits puede ser detectado por plataformas como GitHub si se usa únicamente para inflar métricas. Úsalo con responsabilidad, principalmente para pruebas técnicas.
