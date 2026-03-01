<?php

namespace AcademiaLms\PostTypes;

/**
 * Registra el Post Type de Lecciones.
 */
class Lecciones {

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
			'name'               => _x( 'Lecciones', 'post type general name', 'academia-lms' ),
			'singular_name'      => _x( 'Lección', 'post type singular name', 'academia-lms' ),
			'menu_name'          => _x( 'Lecciones', 'admin menu', 'academia-lms' ),
			'name_admin_bar'     => _x( 'Lección', 'add new on admin bar', 'academia-lms' ),
			'add_new'            => _x( 'Añadir Nueva', 'leccion', 'academia-lms' ),
			'add_new_item'       => __( 'Añadir Nueva Lección', 'academia-lms' ),
			'new_item'           => __( 'Nueva Lección', 'academia-lms' ),
			'edit_item'          => __( 'Editar Lección', 'academia-lms' ),
			'view_item'          => __( 'Ver Lección', 'academia-lms' ),
			'all_items'          => __( 'Lecciones', 'academia-lms' ),
			'search_items'       => __( 'Buscar Lecciones', 'academia-lms' ),
			'not_found'          => __( 'No se encontraron lecciones.', 'academia-lms' ),
			'not_found_in_trash' => __( 'No se encontraron lecciones en la papelera.', 'academia-lms' )
		];

		$args = [
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => 'edit.php?post_type=academia_curso', // Submenú bajo Cursos
			'query_var'          => true,
			'rewrite'            => [ 'slug' => 'leccion' ],
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => true,
			'supports'           => [ 'title', 'editor', 'author', 'thumbnail', 'comments' ],
			'show_in_rest'       => true,
		];

		register_post_type( 'academia_leccion', $args );
	}
}
