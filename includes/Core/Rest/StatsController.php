<?php

namespace AcademiaLms\Core\Rest;

use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Handle LMS Statistics for the Admin Dashboard
 */
class StatsController extends WP_REST_Controller {

    protected $namespace = 'academia-lms/v1';
    protected $rest_base = 'stats';

    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base . '/overview', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_overview_stats'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);
    }

    public function check_permissions() {
        return current_user_can('manage_options');
    }

    public function get_overview_stats() {
        global $wpdb;

        // Count courses (academia_curso post type)
        $total_courses = wp_count_posts('academia_curso')->publish;

        // Count enrollments (from custom table)
        $table_matriculas = $wpdb->prefix . 'academia_matriculas';
        $total_enrollments = 0;
        if ($wpdb->get_var("SHOW TABLES LIKE '$table_matriculas'")) {
            $total_enrollments = $wpdb->get_var("SELECT COUNT(*) FROM $table_matriculas");
        }

        // Count lessons (academia_leccion post type)
        $total_lessons = wp_count_posts('academia_leccion')->publish;

        // Pending questions (Placeholder for now)
        $pending_questions = 0;

        return new WP_REST_Response([
            'courses'     => (int) $total_courses,
            'enrollments' => (int) $total_enrollments,
            'lessons'     => (int) $total_lessons,
            'questions'   => (int) $pending_questions,
        ], 200);
    }
}
