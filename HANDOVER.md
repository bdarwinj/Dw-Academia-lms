# Proyecto: Academia LMS (Custom Plugin)
**Bitácora de Desarrollo y Entregas (Handover Log)**

Este archivo sirve como el historial principal del proyecto, documentando las decisiones arquitectónicas, los avances por fase y el estado actual del desarrollo para el nuevo plugin LMS nativo en español.

---

## [2026-03-01] - Inicialización del Proyecto

### Estado Actual:
- **Fase:** Panel SPA (Phase 1.3) - COMPLETADA
- **Actividad:** Configuración de React+Vite, creación de menú administrativo y APIs base.

### Resumen de Cambios:
1.  **React App (Vite):** Se configuró una aplicación de React dentro de la carpeta `react-app/` utilizando Vite compilando los estáticos en el directorio `assets/admin/`.
2.  **Menú en WP Admin:** Se generó la clase `AcademiaLms\Admin\Menu` que agrega una página maestra en el menú de WordPress y lanza los scripts y estilos de React.
3.  **API REST Endpoint:** Se agregó el controlador base `AcademiaLms\API\Base` estableciendo el espacio de nombres de la API (`academia-lms/v1`) para permitir la comunicación segura asíncrona.

### Tareas Pendientes Inmediatas (Siguiente Paso - Fase 2.1):
- [x] Desarrollar los componentes en React para el *Course Builder* (Arrastrar y Soltar).
- [x] Modelar jerarquías entre Curso -> Sección -> Lección.

---

## [2026-03-01] - Inicio de Fase 2: Constructor Visual (Course Builder)

### Estado Actual:
- **Fase:** Creación de Cursos y Constructor Visual (Phase 2.1) - COMPLETADA
- **Actividad:** Creación de la interfaz Drag-and-Drop en el panel SPA y endpoints para guardar estructura del curso.

### Resumen de Cambios:
1.  **Componente React (Drag&Drop):** Se construyó el componente `CourseBuilder.jsx` utilizando `@hello-pangea/dnd` para lograr una experiencia fluida al organizar Secciones y Lecciones.
2.  **API REST de Curriculum:** Se diseñó el endpoint POST `/academia-lms/v1/builder/save` (`includes/API/Builder.php`) encargado de recibir el JSON del constructor y guardar la estructura como metadata (`_academia_builder_layout`) en WordPress de forma segura verificando permisos.

### Tareas Pendientes Inmediatas (Siguiente Paso - Fase 2.2):
- [x] Implementar la Gestión de Lecciones (Video HTML5/YouTube).
- [x] Sincronizar editor Gutenberg para el contenido de texto de cada Lección.

---

## [2026-03-01] - Gestión de Lecciones (Video y Texto)

### Estado Actual:
- **Fase:** Gestión de Lecciones (Phase 2.2) - COMPLETADA
- **Actividad:** Creación de Metaboxes en WordPress para asignar URLs de videos (YouTube/Vimeo) a las lecciones.

### Resumen de Cambios:
1.  **Metaboxes de Video:** Se implementó exitosamente la clase `AcademiaLms\Admin\Metaboxes\Leccion`. Ésta añade cajas personalizadas al Custom Post Type `academia_leccion` para seleccionar la fuente del video, proveer la URL y definir la duración del mismo, con validación de seguridad (Nonces) y saneamiento (`esc_url_raw`).
2.  **Soporte Gutenberg:** Se confirmó y se está aprovechando la API REST nativa (`show_in_rest = true`) en los CPTs para que el instructor redacte la teoría de la lección usando la experiencia moderna de Gutenberg.

### Tareas Pendientes Inmediatas (Siguiente Paso - Fase 2.3):
- [x] Construir la estructura de datos (CPT o tablas) para el Motor de Cuestionarios.
- [x] Programar la interfaz para añadir Preguntas y Opciones al Cuestionario.

---

## [2026-03-01] - Motor de Cuestionarios (Exámenes)

### Estado Actual:
- **Fase:** Motor de Cuestionarios (Phase 2.3) - COMPLETADA
- **Actividad:** Programación del panel de control interno para crear y gestionar preguntas con sus respectivas múltiples opciones de respuesta dentro de un Cuestionario.

### Resumen de Cambios:
1.  **Creador de Exámenes:** Construida la clase `AcademiaLms\Admin\Metaboxes\Cuestionario` la cual implementa un Metabox interactivo utilizando jQuery. Este interactúa como un campo "Repeater".
2.  **Serialización JSON:** El instructor ahora puede dinámicamente añadir/quitar preguntas, escribir opciones A/B/C/D y elegir la correcta. El sistema de fondo procesa todo este array, lo serializa en JSON y lo guarda limpiamente en la metadata `_academia_quiz_questions` del cuestionario, validando el contenido.

### Tareas Pendientes Inmediatas (Siguiente Paso - Fase 3.1):
- [x] Construir la estructura `templates/` para sobre-escribir diseños del frontend.
- [x] Crear el Aula Virtual (Interfaz libre de distracciones con barra lateral asíncrona).

---

## [2026-03-01] - Inicio de Fase 3: Frontend y Aula Virtual

