<?php

namespace AcademiaLms\Core\Rest;

use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Handle Plugin Settings and Form Schemas
 */
class SettingsController extends WP_REST_Controller {

    protected $namespace = 'academia-lms/v1';
    protected $rest_base = 'settings';

    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base . '/registration-form', [
            [
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_registration_form'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'save_registration_form'],
                'permission_callback' => [$this, 'check_permissions'],
            ],
        ]);
    }

    public function check_permissions() {
        return current_user_can('manage_options');
    }

    /**
     * Get the registration form schema
     */
    public function get_registration_form($request) {
        $default_schema = [
            [
                'id'          => 'field_1',
                'type'        => 'text',
                'label'       => 'Nombre Completo',
                'placeholder' => 'Ej: Juan Pérez',
                'required'    => true
            ],
            [
                'id'          => 'field_2',
                'type'        => 'email',
                'label'       => 'Correo Electrónico',
                'placeholder' => 'juan@ejemplo.com',
                'required'    => true
            ],
            [
                'id'          => 'field_3',
                'type'        => 'tel',
                'label'       => 'Teléfono / WhatsApp',
                'placeholder' => '+57 300...',
                'required'    => false
            ]
        ];

        $schema = get_option('academia_registration_form_schema', $default_schema);
        return rest_ensure_response($schema);
    }

    /**
     * Save the registration form schema
     */
    public function save_registration_form($request) {
        $schema = $request->get_json_params();

        if (!is_array($schema)) {
            return new \WP_Error('invalid_data', 'El esquema debe ser un array válido.', ['status' => 400]);
        }

        update_option('academia_registration_form_schema', $schema);

        return rest_ensure_response([
            'message' => 'Esquema del formulario guardado correctamente.',
            'schema'  => $schema
        ]);
    }
}
