import type { Translations } from '../types'

const es: Translations = {
  site: {
    name: 'ContextKit',
    tagline: 'ContextKit — Andamiaje de contexto de proyecto para flujos de IA',
    description:
      'Escanea tu repositorio, genera archivos de contexto duraderos y mantén los flujos de IA alineados con tu proyecto.',
    getStarted: 'Comenzar',
    viewOnGithub: 'Ver en GitHub',
    copyCmd: 'Copiar comando',
  },
  nav: {
    features: 'Funciones',
    workflow: 'Flujo',
    outputs: 'Salidas',
    faq: 'FAQ',
    github: 'GitHub',
    language: 'Idioma',
    theme: 'Tema',
  },
  hero: {
    badge: 'Herramientas IA',
    heading: 'Dale a tu repo el contexto que tus herramientas de IA necesitan.',
    subtitle:
      'ContextKit escanea tu código, detecta patrones y reglas, genera archivos de memoria duraderos y mantiene la calidad con diagnósticos personalizados.',
    compatNote: 'Funciona con Bun, Node, React, Next.js, Vite, Monorepos y más.',
    getStarted: 'Comenzar',
    viewOnGithub: 'Ver en GitHub',
  },
  proof: {
    label: 'Andamiaje Adaptado a tu Stack',
  },
  transformation: {
    badge: 'Transformación',
    title: 'Alinea tu Código con tu IA',
    subtitle:
      'Los asistentes de IA son increíblemente potentes, pero solo si entienden cómo está construido tu proyecto. Así es como ContextKit cierra la brecha.',
    beforeTitle: 'Contexto de Espacio de Trabajo Fragmentado',
    afterTitle: 'Memoria Gestionada por ContextKit',
    beforePoints: [
      'La IA adivina reglas del proyecto e inventa convenciones',
      'Fallos frecuentes por comandos inválidos de la IA',
      'Secretos locales o rutas de máquina filtrados accidentalmente',
      'Contexto fragmentado genera instrucciones repetitivas',
    ],
    afterPoints: [
      'Reglas compartidas en git alinean cada sesión de IA al instante',
      'Scripts de comando explícitos mapeados dinámicamente',
      'Credenciales locales aisladas en CLAUDE.local.md',
      'Memoria centralizada reduce la sobrecarga de contexto',
    ],
  },
  features: {
    badge: 'Funciones',
    title: 'Totalmente Equipado para Flujos de IA',
    subtitle:
      'Todo lo necesario para escanear estructuras de proyecto, generar reglas repetibles y ejecutar diagnósticos en tu memoria de trabajo.',
    items: [
      {
        title: 'Detección Inteligente de Stack',
        description:
          'Escanea archivos de configuración, lockfiles y estructuras de directorios para detectar automáticamente frameworks y entornos.',
        tag: 'detect',
      },
      {
        title: 'Andamiaje de Contexto Duradero',
        description:
          'Genera archivos CLAUDE.md limpios y de alto valor, adaptados para guiar asistentes de IA con contexto del proyecto.',
        tag: 'scaffold',
      },
      {
        title: 'Capa Local Privada',
        description:
          'Soporta CLAUDE.local.md para credenciales locales, claves API o notas personales que no van a Git.',
        tag: 'privacy',
      },
      {
        title: 'Diagnóstico de Repositorio',
        description:
          'Ejecuta el comando `doctor` para auditar la higiene del repositorio e identificar requisitos faltantes al instante.',
        tag: 'doctor',
      },
      {
        title: 'Auditorías de Calidad Estructural',
        description:
          'Ejecuta `audit` para puntuar la estructura del repositorio contra prácticas estándar y obtener mejoras accionables.',
        tag: 'audit',
      },
      {
        title: 'Automatización No Interactiva',
        description:
          'Soporta flags CLI no interactivos, facilitando el scripting en plantillas o pipelines de CI.',
        tag: 'automate',
      },
    ],
  },
  workflow: {
    badge: 'Flujo de Trabajo',
    title: 'Alineación Procedural del Repositorio',
    subtitle:
      'Alineando la memoria del proyecto en segundos. Este es el ciclo de vida paso a paso de ContextKit.',
    steps: [
      {
        step: '01',
        title: 'Escanea el Repositorio',
        description:
          'Ejecuta la CLI en la raíz del proyecto. Escanea archivos, gestores de paquetes y directorios sin alterar el código.',
      },
      {
        step: '02',
        title: 'Identifica Stack y Patrones',
        description:
          'ContextKit identifica patrones como monorepos, configuraciones Next.js, objetivos de compilación TypeScript y librerías de testing.',
      },
      {
        step: '03',
        title: 'Genera Archivos de Contexto',
        description:
          'Crea la estructura CLAUDE.md compartida por el equipo y CLAUDE.local.md para alinear las herramientas de IA.',
      },
      {
        step: '04',
        title: 'Mantén la Salud del Proyecto',
        description:
          'Ejecuta `doctor` o `audit` periódicamente para evaluar la configuración, detectar carencias y mantener el contexto actualizado.',
      },
    ],
  },
  outputs: {
    badge: 'Salidas del Andamiaje',
    title: 'Estructura Viva de Memoria del Proyecto',
    subtitle:
      'Explora los archivos que ContextKit genera para alimentar contexto, límites de arquitectura y secretos locales de forma segura.',
    workspaceTree: 'ÁRBOL DE TRABAJO',
    gitShared: 'compartido en git',
    ignored: 'ignorado',
    versionControlled: 'Control de Versiones',
    ignoredInGitignore: 'Ignorado en .gitignore',
    files: {
      claude: {
        title: 'CLAUDE.md',
        content: `# Resumen del Proyecto ContextKit
- Entornos soportados: Bun, Node.js
- Gestor de paquetes: bun

# Estructura del Repositorio
- \`src/\` - Código fuente del CLI
- \`tests/\` - Tests unitarios y fixtures

# Comandos Principales
- Ejecución en dev: \`bun run dev\`
- Build: \`bun run build\`
- Tests: \`bun test\`

# Reglas de Desarrollo
- Preferir tipado estricto en imports de frontera.
- Mantener componentes aislados, puros y descriptivos.`,
      },
      local: {
        title: 'CLAUDE.local.md',
        content: `# Notas de Entorno Local
- Desarrollador: rick (Rick)

# Configuración Privada
- Puerto de build personalizado: \`4000\`
- Credenciales de BD local (mock):
  - DB_HOST=localhost
  - DB_PORT=5432

# Apuntes de Máquina
- Investigando problema de hot reload en subproyecto web.
- Nota: CLAUDE.local.md está en .gitignore para no filtrar claves.`,
      },
      readme: {
        title: 'README.md',
        content: `# ContextKit
Inicia y mantén configuraciones de memoria de código para flujos asistidos por IA.

## Inicio Rápido
\`\`\`bash
bunx contextkit
\`\`\`

## Comandos
- \`doctor\` - Ejecuta diagnóstico del repositorio.
- \`audit\` - Puntúa la calidad del repositorio.`,
      },
    },
  },
  faq: {
    badge: 'FAQ',
    title: 'Preguntas Frecuentes',
    subtitle:
      'Todo lo que necesitas saber sobre ContextKit, archivos de memoria del proyecto y coordinación con IA.',
    items: [
      {
        question: '¿Funciona en bases de código existentes?',
        answer:
          'Absolutamente. ContextKit está diseñado para ejecutarse en cualquier repositorio. Escanea tus archivos existentes para descubrir patrones y luego genera pautas apropiadas sin alterar tu código o historial git.',
      },
      {
        question: '¿Necesito instalar Bun para ejecutar ContextKit?',
        answer:
          'No. Aunque el CLI está construido con Bun, puedes ejecutarlo fácilmente en cualquier máquina usando `npx contextkit` bajo Node, o `bunx contextkit` bajo Bun. Funciona en todos los entornos.',
      },
      {
        question: '¿Qué archivos se crean en mi proyecto?',
        answer:
          'Crea un archivo de memoria compartido `CLAUDE.md` (para arquitectura del repositorio, reglas y comandos, que se versiona en git) y un opcional `CLAUDE.local.md` (para notas personales de tu máquina local, ignorado por git). También configura directorios de reglas estándar si es necesario.',
      },
      {
        question: '¿Puedo ejecutar ContextKit sin interfaz en pipelines?',
        answer:
          'Sí. Al ejecutar el CLI con `--yes` o parámetros no interactivos, puedes omitir todos los prompts de terminal. Esto es ideal para plantillas de repositorio, verificaciones CI/CD o configuraciones automatizadas de entorno de desarrollo.',
      },
      {
        question: '¿Soporta monorepos complejos?',
        answer:
          'Sí. ContextKit detecta diseños de monorepo (como espacios de trabajo de Bun, Yarn/PNPM, Turborepo) y genera reglas que ayudan a los asistentes de IA a entender el aislamiento de paquetes y los límites del monorepo.',
      },
    ],
  },
  cta: {
    badge: 'Cero Sobrecarga',
    title: 'Genera tu Contexto de IA Hoy',
    subtitle:
      'Deja de pegar las mismas reglas repetitivas en cada sesión. Alinea los archivos de memoria de tu repositorio con un solo comando ligero.',
    getStarted: 'Comenzar',
    viewOnGithub: 'Ver en GitHub',
  },
  footer: {
    copyright: '  {year} ContextKit. Publicado bajo la Licencia MIT.',
  },
  terminal: {
    processCompleted: 'Proceso completado.',
  },
}

export default es