### Estado Actual:
- **Fase:** Experiencia del Estudiante (Phase 3.1) - COMPLETADA
- **Actividad:** Creación del sistema de "Aula Virtual" reemplazando la plantilla original por una libre de distracciones con barra asíncrona preparada.

### Resumen de Cambios:
1.  **Template Loader:** Se creó la clase `AcademiaLms\Frontend\TemplateLoader` que engancha el filtro `template_include` para interceptar las visitas a las lecciones (o cursos en el futuro) y servir archivos `.php` ubicados en el plugin (`templates/`).
2.  **HTML/CSS Libre de Distracciones:** Construida la plantilla base `templates/single-leccion/index.php`. Hemos descartado los headers del tema por defecto pero mantenidos `wp_head()` y `wp_footer()` para preservar la carga de plugins; asegurando un canvas limpio en pantalla completa (`learn-page.css`) para video en 16:9 y texto abajo, con una barra lateral izquierda asimilando a plataformas premium.

### Tareas Pendientes Inmediatas (Siguiente Paso - Fase 3.2):
- [x] Desarrollar el Dashboard del alumno y sus shortcodes.
- [x] Listado de cursos matriculados y en progreso.

---

## [2026-03-01] - Panel del Alumno (Dashboard Frontend)

### Estado Actual:
- **Fase:** Panel del Alumno (Phase 3.2) - COMPLETADA
- **Actividad:** Desarrollo de *Shortcodes* para presentar la vista y el progreso del estudiante matriculado directamente en el sitio público.

### Resumen de Cambios:
1.  **Motor de Shortcodes:** Creada lógica `AcademiaLms\Frontend\Shortcodes` que habilita globalmente el "tag" `[academia_dashboard]`. Este puede ser incrustado en cualquier página de WordPress.
2.  **Grid de Cursos:** Implementada la plantilla HTML+CSS `templates/shortcodes/dashboard.php` que lista en un bloque grid los cursos (en esta fase con datos dummy demostrativos) mostrando su título, imagen, la barra de progreso de lecciones y el botón para reanudar el estudio, validando que el usuario tenga sesión iniciada.

### Tareas Pendientes Inmediatas (Siguiente Paso - Fase 3.3):
- [x] Desarrollar shortcodes para el Catálogo de Cursos `/cursos/`.
- [x] Listar cursos disponibles para el público.

---

## [2026-03-01] - Catálogo de Cursos (Frontend)

### Estado Actual:
- **Fase:** Catálogo de Cursos (Phase 3.3) - COMPLETADA
- **Actividad:** Creación del Shortcode para mostrar todos los cursos disponibles en la plataforma para captación de alumnos.

### Resumen de Cambios:
1.  **Shortcode de Catálogo (`[academia_cursos]`):** La clase `Shortcodes` fue actualizada para manejar este nuevo elemento. Utiliza `WP_Query` para buscar todos los Custom Post Types `academia_curso` que estén publicados.
2.  **Plantilla Pública:** Se generó `templates/shortcodes/catalog.php` y su respectiva hoja de estilos dinámicos `catalog.css`. La interfaz muestra la imagen destacada del curso, el título, una descripción corta y un botón "Ver Detalles" invitando al registro o compra.

### Tareas Pendientes Inmediatas (Siguiente Paso - Fase 4.1):
- [ ] Integración con WooCommerce.
- [ ] Enlazar el flujo para que al comprar un producto de tipo Curso, el alumno quede matriculado.

---

## [2026-03-01] - Inicio de Fase 4: Monetización (WooCommerce)

### Estado Actual:
- **Fase:** Integración con WooCommerce (Phase 4.1) - COMPLETADA
- **Actividad:** Conectar nuestro LMS con la pasarela de pagos líder, permitiendo asignar un curso a un producto y automatizando la matrícula tras compra exitosa.

### Resumen de Cambios:
1.  **Metabox en Productos:** Construida la clase `WooCommerce` en `includes/Integrations/`. Añade un metabox lateral a la pantalla de edición de Productos en WooCommerce donde puedes seleccionar a qué Curso está vinculado el producto.
2.  **Auto-Matriculación Automática:** Creado el hook conectado a `woocommerce_order_status_completed`. Cuando un estudiante paga y su orden se completa, el sistema iterará los productos de su carrito y creará fluidamente su asiento en nuestra tabla nativa `academia_matriculas`.

### Tareas Pendientes Inmediatas (Siguiente Paso - Fase 4.2):
- [x] Construir pantalla de administración de matrículas para que el profesor/admin vea quién está matriculado y asigne usuarios a mano.

---

## [2026-03-01] - Gestión de Matrículas en Admin (Fase 4.2)

### Estado Actual:
- **Fase:** Gestión de Matrículas (Phase 4.2) - COMPLETADA
- **Actividad:** Creación de una pantalla en el panel de WordPress dedicada a listar los estudiantes de nuestra tabla `academia_matriculas` y permitir asignaciones manuales en caso de pagos por fuera del sistema.

