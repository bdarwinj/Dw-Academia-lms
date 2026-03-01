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
		add_shortcode( 'academia_courses', [ __CLASS__, 'render_catalogo' ] );
		
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
	 * Render the Course Catalog shortcode.
	 *
	 * @param array $atts
	 * @return string
	 */
	public static function render_catalogo( $atts ) {
		$atts = shortcode_atts( [
			'title' => __( 'Catálogo de Cursos', 'academia-lms' ),
			'posts_per_page' => 9
		], $atts, 'academia_courses' );

		// Query courses
		$query_args = [
			'post_type'      => 'academia_curso',
			'post_status'    => 'publish',
			'posts_per_page' => intval( $atts['posts_per_page'] ),
		];
		
		$courses_query = new \WP_Query( $query_args );

		ob_start();
		
		$template_path = ACADEMIA_LMS_PATH . 'templates/shortcodes/catalog.php';
		
		if ( file_exists( $template_path ) ) {
			// Pasamos las variables a la plantilla
			include $template_path;
		} else {
			echo '<p>Error: Plantilla del catálogo no encontrada.</p>';
		}
		
		wp_reset_postdata();

		return ob_get_clean();
	}

	/**
	 * Enqueue styles unconditionally if needed, or check post content.
	 */
	public static function enqueue_shortcode_assets() {
		global $post;
		
		if ( is_a( $post, 'WP_Post' ) ) {
			if ( has_shortcode( $post->post_content, 'academia_dashboard' ) ) {
				wp_enqueue_style(
					'academia-dashboard-style',
					ACADEMIA_LMS_URL . 'assets/frontend/css/dashboard.css',
					[],
					ACADEMIA_LMS_VERSION
				);
			}

			if ( has_shortcode( $post->post_content, 'academia_courses' ) ) {
				wp_enqueue_style(
					'academia-catalog-style',
					ACADEMIA_LMS_URL . 'assets/frontend/css/catalog.css',
					[],
					ACADEMIA_LMS_VERSION
				);
			}
		}
	}
}
