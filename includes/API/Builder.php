<?php

namespace AcademiaLms\API;

use WP_REST_Server;
use WP_REST_Request;

/**
 * Controller for saving the Course Builder layout content.
 */
class Builder {

	/**
	 * Init the class.
	 */
	public static function init() {
		add_action( 'rest_api_init', [ __CLASS__, 'registrar_rutas' ] );
	}

	/**
	 * Register routes.
	 */
	public static function registrar_rutas() {
		register_rest_route( Base::NAMESPACE, '/builder/save', [
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => [ __CLASS__, 'guardar_estructura' ],
			'permission_callback' => [ __CLASS__, 'check_permisos' ],
			'args'                => [
				'course_id' => [
					'required' => true,
					'type'     => 'integer',
				],
				'sections'  => [
					'required' => true,
					'type'     => 'object',
				],
				'order'     => [
					'required' => true,
					'type'     => 'array',
				]
			]
		] );
	}

	/**
	 * Check if user can manage courses.
	 */
	public static function check_permisos() {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Save the structured layout into the course metadata or relations.
	 * For now, we will serialize it as post_meta for testing Phase 2.1.
	 */
	public static function guardar_estructura( WP_REST_Request $request ) {
		$course_id = $request->get_param( 'course_id' );
		$sections  = $request->get_param( 'sections' );
		$order     = $request->get_param( 'order' );

		// En un entorno de producción, aquí iteraríamos para crear los posts (Lecciones/Secciones)
		// y asignaríamos el 'post_parent' al $course_id.
		// Para esta fase, guardaremos el layout serializado como meta para confirmar la funcionalidad del Builder.
		$builder_data = [
			'sections' => $sections,
			'order'    => $order
		];

		update_post_meta( $course_id, '_academia_builder_layout', $builder_data );

		return rest_ensure_response( [
			'status'  => 'success',
			'message' => 'Estructura del curso guardada correctamente.',
			'data'    => $builder_data
		] );
	}
}
