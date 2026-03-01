<?php

namespace AcademiaLms\Admin;

/**
 * Handle the Admin Menu and React SPA Enqueues
 */
class Menu {

	/**
	 * Init the class.
	 */
	public static function init() {
		add_action( 'admin_menu', [ __CLASS__, 'registrar_menu' ] );
		add_action( 'admin_enqueue_scripts', [ __CLASS__, 'cargar_scripts_react' ] );
	}

	/**
	 * Register the main admin menu.
	 */
	public static function registrar_menu() {
		add_menu_page(
			__( 'Academia LMS', 'academia-lms' ),
			__( 'Academia LMS', 'academia-lms' ),
			'manage_options',
			'academia-lms',
			[ __CLASS__, 'render_app_container' ],
			'dashicons-welcome-learn-more',
			29
		);
	}

	/**
	 * Render the div container where React will mount.
	 */
	public static function render_app_container() {
		echo '<div id="academia-lms-react-app"></div>';
	}

	/**
	 * Enqueue React build scripts.
	 */
	public static function cargar_scripts_react( $hook ) {
		// Solo cargar scripts en nuestra página principal del plugin
		if ( 'toplevel_page_academia-lms' !== $hook ) {
			return;
		}

		// En un entorno de producción leemos el JS compilado
		// Por simplicidad en este paso, registramos el JS hardcodeado de Vite build 
		// (Idealmente se leería del manifest.json)
		$js_url_dev = ACADEMIA_LMS_URL . 'assets/admin/js/main.js';
		$css_url_dev = ACADEMIA_LMS_URL . 'assets/admin/css/main.css';

		wp_enqueue_style( 'academia-spa-style', $css_url_dev, [], ACADEMIA_LMS_VERSION );
		wp_enqueue_script( 'academia-spa-script', $js_url_dev, ['wp-element'], ACADEMIA_LMS_VERSION, true );
		
		// Setup local variables for React to use
		wp_localize_script( 'academia-spa-script', 'academiaLmsData', [
			'root'  => esc_url_raw( rest_url() ),
			'nonce' => wp_create_nonce( 'wp_rest' ),
		] );
	}
}