### Resumen de Cambios:
1.  **WP_List_Table Nativo:** Se creó la clase `Matriculas_Table` heredando de la funcionalidad nativa de WordPress para renderizar una tabla atractiva y familiar, la cual consulta directamente la tabla base de datos personalizada.
2.  **Operaciones Manuales:** Agregado un formulario superior que lista los Usuarios registrados y los Cursos publicados, donde el administrador puede matricular estudiantes a demanda. También se incluyó funcionalidad para borrar en bloque (`delete`) apoyando mantenibilidad.
3.  **Registro de Menú:** Todo esto fue atado al submenú "Matrículas" dentro del menú Academia LMS principal en el área administrativa de WordPress (`includes/Admin/Matriculas.php`).

### Tareas Pendientes Inmediatas (Siguiente Paso - Cierre del Proyecto de Core MVP):
- Revisar requerimientos de "Fase 5: Addons Pro" indicados en la planificación o decidir si se da por concluida la versión Base.

---

## [2026-03-01] - Asistente de Configuración (Setup Wizard)

### Estado Actual:
- **Fase:** Setup Wizard (Phase 6) - COMPLETADA
- **Actividad:** Desarrollo de un asistente de configuración inicial interactivo para cuando el usuario active el plugin por primera vez, inspirado en flujos modernos tipo SaaS/WP Plugins.

### Resumen de Cambios:
1.  **Clase Wizard Core:** Implementada la lógica PHP que registra una página oculta de administración y captura el hook de activación del plugin para redirigir allí. Además almacena las preferencias como `update_option()`.
2.  **Vistas por Pasos (Views):** Construidos 4 archivos HTML/PHP modulares: `welcome` (con la grilla de features), `business_type` (Individual vs Marketplace), `settings` (login, fuentes) y `roles` (permisos y registro).
3.  **Diseño CSS Moderno:** Replicamos el estilo fluido, tipografía elegante y controles de "toggle switch" mostrados en las capturas de pantalla de referencia (`setup-wizard.css`). La cabecera incluye el rastreador de pasos (1, 2, 3...).

### Tareas Pendientes Inmediatas:
- Confirmar si se avanzará con integraciones de la "Fase 5: Addons Pro" (Certificados, Zoom) o se finalizará la iteración base.

---

## [2026-03-01] - Análisis de Arquitectura Modernizada (Dashboard SPA & Gutenberg)

### Estado Actual:
- **Fase:** Planificación Estratégica
- **Actividad:** El cliente ha solicitado una revisión completa de la experiencia visual de administración basada en referencias de alta calidad (similares a interfaces basadas en React y Gutenberg como Tutor/Academy LMS). Se realizó un Análisis Exhaustivo para reorientar el desarrollo hacia una plataforma independiente del *look & feel* tradicional de WordPress (Frontend en Backend).

### Acción Realizada:
- Se generó el documento maestro `admin_panel_analysis.md` detallando las Fases 7, 8 y 9 que integrarán un enrutador React (React Router), renderizado de gráficos y una experiencia nativa basada en componentes (SPA) que fusionará configuraciones manuales con la edición visual de bloques de Gutenberg.

---

## [2026-03-01] - Iteración Estratégica: Rebranding y SPA Completa

### Estado Actual:
- **Fase:** Planificación Estratégica y Actualización del Roadmap
- **Actividad:** Análisis visual de nuevas vistas de Settings, Tools, Forms y el inmersivo "Creator Editor" para los cursos, además de la solicitud explícita de rebranding. 

### Acción Realizada:
- Se **reestructuraron los artefactos** de gestión (`implementation_plan.md`, `task.md` y `admin_panel_analysis.md`). 
- **Rebranding Exigido:** El nombre estandarte ahora es `Dw Bolivar Academia lms`, concebido intelectualmente por Darwin j. Bolivar (Contacto YouTube: @bdarwinj).
- **Nuevo Roadmap:** Trazadas las etapas minuciosas hasta la Fase 11, segmentando la titánica labor de escribir una App Completa en React (Dashboard Global, Enrutador estricto lateral oscuro, DataGrids en React, Builder de Formularios Drag&Drop). 
- Todo quedó formalmente estipulado a la espera de confirmación de arranque.

---

## [2026-03-01] - Ejecución Fase 7: Rebranding y SPA Shell

### Estado Actual:
- **Fase:** Rebranding y SPA Base (Phase 7) - EN PROGRESO
- **Actividad:** Ejecución del rebranding oficial en los archivos del plugin e inicio de la migración de la interfaz administrativa a una SPA completa con React Router.

### Acciones Realizadas:
1.  **Rebranding en Código:** Modificado `academia-lms.php` para reflejar el nombre `Dw Bolivar Academia lms` y la autoría de `Darwin j. Bolivar`.
2.  **Preparación SPA:** Instaladas las dependencias (`react-router-dom`, `lucide-react`) y configurada la estructura de carpetas `src/components`, `src/pages`, etc.
3.  **Layout Inmersivo:** Desarrollados los componentes `Sidebar` (Dark), `AppShell` y `Dashboard` (Cards). El CSS ahora oculta automáticamente el menú lateral de WordPress cuando el usuario está en el panel del LMS, dando una sensación 100% de App independiente.
4.  **Montaje PHP:** Actualizada la clase `Menu` para montar la App en el ID correcto y usar el nuevo nombre de marca.

