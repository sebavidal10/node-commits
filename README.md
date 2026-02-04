# node-commits 🚀

**Automatización de actividad en Git: Commits periódicos y creación dinámica de ramas con Node.js.**

Esta versión "Pro" incluye soporte seguro para credenciales y configuración flexible.

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
- **Configuración de credenciales** (ver abajo).

## 🚀 Instalación y Configuración

1.  Clona el repositorio.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  **Configuración "Pro" (Variables de Entorno)**:
    - Copia el archivo de ejemplo:
      ```bash
      cp .env.example .env
      ```
    - Edita `.env` con tus credenciales.

### Variables de Entorno soportadas

| Variable              | Descripción                                                                      |
| :-------------------- | :------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`        | Tu Personal Access Token (scope `repo`).                                         |
| `GITHUB_USERNAME`     | Tu usuario de GitHub.                                                            |
| `GIT_REPO_URL`        | URL HTTPS del repositorio (opcional, ej: `https://github.com/usuario/repo.git`). |
| `GIT_COMMITTER_NAME`  | Inyecta `user.name` localmente.                                                  |
| `GIT_COMMITTER_EMAIL` | Inyecta `user.email` localmente.                                                 |
| `GIT_INTERVAL`        | Intervalo en ms para `npm run prs`.                                              |

## 🕹️ Uso

### Automatización básica (`index.js`)

Realiza un registro en `data/document.txt` y hace push a la rama actual cada 2 horas.

```bash
npm start
```

### Automatización intensiva (`prs.js`)

Genera commits rápidos y crea una rama nueva cada 10 commits.

```bash
npm run prs
```

## 📄 Características

- **Seguridad**: Soporte para tokens de acceso personal vía `.env`.
- **Portabilidad**: Configura la identidad de git (`user.name`/`email`) al vuelo sin afectar la configuración global de la máquina.
- **Robustez**: Mejor manejo de errores y recuperación.

---

> [!WARNING]
> Ten en cuenta que el uso excesivo de scripts de automatización de commits puede ser detectado por plataformas como GitHub si se usa únicamente para inflar métricas. Úsalo con responsabilidad.
