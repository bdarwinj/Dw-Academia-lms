<?php

namespace AcademiaLms\Core\Rest;

use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Handle Administrative Tools for Academia LMS
 */
class ToolsController extends WP_REST_Controller {

    protected $namespace = 'academia-lms/v1';
    protected $rest_base = 'tools';

    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base . '/generate-pages', [
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'generate_pages'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);
        
        register_rest_route($this->namespace, '/' . $this->rest_base . '/check-pages', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'check_pages_status'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);
    }

    public function check_permissions() {
        return current_user_can('manage_options');
    }

    /**
     * Define the required pages and their shortcodes
     */
    private function get_required_pages() {
        return [
            'dashboard' => [
                'title'   => 'Dashboard Academia',
                'content' => '[academia_dashboard]',
                'option'  => 'academia_page_dashboard'
            ],
            'courses'   => [
                'title'   => 'Catálogo de Cursos',
                'content' => '[academia_courses]',
                'option'  => 'academia_page_courses'
            ],
        ];
    }

    /**
     * Check which pages already exist
     */
    public function check_pages_status($request) {
        $pages = $this->get_required_pages();
        $status = [];

        foreach ($pages as $key => $data) {
            $page_id = get_option($data['option']);
            $exists = false;
            
            if ($page_id) {
                $post = get_post($page_id);
                if ($post && $post->post_status !== 'trash') {
                    $exists = true;
                }
            }

            $status[] = [
                'id'     => $key,
                'title'  => $data['title'],
                'exists' => $exists,
                'page_id'=> $page_id ?: null
            ];
        }

        return rest_ensure_response($status);
    }

    /**
     * Create the missing pages
     */
    public function generate_pages($request) {
        $pages = $this->get_required_pages();
        $results = [];

        foreach ($pages as $key => $data) {
            $page_id = get_option($data['option']);
            $exists = false;

            if ($page_id) {
                $post = get_post($page_id);
                if ($post && $post->post_status !== 'trash') {
                    $exists = true;
                }
            }

            if (!$exists) {
                $new_page_id = wp_insert_post([
                    'post_title'   => $data['title'],
                    'post_content' => $data['content'],
                    'post_status'  => 'publish',
                    'post_type'    => 'page',
                ]);

                if (!is_wp_error($new_page_id)) {
                    update_option($data['option'], $new_page_id);
                    $results[] = [
                        'id'      => $key,
                        'title'   => $data['title'],
                        'status'  => 'created',
                        'page_id' => $new_page_id
                    ];
                } else {
                    $results[] = [
                        'id'     => $key,
                        'title'  => $data['title'],
                        'status' => 'error'
                    ];
                }
            } else {
                $results[] = [
                    'id'      => $key,
                    'title'   => $data['title'],
                    'status'  => 'already_exists',
                    'page_id' => $page_id
                ];
            }
        }

        return rest_ensure_response([
            'message' => 'Proceso de generación de páginas finalizado.',
            'details' => $results
        ]);
    }
}
