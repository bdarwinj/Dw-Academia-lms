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
- [ ] Implementar la Gestión de Lecciones (Video HTML5/YouTube).
- [ ] Sincronizar editor Gutenberg para el contenido de texto de cada Lección.
