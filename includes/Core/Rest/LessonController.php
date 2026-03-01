<?php

namespace AcademiaLms\Core\Rest;

use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Dedicated REST controller for individual lesson operations.
 * Manages saving/loading rich lesson content (text, video URL, etc.)
 * as a dedicated WordPress CPT post (academia_leccion), linked to a course.
 */
class LessonController extends WP_REST_Controller {

    protected $namespace = 'academia-lms/v1';
    protected $rest_base = 'lessons';

    public function register_routes() {
        // GET/POST /lessons
        register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_lessons'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'create_lesson'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);

        // GET/PUT/DELETE /lessons/{id}
        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>\d+)', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_lesson'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
            [
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => [$this, 'update_lesson'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
            [
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => [$this, 'delete_lesson'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);

        // Bulk save (upsert) lessons within a course's builder_data
        // POST /lessons/sync-course/{courseId}
        register_rest_route($this->namespace, '/' . $this->rest_base . '/sync-course/(?P<courseId>\d+)', [
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'sync_course_lessons'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);
    }

    public function check_permissions() {
        return current_user_can('manage_options');
    }

    /**
     * GET /lessons?course_id={id}
     * Returns all lessons for a given course (by their CPT post data).
     */
    public function get_lessons($request) {
        $course_id = $request->get_param('course_id');

        $args = [
            'post_type'      => 'academia_leccion',
            'posts_per_page' => -1,
            'post_status'    => ['publish', 'draft'],
        ];

        if ($course_id) {
            $args['meta_query'] = [
                [
                    'key'   => '_academia_lesson_course_id',
                    'value' => intval($course_id),
                ]
            ];
        }

        $query   = new \WP_Query($args);
        $lessons = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id   = get_the_ID();
                $lessons[] = $this->format_lesson($post_id);
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response($lessons, 200);
    }

    /**
     * GET /lessons/{id}
     */
    public function get_lesson($request) {
        $post_id = (int) $request['id'];
        $post    = get_post($post_id);

        if (!$post || $post->post_type !== 'academia_leccion') {
            return new \WP_Error('not_found', 'Lección no encontrada.', ['status' => 404]);
        }

        return rest_ensure_response($this->format_lesson($post_id));
    }

    /**
     * POST /lessons
     * Creates a new lesson CPT post.
     */
    public function create_lesson($request) {
        $params = $request->get_json_params();

        $post_id = wp_insert_post([
            'post_type'    => 'academia_leccion',
            'post_title'   => sanitize_text_field($params['title'] ?? 'Nueva Lección'),
            'post_content' => wp_kses_post($params['content'] ?? ''),
            'post_status'  => 'draft',
            'post_author'  => get_current_user_id(),
        ], true);

        if (is_wp_error($post_id)) {
            return new \WP_Error('create_failed', 'No se pudo crear la lección.', ['status' => 500]);
        }

        $this->update_lesson_meta($post_id, $params);

        return rest_ensure_response([
            'id'      => $post_id,
            'message' => 'Lección creada exitosamente.',
        ]);
    }

    /**
     * PUT /lessons/{id}
     * Updates an existing lesson.
     */
    public function update_lesson($request) {
        $post_id = (int) $request['id'];
        $params  = $request->get_json_params();

        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'academia_leccion') {
            return new \WP_Error('not_found', 'Lección no encontrada.', ['status' => 404]);
        }

        wp_update_post([
            'ID'           => $post_id,
            'post_title'   => sanitize_text_field($params['title'] ?? $post->post_title),
            'post_content' => wp_kses_post($params['content'] ?? $post->post_content),
            'post_status'  => sanitize_text_field($params['status'] ?? 'draft'),
        ]);

        $this->update_lesson_meta($post_id, $params);

        return rest_ensure_response([
            'id'      => $post_id,
            'message' => 'Lección actualizada.',
        ]);
    }

    /**
     * DELETE /lessons/{id}
     */
    public function delete_lesson($request) {
        $post_id = (int) $request['id'];
        $post    = get_post($post_id);

        if (!$post || $post->post_type !== 'academia_leccion') {
            return new \WP_Error('not_found', 'Lección no encontrada.', ['status' => 404]);
        }

        wp_delete_post($post_id, true);

        return rest_ensure_response(['message' => 'Lección eliminada.']);
    }

    /**
     * POST /lessons/sync-course/{courseId}
     * Bulk upserts all lessons from the builder_data of a course.
     * Ensures each lesson has a backing WP Post in academia_leccion.
     */
    public function sync_course_lessons($request) {
        $course_id   = (int) $request['courseId'];
        $params      = $request->get_json_params();
        $builder_data = $params['builder_data'] ?? null;

        if (!$builder_data || !isset($builder_data['sections'])) {
            return new \WP_Error('invalid_data', 'Datos del constructor inválidos.', ['status' => 400]);
        }

        $synced_ids = [];

        foreach ($builder_data['sections'] as $section) {
            if (empty($section['items'])) continue;

            foreach ($section['items'] as $item) {
                if ($item['type'] === 'quiz') continue; // Quizzes are separate

                $existing_id = intval($item['wp_post_id'] ?? 0);
                $post_data   = [
                    'post_type'    => 'academia_leccion',
                    'post_title'   => sanitize_text_field($item['title'] ?? 'Lección'),
                    'post_content' => wp_kses_post($item['content'] ?? ''),
                    'post_status'  => 'draft',
                    'post_author'  => get_current_user_id(),
                ];

                if ($existing_id && get_post($existing_id)) {
                    $post_data['ID'] = $existing_id;
                    $post_id = wp_update_post($post_data);
                } else {
                    $post_id = wp_insert_post($post_data, true);
                    if (is_wp_error($post_id)) continue;
                }

                $meta = [
                    'type'      => $item['type'] ?? 'text',
                    'videoUrl'  => $item['videoUrl'] ?? '',
                    'course_id' => $course_id,
                    'item_id'   => $item['id'] ?? '',
                ];
                $this->update_lesson_meta($post_id, $meta);

                $synced_ids[] = [
                    'item_id'    => $item['id'],
                    'wp_post_id' => $post_id,
                ];
            }
        }

        return rest_ensure_response([
            'message'    => 'Lecciones sincronizadas exitosamente.',
            'synced_ids' => $synced_ids,
        ]);
    }

    // --- Helpers ---

    private function format_lesson($post_id) {
        $post = get_post($post_id);
        return [
            'id'        => $post_id,
            'title'     => $post->post_title,
            'content'   => $post->post_content,
            'status'    => $post->post_status,
            'type'      => get_post_meta($post_id, '_academia_lesson_type', true) ?: 'text',
            'videoUrl'  => get_post_meta($post_id, '_academia_lesson_video_url', true) ?: '',
            'courseId'  => (int) get_post_meta($post_id, '_academia_lesson_course_id', true),
            'itemId'    => get_post_meta($post_id, '_academia_lesson_item_id', true) ?: '',
            'thumbnail' => get_the_post_thumbnail_url($post_id, 'medium') ?: '',
        ];
    }

    private function update_lesson_meta($post_id, $params) {
        if (isset($params['type']))      update_post_meta($post_id, '_academia_lesson_type', sanitize_text_field($params['type']));
        if (isset($params['videoUrl']))  update_post_meta($post_id, '_academia_lesson_video_url', esc_url_raw($params['videoUrl']));
        if (isset($params['course_id'])) update_post_meta($post_id, '_academia_lesson_course_id', intval($params['course_id']));
        if (isset($params['item_id']))   update_post_meta($post_id, '_academia_lesson_item_id', sanitize_text_field($params['item_id']));
        if (isset($params['featured_media'])) set_post_thumbnail($post_id, intval($params['featured_media']));
    }
}
