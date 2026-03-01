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
- [ ] Construir pantalla de administración de matrículas para que el profesor/admin vea quién está matriculado y asigne usuarios a mano.
