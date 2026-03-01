<?php

namespace AcademiaLms\Core;

/**
 * Main plugin core class.
 * Uses the Singleton pattern.
 */
class Plugin {

	/**
	 * The single instance of the class.
	 *
	 * @var Plugin|null
	 */
	private static $instance = null;

	/**
	 * Main Plugin Instance.
	 *
	 * Ensures only one instance is loaded or can be loaded.
	 *
	 * @return Plugin
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		// Define hooks here or load controllers.
	}

	/**
	 * Initialize the plugin.
	 */
	public function run() {
		// Example: register text domain
		add_action( 'plugins_loaded', [ $this, 'load_textdomain' ] );

		// Inicializar Custom Post Types
		\AcademiaLms\PostTypes\Cursos::init();
		\AcademiaLms\PostTypes\Lecciones::init();
		\AcademiaLms\PostTypes\Cuestionarios::init();

		// Inicializar API REST Básico
		\AcademiaLms\API\Base::init();

		// Inicializar Panel de Administración
		if ( is_admin() ) {
			\AcademiaLms\Admin\Menu::init();
		}

		// Registrar Hook de Activación (Migraciones DB)
		register_activation_hook( ACADEMIA_LMS_FILE, [ '\AcademiaLms\Database\Migrations', 'init' ] );
	}

	/**
	 * Load text domain for translation.
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'academia-lms',
			false,
			dirname( plugin_basename( ACADEMIA_LMS_FILE ) ) . '/languages'
		);
	}
}
