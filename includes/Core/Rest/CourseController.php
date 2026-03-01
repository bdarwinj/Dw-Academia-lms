<?php

namespace AcademiaLms\Core\Rest;

use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Handle Course List for the Admin DataGrid
 */
class CourseController extends WP_REST_Controller {

    protected $namespace = 'academia-lms/v1';
    protected $rest_base = 'courses';

    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_courses'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'create_course'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>\d+)', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_course'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
            [
                'methods'             => WP_REST_Server::EDITABLE,
                'callback'            => [$this, 'update_course'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
            [
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => [$this, 'delete_course'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);
    }

    public function check_permissions() {
        return current_user_can('manage_options');
    }

    public function get_courses($request) {
        $status = $request->get_param('status') ?: 'any';
        $search = $request->get_param('search');

        $args = [
            'post_type'      => 'academia_curso',
            'posts_per_page' => -1,
            'post_status'    => $status === 'any' ? ['publish', 'draft', 'pending', 'private'] : $status,
            's'              => $search,
        ];

        $query = new \WP_Query($args);
        $courses = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $post_id = get_the_ID();
                
                // Get Author
                $author_id = get_post_field('post_author', $post_id);
                $author_name = get_the_author_meta('display_name', $author_id);

                // Get Categories
                $categories = get_the_terms($post_id, 'academia_categoria');
                $cat_names = $categories && !is_wp_error($categories) ? wp_list_pluck($categories, 'name') : [];

                // Get Enrollment Count
                global $wpdb;
                $table_matriculas = $wpdb->prefix . 'academia_matriculas';
                $enrollments = 0;
                if ($wpdb->get_var("SHOW TABLES LIKE '$table_matriculas'")) {
                    $enrollments = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_matriculas WHERE curso_id = %d", $post_id));
                }

                // Get Price
                $price = get_post_meta($post_id, '_academia_curso_precio', true) ?: 'Gratis';

                $courses[] = [
                    'id'          => $post_id,
                    'title'       => get_the_title(),
                    'author'      => $author_name,
                    'categories'  => $cat_names,
                    'status'      => get_post_status(),
                    'enrollments' => (int) $enrollments,
                    'price'       => $price,
                    'date'        => get_the_date('Y-m-d'),
                    'thumbnail'   => get_the_post_thumbnail_url($post_id, 'thumbnail') ?: '',
                ];
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response($courses, 200);
    }

    public function get_course($request) {
        $post_id = $request['id'];
        $post = get_post($post_id);

        if (!$post || $post->post_type !== 'academia_curso') {
            return new \WP_Error('not_found', 'Curso no encontrado.', ['status' => 404]);
        }

        $price = get_post_meta($post_id, '_academia_curso_precio', true) ?: '0';
        $level = get_post_meta($post_id, '_academia_curso_nivel', true) ?: 'beginner';
        $video_url = get_post_meta($post_id, '_academia_curso_video', true) ?: '';
        
        $categories = get_the_terms($post_id, 'academia_categoria');
        $cat_names = $categories && !is_wp_error($categories) ? wp_list_pluck($categories, 'name') : [];

        $builder_data = get_post_meta($post_id, '_academia_builder_layout', true) ?: null;

        $course_data = [
            'id'          => $post_id,
            'title'       => $post->post_title,
            'description' => $post->post_content,
            'status'      => $post->post_status,
            'price'       => $price,
            'level'       => $level,
            'videoUrl'    => $video_url,
            'categories'  => $cat_names,
            'thumbnail'   => get_the_post_thumbnail_url($post_id, 'full') ?: '',
            'builder_data'=> $builder_data
        ];

        return rest_ensure_response($course_data);
    }

    public function create_course($request) {
        $params = $request->get_json_params();

        $post_id = wp_insert_post([
            'post_type'    => 'academia_curso',
            'post_title'   => sanitize_text_field($params['title']),
            'post_content' => wp_kses_post($params['description']),
            'post_status'  => sanitize_text_field($params['status']),
            'post_author'  => get_current_user_id()
        ], true);

        if (is_wp_error($post_id)) {
            return new \WP_Error('insert_failed', 'No se pudo crear el curso', ['status' => 500]);
        }

        $this->update_course_meta($post_id, $params);

        return rest_ensure_response([
            'id' => $post_id,
            'message' => 'Curso creado exitosamente.'
        ]);
    }

    public function update_course($request) {
        $post_id = $request['id'];
        $params = $request->get_json_params();

        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'academia_curso') {
            return new \WP_Error('not_found', 'Curso no encontrado.', ['status' => 404]);
        }

        wp_update_post([
            'ID'           => $post_id,
            'post_title'   => sanitize_text_field($params['title']),
            'post_content' => wp_kses_post($params['description']),
            'post_status'  => sanitize_text_field($params['status'])
        ]);

        $this->update_course_meta($post_id, $params);

        return rest_ensure_response([
            'id' => $post_id,
            'message' => 'Curso actualizado exitosamente.'
        ]);
    }

    private function update_course_meta($post_id, $params) {
        if (isset($params['price'])) update_post_meta($post_id, '_academia_curso_precio', sanitize_text_field($params['price']));
        if (isset($params['level'])) update_post_meta($post_id, '_academia_curso_nivel', sanitize_text_field($params['level']));
        if (isset($params['videoUrl'])) update_post_meta($post_id, '_academia_curso_video', esc_url_raw($params['videoUrl']));
        
        if (isset($params['categories']) && is_array($params['categories'])) {
            wp_set_object_terms($post_id, $params['categories'], 'academia_categoria');
        }

        if (isset($params['featured_media'])) {
            set_post_thumbnail($post_id, intval($params['featured_media']));
        }

        if (isset($params['builder_data'])) {
            update_post_meta($post_id, '_academia_builder_layout', $params['builder_data']);
        }
    }

    public function delete_course($request) {
        $post_id = $request['id'];
        
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'academia_curso') {
            return new \WP_Error('not_found', 'Curso no encontrado.', ['status' => 404]);
        }

        $deleted = wp_delete_post($post_id, true);
        if (!$deleted) {
            return new \WP_Error('delete_failed', 'Error al eliminar el curso.', ['status' => 500]);
        }

        return rest_ensure_response(['message' => 'Curso eliminado correctamente.']);
    }
}
