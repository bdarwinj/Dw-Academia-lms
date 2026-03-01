<?php

namespace AcademiaLms\Core\Rest;

use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Server;
use WP_User_Query;

/**
 * Handle Student and Instructor lists for the Admin DataGrid
 */
class UserController extends WP_REST_Controller {

    protected $namespace = 'academia-lms/v1';
    protected $rest_base = 'users';

    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base . '/students', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_students'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/instructors', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_instructors'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);
    }

    public function check_permissions() {
        return current_user_can('manage_options');
    }

    /**
     * Get Students list
     */
    public function get_students($request) {
        $search = $request->get_param('search');
        
        // Find users who are in the matriculas table
        global $wpdb;
        $table_matriculas = $wpdb->prefix . 'academia_matriculas';
        $student_ids = $wpdb->get_col("SELECT DISTINCT user_id FROM $table_matriculas");

        $args = [
            'role__in' => ['subscriber', 'customer', 'student'], // Common student roles
            'search'   => $search ? '*' . $search . '*' : '',
        ];

        // If we have specific IDs from matriculas, prioritize them
        if (!empty($student_ids)) {
            $args['include'] = $student_ids;
            unset($args['role__in']); // Get everyone in the matriculas table regardless of role
        }

        $user_query = new \WP_User_Query($args);
        $users = $user_query->get_results();
        $data = [];

        foreach ($users as $user) {
            // Get count of courses enrolled
            $courses_count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_matriculas WHERE user_id = %d", $user->ID));

            $data[] = [
                'id'            => $user->ID,
                'name'          => $user->display_name,
                'email'         => $user->user_email,
                'username'      => $user->user_login,
                'courses_count' => (int) $courses_count,
                'date'          => $user->user_registered,
                'avatar'        => get_avatar_url($user->ID),
            ];
        }

        return new WP_REST_Response($data, 200);
    }

    /**
     * Get Instructors list
     */
    public function get_instructors($request) {
        $search = $request->get_param('search');

        // Instructors are often authors of courses or have a specific role
        $args = [
            'role__in' => ['administrator', 'editor', 'author', 'instructor'],
            'search'   => $search ? '*' . $search . '*' : '',
        ];

        $user_query = new \WP_User_Query($args);
        $users = $user_query->get_results();
        $data = [];

        foreach ($users as $user) {
            // Count courses authored by this user
            $courses_count = count(get_posts([
                'post_type'   => 'academia_curso',
                'author'      => $user->ID,
                'post_status' => 'any',
                'fields'      => 'ids',
            ]));

            // Only include if they have courses OR specific role (optional logic)
            // For now, include all admins/authors for visibility

            $data[] = [
                'id'            => $user->ID,
                'name'          => $user->display_name,
                'email'         => $user->user_email,
                'username'      => $user->user_login,
                'courses_count' => (int) $courses_count,
                'date'          => $user->user_registered,
                'avatar'        => get_avatar_url($user->ID),
            ];
        }

        return new WP_REST_Response($data, 200);
    }
}
