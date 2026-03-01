<?php

namespace AcademiaLms\PostTypes;

/**
 * Registra el Post Type de Cursos.
 */
class Cursos {

	/**
	 * Init the class.
	 */
	public static function init() {
		add_action( 'init', [ __CLASS__, 'registrar_post_type' ] );
		add_action( 'init', [ __CLASS__, 'registrar_taxonomia' ] );
	}

	/**
	 * Registrar Taxonomía de Categorías.
	 */
	public static function registrar_taxonomia() {
		$labels = [
			'name'              => _x( 'Categorías de Cursos', 'taxonomy general name', 'academia-lms' ),
			'singular_name'     => _x( 'Categoría de Curso', 'taxonomy singular name', 'academia-lms' ),
			'search_items'      => __( 'Buscar Categorías', 'academia-lms' ),
			'all_items'         => __( 'Todas las Categorías', 'academia-lms' ),
			'parent_item'       => __( 'Categoría Padre', 'academia-lms' ),
			'parent_item_colon' => __( 'Categoría Padre:', 'academia-lms' ),
			'edit_item'         => __( 'Editar Categoría', 'academia-lms' ),
			'update_item'       => __( 'Actualizar Categoría', 'academia-lms' ),
			'add_new_item'      => __( 'Añadir Nueva Categoría', 'academia-lms' ),
			'new_item_name'     => __( 'Nombre de la Nueva Categoría', 'academia-lms' ),
			'menu_name'         => __( 'Categorías', 'academia-lms' ),
		];

		$args = [
			'hierarchical'      => true,
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => [ 'slug' => 'categoria-curso' ],
			'show_in_rest'      => true,
		];

		register_taxonomy( 'academia_categoria', [ 'academia_curso' ], $args );
	}

	/**
	 * Registrar CPT.
	 */
	public static function registrar_post_type() {
		$labels = [
			'name'               => _x( 'Cursos', 'post type general name', 'academia-lms' ),
			'singular_name'      => _x( 'Curso', 'post type singular name', 'academia-lms' ),
			'menu_name'          => _x( 'Academia LMS', 'admin menu', 'academia-lms' ),
			'name_admin_bar'     => _x( 'Curso', 'add new on admin bar', 'academia-lms' ),
			'add_new'            => _x( 'Añadir Nuevo', 'curso', 'academia-lms' ),
			'add_new_item'       => __( 'Añadir Nuevo Curso', 'academia-lms' ),
			'new_item'           => __( 'Nuevo Curso', 'academia-lms' ),
			'edit_item'          => __( 'Editar Curso', 'academia-lms' ),
			'view_item'          => __( 'Ver Curso', 'academia-lms' ),
			'all_items'          => __( 'Todos los Cursos', 'academia-lms' ),
			'search_items'       => __( 'Buscar Cursos', 'academia-lms' ),
			'not_found'          => __( 'No se encontraron cursos.', 'academia-lms' ),
			'not_found_in_trash' => __( 'No se encontraron cursos en la papelera.', 'academia-lms' )
		];

		$args = [
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => [ 'slug' => 'cursos' ],
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => 30,
			'menu_icon'          => 'dashicons-welcome-learn-more',
			'supports'           => [ 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments' ],
			'show_in_rest'       => true, // Soporte para Gutenberg / API REST
		];

		register_post_type( 'academia_curso', $args );
	}
}