### Tareas Pendientes Inmediatas:
- Desarrollar la **Fase 7.3: Datos Dinámicos** para que las tarjetas del dashboard reflejen datos reales de la base de datos vía REST API.
- Iniciar la **Fase 8: DataGrids en React** para migrar el listado de cursos.

### Git Backup:
- **Hash/Commit:** Cambios recientes (Rebranding y Estructura SPA) han sido respaldados en Git con éxito.

---

## [2026-03-01] - Corrección de Error: Pantalla en Blanco en el Dashboard

### Estado Actual:
- **Fase:** Mantenimiento y Estabilidad (Phase 7) - SOLUCIONADO
- **Actividad:** Resolución de bug crítico que causaba que el nuevo panel SPA se mostrara en blanco.

### Detalles de la Corrección:
1.  **Build de React Fallido:** Se identificó que la compilación de Vite estaba fallando debido a un nombre de icono inexistente (`Tool` en `lucide-react`) y un error de escritura en el estilo del Dashboard (`justifyCenter` en lugar de `justifyContent`).
2.  **Rutas de Dependencias:** Se corrigió un error donde algunas dependencias se habían instalado en una carpeta errónea. Ahora todo reside correctamente en `react-app`.
3.  **Compilación Exitosa:** Se forzó un nuevo build (`npm run build`) y se verificó la generación de los archivos `main.js` y `main.css` en `assets/admin/`.
4.  **Confirmación de Montaje:** Se validó que el ID de montaje en PHP (`academia-admin-app`) coincida exactamente con el de la aplicación React.

### Git Backup:
- **Hash/Commit:** Fix aplicado y respaldado en Git. El árbol de trabajo está limpio y funcional.

### Tareas Pendientes Inmediatas:
- Iniciar la **Fase 8.2: Gestión de Estudiantes e Instructores** en React.

---

## [2026-03-01] - Ejecución Fase 8.1: DataGrid de Cursos en React

### Estado Actual:
- **Fase:** DataGrids en React (Phase 8) - COMPLETADA SUBFASE 8.1
- **Actividad:** Creación de la interfaz moderna para el listado de todos los cursos.

### Acciones Realizadas:
1.  **Backend (API & Taxonomías):** 
    *   Registrada la taxonomía `academia_categoria` para organizar los cursos.
    *   Creado `CourseController.php` con un endpoint dinámico que devuelve el título, autor, categorías, precios y alumnos matriculados por curso.
2.  **Frontend (DataGrid):**
    *   Desarrollado el componente `Courses.jsx` con un diseño de tabla premium.
    *   Implementado sistema de pestañas de filtrado por estado (Todos, Publicados, Borradores, Papelera).
    *   Añadida barra de búsqueda interactiva que se conecta con la API.
3.  **UI/UX:**
    *   Añadidos estados de carga y "Empty States" visuales cuando no hay cursos.
    *   Refinados los estilos de botones y tablas en `admin.css`.

### Git Backup:
- **Hash/Commit:** Implementada Subfase 8.1. El listado de cursos ahora es una SPA moderna y rápida.

---

## [2026-03-01] - Corrección de Error: Critical Error (REST API Routes)

### Estado Actual:
- **Fase:** Mantenimiento (Phase 8.1 Post-Deploy) - SOLUCIONADO
- **Actividad:** Resolución de un *Fatal Error* de WordPress en la pantalla de administración.

### Detalles de la Corrección:
1.  **Diagnóstico:** La compilación anterior incluía el registro de rutas de la API REST (`StatsController` y `CourseController`) directamente durante el hook `plugins_loaded`. Esto era demasiado temprano en el ciclo de vida de WordPress y causaba que la clase `WP_Site_Health` fallara (Critical Error detallado en la captura del usuario).
2.  **Solución:** Se editó el archivo `includes/Core/Plugin.php` para envolver la inicialización y registro de las rutas REST explícitamente dentro del hook `rest_api_init`.
3.  **Resultado:** El error fatal ha desaparecido y el panel vuelve a estar 100% operativo.

### Git Backup:
- **Hash/Commit:** Hotfix aplicado y respaldado en Git para el registro temprano de la API REST.

---

## [2026-03-01] - Ejecución Fase 8.2: Paneles de Estudiantes y Profesores en React

### Estado Actual:
- **Fase:** DataGrids en React (Phase 8) - COMPLETADA SUBFASE 8.2
- **Actividad:** Creación de las interfaces avanzadas para la gestión de alumnos y docentes.

### Acciones Realizadas:
1.  **Backend (User API):** 
    *   Desarrollado `UserController.php` con endpoints específicos para listar Estudiantes (filtrados por matrículas) e Instructores (filtrados por autoría de cursos).
    *   Integrada la lógica de conteo dinámico de cursos por usuario.
2.  **Frontend (DataGrids):**
    *   Creado `Students.jsx`: Listado con avatares, conteo de inscripciones y fechas de registro.
    *   Creado `Instructors.jsx`: Listado especializado para el equipo docente con visualización de cursos creados.
    *   Actualizado el enrutador principal en `App.jsx` para habilitar estas nuevas secciones.
