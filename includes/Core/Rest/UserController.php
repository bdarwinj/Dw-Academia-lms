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

        register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'create_user'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>\d+)', [
            [
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => [$this, 'delete_user'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>\d+)/enroll', [
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'enroll_student'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
            [
                'methods'             => WP_REST_Server::DELETABLE,
                'callback'            => [$this, 'unenroll_student'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);

        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>\d+)/courses', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_user_courses'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);
    }

    public function check_permissions() {
        return current_user_can('manage_options');
    }

    /**
     * Create a new user (Student or Instructor)
     */
    public function create_user($request) {
        $params = $request->get_params();
        
        if (empty($params['email']) || empty($params['username']) || empty($params['role'])) {
            return new \WP_Error('missing_params', 'Faltan campos obligatorios.', ['status' => 400]);
        }

        $user_id = wp_create_user($params['username'], $params['password'] ?? wp_generate_password(), $params['email']);

        if (is_wp_error($user_id)) {
            return $user_id;
        }

        $user = new \WP_User($user_id);
        $user->set_role($params['role']);
        
        if (!empty($params['name'])) {
            wp_update_user(['ID' => $user_id, 'display_name' => $params['name']]);
        }

        return new WP_REST_Response(['id' => $user_id, 'message' => 'Usuario creado correctamente.'], 201);
    }

    /**
     * Delete a user
     */
    public function delete_user($request) {
        $user_id = $request['id'];
        
        if (!get_userdata($user_id)) {
            return new \WP_Error('not_found', 'Usuario no encontrado.', ['status' => 404]);
        }

        require_once ABSPATH . 'wp-admin/includes/user.php';
        
        if (wp_delete_user($user_id)) {
            return new WP_REST_Response(['message' => 'Usuario eliminado.'], 200);
        }

        return new \WP_Error('delete_failed', 'No se pudo eliminar el usuario.', ['status' => 500]);
    }

    /**
     * Enroll a student in a course
     */
    public function enroll_student($request) {
        $user_id = $request['id'];
        $course_id = $request->get_param('course_id');

        if (!$course_id) {
            return new \WP_Error('missing_course', 'Falta el ID del curso.', ['status' => 400]);
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'academia_matriculas';

        // Check if already enrolled
        $exists = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table_name WHERE user_id = %d AND curso_id = %d",
            $user_id, $course_id
        ));

        if ($exists) {
            return new \WP_Error('already_enrolled', 'El estudiante ya está inscrito en este curso.', ['status' => 400]);
        }

        $result = $wpdb->insert($table_name, [
            'user_id'  => $user_id,
            'curso_id' => $course_id,
            'fecha_alta' => current_time('mysql'),
            'estado'   => 'activa'
        ]);

        if ($result) {
            return new WP_REST_Response(['message' => 'Estudiante matriculado.'], 200);
        }

        return new \WP_Error('enroll_failed', 'Error al matricular.', ['status' => 500]);
    }

    /**
     * Unenroll a student from a course
     */
    public function unenroll_student($request) {
        $user_id = $request['id'];
        $course_id = $request->get_param('course_id');

        global $wpdb;
        $table_name = $wpdb->prefix . 'academia_matriculas';

        $result = $wpdb->delete($table_name, [
            'user_id'  => $user_id,
            'curso_id' => $course_id
        ]);

        if ($result) {
            return new WP_REST_Response(['message' => 'Matrícula eliminada.'], 200);
        }

        return new \WP_Error('delete_failed', 'No se encontró la matrícula.', ['status' => 404]);
    }

    /**
     * Get courses for a specific user
     */
    public function get_user_courses($request) {
        $user_id = $request['id'];
        global $wpdb;
        $table_name = $wpdb->prefix . 'academia_matriculas';

        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT curso_id, fecha_alta, estado, porcentaje FROM $table_name WHERE user_id = %d",
            $user_id
        ));

        $data = [];
        foreach ($results as $row) {
            $data[] = [
                'id'        => $row->curso_id,
                'title'     => get_the_title($row->curso_id),
                'date'      => $row->fecha_alta,
                'status'    => $row->estado,
                'progress'  => $row->porcentaje
            ];
        }

        return new WP_REST_Response($data, 200);
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
            'role__in' => ['subscriber', 'customer', 'student', 'subscriber'], 
            'search'   => $search ? '*' . $search . '*' : '',
        ];

        // If we have specific IDs from matriculas, merge them or prioritize
        // For simplicity, let's just get all users with student-like roles AND those in the table
        $users_by_role = new \WP_User_Query($args);
        $ids_by_role = $users_by_role->get_results();
        $ids_by_role = wp_list_pluck($ids_by_role, 'ID');

        $final_ids = array_unique(array_merge((array)$student_ids, $ids_by_role));

        if (empty($final_ids)) {
             return new WP_REST_Response([], 200);
        }

        $user_query = new \WP_User_Query(['include' => $final_ids, 'orderby' => 'ID', 'order' => 'DESC']);
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
