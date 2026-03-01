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
}