3.  **UI/UX:**
    *   Mantenida la consistencia visual premium con el listado de cursos.
    *   Implementada búsqueda reactiva para encontrar usuarios rápidamente por nombre o email.

### Git Backup:
- **Hash/Commit:** Implementada Phase 8.2. Los paneles de Estudiantes y Profesores ahora son 100% SPA.

---

## [2026-03-01] - Ejecución Fase 9.1: Estructura del Creador Inmersivo

### Estado Actual:
- **Fase:** Creador Híbrido Inmersivo (Phase 9) - COMPLETADA SUBFASE 9.1
- **Actividad:** Creación de la estructura base a pantalla completa para el editor de cursos.

### Acciones Realizadas:
1.  **Layout Fullscreen:** Desarrollado `CourseEditor.jsx` con una barra superior persistente y navegación lateral interna (General, Curriculum, Ajustes). Este modo oculta el sidebar de la App para enfoque total.
2.  **Integración de Builder:** El componente `CourseBuilder` (Drag & Drop) ha sido acoplado satisfactoriamente dentro de la pestaña de "Curriculum" del editor.
3.  **Limpieza de Consola:** Se añadieron hooks en `Menu.php` para hacer dequeue de scripts de WooCommerce (`wc-settings`, `wc-admin-app`, etc.) cuando se carga el panel de Academia LMS, eliminando los errores de JS externos en la consola.
4.  **Actualización de Componentes:** Refactorizados `Courses.jsx`, `Students.jsx` e `Instructors.jsx` para integrar el nuevo sistema de llamadas a la API.
5.  **Corrección de Importación (ReferenceError):** Se añadió el icono `Users` faltante en las importaciones de `Courses.jsx` provenientes de `lucide-react`, evitando que el renderizado se rompiera en Safari/Chrome. Todo fue compilado nuevamente con Vite.

### Git Backup:
- **Hash/Commit:** Fix de importación faltante (Users icon) en Courses.jsx y recompilación.

---

## [2026-03-01] - Controles Laterales UI y Metadatos (Phase 9.2)

### Estado Actual:
- **Actividad:** Implementación de la vista `CourseEditor.jsx` con utilidades de campos enriquecidos y taxonomías.

### Acciones Realizadas:
1.  **Editor de Texto Enriquecido:** Se instaló y configuró la librería `react-quill` en el frontend (`react-app`) para habilitar capacidades WYSIWYG en el campo "Descripción del Curso".
2.  **Dropzone Interactivo:** Se programó un área de "arrastrar y soltar" (`Dropzone`) nativa en HTML5 para la carga visual y previsualización local de la "Imagen de Portada" del curso.
3.  **Ajustes Avanzados:** Se construyó la interfaz de usuario en la pestaña "Ajustes del Curso", agregando campos para:
    *   Estado de Publicación (Borrador/Publicado)
    *   Precio (USD)
    *   Nivel del Curso (Selectores)
    *   Categorías dinámicas (Checkboxes interactivos)
4.  **Estado Global del Curso:** El componente funcional en React ahora guarda satisfactoriamente todas las interacciones de estos campos dentro de su arbol de estados locales `useState`, listos para ser consumidos por un dispatch hacia la base de datos (Fase 9.3).

### Git Backup:
- **Hash/Commit:** Lógica de Guardado (API Sync) Completa Subfase 9.3

---

## [2026-03-01] - Herramientas de Autogeneración de Páginas (Phase 10.1)

### Estado Actual:
- **Actividad:** Implementación de utilidades administrativas para la configuración inicial del LMS.
- **Fase:** Herramientas y Formularios (Phase 10) - COMPLETADA SUBFASE 10.1

### Acciones Realizadas:
1.  **Herramienta de Páginas (Backend):** Se creó `ToolsController.php` con endpoints para verificar (`check-pages`) y generar (`generate-pages`) páginas críticas de WordPress (Dashboard, Catálogo) que contienen shortcodes esenciales.
2.  **Interfaz de Soporte (Frontend):** Se desarrolló `Tools.jsx`, una nueva sección en el panel SPA que muestra el estatus de las páginas necesarias y permite crearlas con un solo clic mediante una interfaz fluida con feedback de carga.
3.  **Rutas SPA:** Se vinculó el componente `Tools` en el sistema de navegación principal (`App.jsx`), reemplazando el placeholder anterior.

### Git Backup:
- **Hash/Commit:** Implementada Subfase 10.1 - Herramientas de Autogeneración de Páginas

---

## [2026-03-01] - Constructor de Formularios SPA Dinámico (Phase 10.2)

### Estado Actual:
- **Actividad:** Desarrollo de una herramienta visual para personalizar el formulario de registro de alumnos.
- **Fase:** Herramientas y Formularios (Phase 10) - COMPLETADA SUBFASE 10.2

### Acciones Realizadas:
1.  **Persistencia de Configuración (Backend):** Se creó `SettingsController.php` para gestionar la lectura y escritura del esquema del formulario en la base de datos de WordPress (`wp_options`), permitiendo una estructura JSON flexible.
2.  **Constructor Visual (Frontend - FormBuilder.jsx):**
    - Se implementó un entorno de trabajo con **Drag & Drop** (usando `@hello-pangea/dnd`) para reordenar campos.
    - Soporte para múltiples tipos de entrada: Texto, Email, Teléfono, Selección (Dropdown) y Checkbox.
    - Interfaz para editar etiquetas (*Labels*), *Placeholders* y marcar campos como obligatorios.
