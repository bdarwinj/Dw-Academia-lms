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
- [ ] Construir la estructura de datos (CPT o tablas) para el Motor de Cuestionarios.
- [ ] Programar la interfaz para añadir Preguntas y Opciones al Cuestionario.
