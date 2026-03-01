<?php

namespace AcademiaLms\Frontend;

/**
 * Intercepts default WordPress template loading to inject LMS custom templates.
 */
class TemplateLoader {

	/**
	 * Init the class.
	 */
	public static function init() {
		// Intercept single post templates
		add_filter( 'template_include', [ __CLASS__, 'load_lms_templates' ], 99 );

		// Enqueue frontend scripts
		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_frontend_assets' ] );
	}

	/**
	 * Override the default template if viewing an LMS CPT.
	 *
	 * @param string $template The path of the template to include.
	 * @return string
	 */
	public static function load_lms_templates( $template ) {

		if ( is_singular( 'academia_leccion' ) ) {
			// Serve the distraction-free "Virtual Classroom" Learn Page
			$custom_template = ACADEMIA_LMS_PATH . 'templates/single-leccion/index.php';
			if ( file_exists( $custom_template ) ) {
				return $custom_template;
			}
		}

		if ( is_singular( 'academia_curso' ) ) {
			// Future: Course landing page
			$custom_template = ACADEMIA_LMS_PATH . 'templates/single-curso/index.php';
			if ( file_exists( $custom_template ) ) {
				return $custom_template;
			}
		}

		return $template;
	}

	/**
	 * Enqueue styles and scripts for the frontend.
	 */
	public static function enqueue_frontend_assets() {
		if ( is_singular( 'academia_leccion' ) ) {
			wp_enqueue_style(
				'academia-learn-page',
				ACADEMIA_LMS_URL . 'assets/frontend/css/learn-page.css',
				[],
				ACADEMIA_LMS_VERSION
			);
		}
	}
}
