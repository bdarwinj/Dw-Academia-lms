<?php

namespace AcademiaLms\API;

/**
 * Base custom REST API Controller for Academia LMS
 */
class Base {

	/**
	 * Namespace for REST API
	 */
	const NAMESPACE = 'academia-lms/v1';

	/**
	 * Init the class.
	 */
	public static function init() {
		add_action( 'rest_api_init', [ __CLASS__, 'registrar_rutas_base' ] );
	}

	/**
	 * Register base routes.
	 */
	public static function registrar_rutas_base() {
		register_rest_route( self::NAMESPACE, '/status', [
			'methods'             => \WP_REST_Server::READABLE,
			'callback'            => [ __CLASS__, 'get_status' ],
			'permission_callback' => '__return_true',
		] );
	}

	/**
	 * Return API health status.
	 */
	public static function get_status( \WP_REST_Request $request ) {
		return rest_ensure_response( [
			'status'  => 'success',
			'message' => 'Academia LMS API is running!',
			'version' => ACADEMIA_LMS_VERSION
		] );
	}
}
