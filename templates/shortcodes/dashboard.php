<?php
/**
 * Shortcode Template: Student Dashboard
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$current_user = wp_get_current_user();
?>
<div class="academia-dashboard-container">
	<header class="academia-dashboard-header">
		<h2><?php echo esc_html( $atts['title'] ); ?></h2>
		<p>Bienvenido de vuelta, <strong><?php echo esc_html( $current_user->display_name ); ?></strong>.</p>
	</header>

	<div class="academia-course-grid">
		<!-- Dummy content for Phase 3.2 visualization -->
		<div class="academia-course-card">
			<div class="course-thumbnail">
				<img src="https://via.placeholder.com/300x160/2271b1/ffffff?text=Curso+Demostracion" alt="Curso Demo">
			</div>
			<div class="course-info">
				<h3 class="course-title">Master en React & WordPress</h3>
				<div class="course-progress-bar">
					<div class="progress-fill" style="width: 45%;"></div>
				</div>
				<p class="course-progress-text">45% Completado</p>
				<a href="#" class="button btn-continue-course">Continuar Estudio</a>
			</div>
		</div>

		<div class="academia-course-card">
			<div class="course-thumbnail">
				<img src="https://via.placeholder.com/300x160/2c974b/ffffff?text=Curso+Nuevo" alt="Curso Nuevo">
			</div>
			<div class="course-info">
				<h3 class="course-title">Fundamentos de PHP 8</h3>
				<div class="course-progress-bar">
					<div class="progress-fill" style="width: 0%;"></div>
				</div>
				<p class="course-progress-text">0% Completado</p>
				<a href="#" class="button btn-start-course">Comenzar Curso</a>
			</div>
		</div>
	</div>
</div>