3.  **Integración de Navegación:** Se añadió el acceso directo a "Formularios" en la barra lateral oscura y se registró la ruta en el SPA principal.

### Git Backup:
- **Hash/Commit:** Implementada Subfase 10.2 - Form Builder Dinámico (D&D)

---

## [2026-03-01] - Librería de Bloques Gutenberg para Landings (Phase 11.1)

### Estado Actual:
- **Actividad:** Creación de componentes nativos de WordPress para el diseño de páginas de aterrizaje premium.
- **Fase:** Bloques Propios de Landing (Phase 11) - COMPLETADA SUBFASE 11.1

### Acciones Realizadas:
1.  **Registro de Bloques (Backend):** Se creó la clase `Blocks.php` para registrar una nueva categoría "Academia LMS" en el editor Gutenberg y definir los bloques `hero` y `course-grid`.
2.  **Bloque Hero (Visual):** Se desarrolló el componente JS para el editor que permite gestionar títulos, subtítulos e imágenes de fondo con una interfaz WYSIWYG. En el frontend, se renderiza con gradientes y tipografías premium.
3.  **Grilla de Cursos Dinámica:** Se implementó un bloque que permite configurar visualmente el número de columnas y el límite de elementos, delegando el renderizado final a una función PHP para mantener la consistencia con el catálogo.
4.  **Estilos Propios:** Se añadieron hojas de estilo separadas para el editor (`blocks-editor.css`) y el frontend (`blocks.css`), asegurando un diseño coherente y moderno.

### Git Backup:
- **Hash/Commit:** Implementada Subfase 11.1 - Librería de Bloques de Landing

---

## [2026-03-01] - Configuraciones Avanzadas del Curso (Phase 13)

### Estado Actual:
- **Actividad:** Implementación de la pestaña "Settings" estilo Masteriyo con opciones de UI avanzadas (toggles/radios).
- **Fase:** Advanced Course Settings Tab (Phase 13) - COMPLETADA

### Acciones Realizadas:
1.  **Frontend (`CourseEditor.jsx`):** 
    - Implementado sub-menú Maestro-Detalle vertical.
    - Componentes de UI modernos configurados (Toggles switches, radio buttons personalizados).
    - Creadas pestañas específicas: **Display** (Reseñas, Bienvenida), **Content Drip** (Programación de contenido secuencial/fechas) y **Certificate** (Generador de certificados).
2.  **Backend (`CourseController.php`):** 
    - Se agregó lógica para guardar y recuperar todos estos nuevos ajustes bajo un solo meta clave en la DB llamado `_academia_course_settings` (en formato JSON serializado).
3.  **Sincronización:** Los ajustes son cargados exitosamente al entrar al editor y se guardan como parte del JSON Payload principal junto al contenido del curso al presionar "Guardar Cambios".

### Git Backup:
- **Hash/Commit:** Implementada Phase 13: Ajustes avanzados (Settings) con submenú estilo Masteriyo y sincronización DB.

---

## [2026-03-01] - Sincronización Avanzada Backend: Lecciones como CPT (Phase 12.4)

### Estado Actual:
- **Actividad:** Creación de endpoints REST dedicados para lecciones y sincronización completa con WordPress.
- **Fase:** Advanced Builder UI (Phase 12) - COMPLETADA

### Acciones Realizadas:
1.  **`LessonController.php` (Backend):** Se creó un controlador REST completo con los siguientes endpoints:
    - `GET /academia-lms/v1/lessons` — Lista lecciones, con filtrado por `course_id`.
    - `POST /academia-lms/v1/lessons` — Crea un post `academia_leccion` individual.
    - `GET/PUT/DELETE /academia-lms/v1/lessons/{id}` — CRUD para lecciones individuales.
    - **`POST /academia-lms/v1/lessons/sync-course/{courseId}` — Sincronización masiva**: itera el `builder_data` del curso, y por cada lección crea o actualiza su post correspondiente en WordPress, guardando metadatos clave (`_academia_lesson_type`, `_academia_lesson_video_url`, `_academia_lesson_course_id`, `_academia_lesson_item_id`).
2.  **Registro en `Plugin.php`:** Se registró el `LessonController` dentro del hook `rest_api_init`.
3.  **Frontend (`CourseEditor.jsx`):** Tras guardar el curso exitosamente, el código ahora automáticamente llama al endpoint `/sync-course` para persistir todas las lecciones como posts de WordPress. La respuesta con los `wp_post_id` generados es guardada de vuelta en el `builderData` para futuras actualizaciones.

### Git Backup:
- **Hash/Commit:** Implementada Subfase 12.4: Sincronización REST Avanzada y LessonController.

---

## [2026-03-01] - Motor de Sub-edición para Lecciones (Phase 12.3)

