<?php

namespace AcademiaLms\PostTypes;

/**
 * Registra el Post Type de Cuestionarios.
 */
class Cuestionarios {

	/**
	 * Init the class.
	 */
	public static function init() {
		add_action( 'init', [ __CLASS__, 'registrar_post_type' ] );
	}

	/**
	 * Registrar CPT.
	 */
	public static function registrar_post_type() {
		$labels = [
			'name'               => _x( 'Cuestionarios', 'post type general name', 'academia-lms' ),
			'singular_name'      => _x( 'Cuestionario', 'post type singular name', 'academia-lms' ),
			'menu_name'          => _x( 'Cuestionarios', 'admin menu', 'academia-lms' ),
			'name_admin_bar'     => _x( 'Cuestionario', 'add new on admin bar', 'academia-lms' ),
			'add_new'            => _x( 'Añadir Nuevo', 'cuestionario', 'academia-lms' ),
			'add_new_item'       => __( 'Añadir Nuevo Cuestionario', 'academia-lms' ),
			'new_item'           => __( 'Nuevo Cuestionario', 'academia-lms' ),
			'edit_item'          => __( 'Editar Cuestionario', 'academia-lms' ),
			'view_item'          => __( 'Ver Cuestionario', 'academia-lms' ),
			'all_items'          => __( 'Cuestionarios', 'academia-lms' ),
			'search_items'       => __( 'Buscar Cuestionarios', 'academia-lms' ),
			'not_found'          => __( 'No se encontraron cuestionarios.', 'academia-lms' ),
			'not_found_in_trash' => __( 'No se encontraron cuestionarios en la papelera.', 'academia-lms' )
		];

		$args = [
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => 'edit.php?post_type=academia_curso', // Submenú bajo Cursos
			'query_var'          => true,
			'rewrite'            => [ 'slug' => 'cuestionario' ],
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => false,
			'supports'           => [ 'title', 'editor', 'author' ], // Cuestionarios usualmente no llevan la misma estructura visual
			'show_in_rest'       => true,
		];

		register_post_type( 'academia_quiz', $args );
	}
}
