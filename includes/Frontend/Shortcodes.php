<?php

namespace AcademiaLms\Frontend;

/**
 * Handle frontend shortcodes rendering.
 */
class Shortcodes {

	/**
	 * Init the class.
	 */
	public static function init() {
		add_shortcode( 'academia_dashboard', [ __CLASS__, 'render_dashboard' ] );
		
		add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_shortcode_assets' ] );
	}

	/**
	 * Render the Student Dashboard shortcode.
	 *
	 * @param array $atts
	 * @return string
	 */
	public static function render_dashboard( $atts ) {
		if ( ! is_user_logged_in() ) {
			return '<p>' . esc_html__( 'Debes iniciar sesión para ver tu panel de estudiante.', 'academia-lms' ) . '</p>';
		}

		// Parse attributes if we need them in the future
		$atts = shortcode_atts( [
			'title' => __( 'Mis Cursos', 'academia-lms' )
		], $atts, 'academia_dashboard' );

		// Render the template from an output buffer
		ob_start();
		
		$template_path = ACADEMIA_LMS_PATH . 'templates/shortcodes/dashboard.php';
		
		if ( file_exists( $template_path ) ) {
			include $template_path;
		} else {
			echo '<p>Error: Plantilla del dashboard no encontrada.</p>';
		}
		
		return ob_get_clean();
	}

	/**
	 * Enqueue styles unconditionally if needed, or check post content.
	 */
	public static function enqueue_shortcode_assets() {
		global $post;
		
		// Only load CSS if the shortcode is in the post
		if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'academia_dashboard' ) ) {
			wp_enqueue_style(
				'academia-dashboard-style',
				ACADEMIA_LMS_URL . 'assets/frontend/css/dashboard.css',
				[],
				ACADEMIA_LMS_VERSION
			);
		}
	}
}