### Estado Actual:
- **Actividad:** Implementación del sistema de "Sub-vistas" para la edición aislada de lecciones individuales.
- **Fase:** Advanced Builder UI (Phase 12) - EXECUCIÓN (Subfase 12.3)

### Acciones Realizadas:
1.  **Transición a Sub-vista:** Se añadió lógica en `CourseEditor.jsx` para alternar entre la vista del constructor general y un editor de lección específico mediante el estado `editingLesson`.
2.  **Editor de Lección (Sub-view):** Se diseñó una interfaz a pantalla dividida (70/30) para la edición de lecciones:
    - **Área Principal:** Edición de título y contenido enriquecido (ReactQuill).
    - **Área Lateral:** Ajustes específicos como URL de video (condicional por tipo), previsualización y miniaturas.
3.  **Sincronización de Datos en Tiempo Real:** Se implementó la función `updateLessonData` para que cualquier cambio realizado en la sub-vista se refleje instantáneamente en el objeto `builderData` del curso principal.
4.  **UX de Navegación:** Se incluyó un botón de retorno ("Volver al Constructor") con iconos descriptivos y un botón de finalización, manteniendo al usuario orientado dentro del flujo de creación.

### Git Backup:
- **Hash/Commit:** Implementada Subfase 12.3: Motor de Sub-edición y UI de Lección Individual.

---

## [2026-03-01] - Constructor Avanzado y Modal de Contenido (Phase 12.2)

### Estado Actual:
- **Actividad:** Mejora funcional del `CourseBuilder.jsx` para permitir una organización más limpia y selección explícita de tipos de lecciones.
- **Fase:** Advanced Builder UI (Phase 12) - EXECUCIÓN (Subfase 12.2)

### Acciones Realizadas:
1.  **Secciones tipo Acordeón:** Se implementó lógica de expansión/colapso para las secciones del curso, permitiendo a los instructores enfocarse en un módulo a la vez.
2.  **Modal de Selección de Contenido:** Se desarrolló un nuevo componente `ContentTypeModal` que se dispara al intentar añadir contenido. Permite elegir entre:
    - **Lección de Texto** (Icono FileText)
    - **Lección de Video** (Icono Video)
    - **Cuestionario/Quiz** (Icono HelpCircle)
    - **Recursos/Links** (Icono Link)
3.  **UI/UX Refinada:** 
    - Se agregaron iconos descriptivos para cada tipo de ítem en la lista.
    - Se mejoraron los estados de hover y transiciones (desplazamientos sutiles a la derecha al pasar el mouse).
    - Se diseñó un modal con desenfoque de fondo (`backdrop-filter`) y animaciones suaves de entrada.
4.  **Gestión de Datos:** Se optimizó el flujo de creación de ítems para asignar IDs únicos basados en marcas de tiempo y tipos de contenido específicos.

### Git Backup:
- **Hash/Commit:** Implementada Subfase 12.2: Constructor Avanzado con Acordeones y Modal de Selección.

---

## [2026-03-01] - Refactorización de Layout: Advanced Builder (Phase 12.1)

### Estado Actual:
- **Actividad:** Transformación de la interfaz del editor de cursos hacia un modelo basado en pestañas horizontales y barras laterales contextuales.
- **Fase:** Advanced Builder UI (Phase 12) - EXECUCIÓN (Subfase 12.1)

### Acciones Realizadas:
1.  **Nuevo Layout de Navegación:** Se refactorizó `CourseEditor.jsx` para reemplazar la barra lateral izquierda por un sistema de **Pestañas Horizontales** (`Overview`, `Builder`, `Settings`) en la barra superior.
2.  **Distribución Inmersiva (70/30):** En la pestaña `Overview`, se implementó un diseño de dos columnas:
    - **Pilar Principal:** Título, Descripción (ReactQuill) y Highlights.
    - **Pilar de Sidebar:** Imagen Destacada (Dropzone), Categorías, Nivel y Slug.
3.  **Ajustes Master-Detail:** Se preparó la estructura de la pestaña `Settings` con una navegación vertical secundaria para separar Pricing, Accesos e Instructores.
4.  **Estilos Premium:** Se inyectaron estilos CSS actualizados para lograr bordes suaves, sombras sutiles y una tipografía más legible, imitando la estética de Masteriyo LMS.
5.  **Fix de Estabilidad:** Se corrigieron errores de sintaxis en el archivo principal y se validó que las funciones de guardado y carga sigan operativas.

### Git Backup:
- **Hash/Commit:** Implementada Subfase 12.1: Refactorización de Layout y Navegación Advanced Builder.

---

## [2026-03-01] - Análisis y Planificación: Advanced Builder UI (Phase 12)

### Estado Actual:
- **Actividad:** Análisis competitivo de capturas provistas por el usuario (referencia: Masteriyo LMS).
- **Fase:** Advanced Builder UI (Phase 12) - PLANIFICACIÓN

### Acciones Realizadas:
1.  **Revisión de Capturas:** Se analizaron 4 capturas de pantalla de la interfaz de creación de cursos de Masteriyo.
2.  **Identificación de Paradigmas de UX:**
    - Uso de pestañas horizontales (`Overview`, `Builder`, `Settings`) en lugar de barra lateral izquierda.
    - Implementación de una barra lateral derecha contextual para metadatos (Categorías, Imagen destacada).
    - Uso de un **Modal de Selección de Tipo de Contenido** al añadir ítems al constructor (Lección de Texto, Video, Quiz, etc.).
    - Paradigma de **Sub-vista (Lesson Editor):** Al editar una lección específica, la UI transiciona a una vista dedicada, ocultando el constructor temporalmente.
3.  **Plan de Implementación:** Se redactó `implementation_plan_advanced_builder.md` detallando los pasos para refactorizar `CourseEditor.jsx` y `CourseBuilder.jsx` para adoptar esta experiencia de usuario superior.

---

## [2026-03-01] - Lógica de Guardado y Sincronización API (Phase 9.3)

### Estado Actual:
- **Actividad:** Conexión del `CourseEditor.jsx`  y `CourseBuilder.jsx` con el backend de WordPress para guardar y actualizar cursos.
- **Fase:** Creador Híbrido Inmersivo (Phase 9) - COMPLETADA

### Acciones Realizadas:
1.  **Nuevos Endpoints REST (Backend):** Se ampliaron las rutas en `CourseController.php` permitiendo métodos `POST` (crear) y `PUT` (actualizar) en el endpoint `/academia-lms/v1/courses` y `/academia-lms/v1/courses/(?P<id>\d+)`.
2.  **Carga y Creación (Frontend):** Se actualizó `CourseEditor.jsx` para extraer el parámetro `id` de la ruta de React (`/courses/edit/:id`). Si existe un ID, el editor hace fetch a la API para cargar la métrica y estatus del curso.
3.  **Sincronización de Imagen:** Se añadió soporte para subir las imágenes `Thumbnail` al endpoint nativo de medios (`/wp/v2/media`) para obtener el ID de adjunto (`featured_media`) antes de guardar el curso.
4.  **Builder D&D Controlado:** Se reescribió el estado de `CourseBuilder.jsx` pasándolo de estado "Uncontrolled" local a "Controlled" con `value` y `onChange`, permitiendo que el estado de "Curriculum" se levante hasta `CourseEditor.jsx` para ser guardado con un solo payload final.

### Git Backup:
- **Hash/Commit:** Lógica de Guardado (API Sync) Completa Subfase 9.3

---

## [2026-03-01] - Ejecución Final Fase 8.2: Gestión Completa de Usuarios

### Estado Actual:
- **Fase:** DataGrids en React (Phase 8) - COMPLETADA SUBFASE 8.2
- **Actividad:** Implementación de CRUD completo para Estudiantes y Profesores, gestión de matrículas y perfiles detallados.

### Acciones Realizadas:
1.  **Backend CRUD:** Desarrollado `UserController.php` con endpoints REST para:
    - Crear usuarios (estudiantes y profesores) con validación de roles.
    - Eliminar usuarios.
    - Matricular/Desmatricular alumnos de cursos.
    - Listar cursos por usuario con progreso y estado.
2.  **Componentes UI Reutilizables:** Creados `Modal.jsx` y `SlideOver.jsx` para una experiencia fluida y moderna tipo SPA.
3.  **Paneles Interactivos:**
    - **Students.jsx:** Implementado botón para añadir alumnos, tabla con acciones de eliminación y visor de perfil detallado via SlideOver con lista de cursos.
    - **Instructors.jsx:** Implementado sistema de invitación de profesores y vista de cursos asignados/creados.
4.  **Refinado de API:** La recolección de estudiantes ahora unifica datos de la tabla de usuarios de WordPress y la tabla custom `academia_matriculas`.

### Git Backup:
- **Hash/Commit:** Finalizada Phase 8.2: CRUD y Gestión de Matrículas en React.

---

## [2026-03-02] - Expansión de Pestaña General y Fixes de UI (Phase 13)

### Estado Actual:
- **Actividad:** Completado de la pestaña 'General' del ajuste de cursos, reparación de interacciones en grillas y planificación del Frontend nativo.
- **Fase:** Settings Avanzados (Phase 13) - COMPLETADA / Preparación Frontend (Phase 14)

### Acciones Realizadas:
1.  **Pestaña General Reestructurada (`CourseEditor.jsx`):** 
    - Rediseño completo para replicar la experiencia de Masteriyo. División en "Course Basics" (Instructor, Dificultad, Duración, Insignia) y "Access & Restrictions" (Límite estudiantes, Conteo Estático, Contraseña pública, Rehacer curso).
2.  **Acciones en Grillas (`Courses.jsx`):**
    - Funcionalidad real en botones de listado de cursos. "Ver Curso" enlaza al frontend, "Editar" entra al SPA Builder y "Eliminar" pide confirmación y destruye el registro vía API.
3.  **Planificación Fase 14 (Frontend Experience):**
    - Redacción y aprobación del `implementation_plan_frontend_phase14.md`.
    - Decisión arquitectónica clave tomada: **Construir el Frontend con Bloques Nativos de Gutenberg (React)** para cero dependencias, alto rendimiento y futuro de FSE en WP.

### Git Backup:
- **Hash/Commit:** (Ver Git Log para commits: Expansión de Tab General y Reparación de Botones de Cursos).
