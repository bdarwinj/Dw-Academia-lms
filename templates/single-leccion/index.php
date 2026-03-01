<?php
/**
 * The template for displaying a single Lesson (Learn Page / Aula Virtual).
 *
 * This layout is completely distraction-free, ignoring the active WordPress theme's header/footer.
 */

// Basic security check
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Get lesson info
$lesson_id = get_the_ID();
$lesson = get_post( $lesson_id );

// Get video meta
$video_source   = get_post_meta( $lesson_id, '_academia_video_source', true );
$video_url      = get_post_meta( $lesson_id, '_academia_video_url', true );
$video_duration = get_post_meta( $lesson_id, '_academia_video_duration', true );

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<?php wp_head(); /* We keep wp_head so styles and scripts load, but no theme HTML */ ?>
</head>
<body <?php body_class('academia-learn-page-body'); ?>>

<div class="academia-learn-container">
	
	<!-- Sidebar: Course Navigation -->
	<aside class="academia-learn-sidebar">
		<div class="sidebar-header">
			<a href="<?php echo home_url('/'); ?>" class="back-to-site">&larr; Volver al sitio</a>
			<h2 class="course-title">Temario del Curso</h2>
		</div>
		
		<div class="sidebar-curriculum">
			<!-- Todo: Parse _academia_builder_layout metadata to show sections dynamically. 
			     Static layout for Phase 3.1 baseline.
			-->
			<div class="curriculum-section">
				<h3 class="section-title">Sección 1: Introducción</h3>
				<ul class="section-lessons">
					<li class="active"><span class="status-icon">▶</span> <?php echo esc_html( $lesson->post_title ); ?></li>
					<li><span class="status-icon">○</span> Lección Siguiente</li>
				</ul>
			</div>
		</div>
	</aside>

	<!-- Main Content Area: Video & Text -->
	<main class="academia-learn-main">
		
		<!-- Video Player Canvas -->
		<div class="video-container">
			<?php if ( ! empty( $video_url ) && 'youtube' === $video_source ) : ?>
				<?php 
					// Simple YouTube URL parser for embed (basic version)
					preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/\s]{11})%i', $video_url, $match);
					$youtube_id = isset($match[1]) ? $match[1] : '';
				?>
				<?php if ( $youtube_id ) : ?>
					<iframe width="100%" height="100%" src="https://www.youtube.com/embed/<?php echo esc_attr( $youtube_id ); ?>" frameborder="0" allowfullscreen></iframe>
				<?php else: ?>
					<div class="video-placeholder">La URL de YouTube no es válida.</div>
				<?php endif; ?>
			<?php elseif ( ! empty( $video_url ) && 'html5' === $video_source ) : ?>
				<video width="100%" height="100%" controls>
				  <source src="<?php echo esc_url( $video_url ); ?>" type="video/mp4">
				  Tu navegador no soporta video HTML5.
				</video>
			<?php else : ?>
				<div class="video-placeholder">No se ha asignado un video a esta lección.</div>
			<?php endif; ?>
		</div>

		<!-- Lesson Text/Gutenberg Content -->
		<div class="lesson-content-wrapper">
			<header class="lesson-header">
				<h1 class="lesson-title"><?php echo esc_html( $lesson->post_title ); ?></h1>
				<button class="btn-complete-lesson">Marcar como Completada</button>
			</header>

			<div class="lesson-text-body">
				<?php
					// Loop over WP functionality to process Gutenberg blocks safely
					while ( have_posts() ) :
						the_post();
						the_content();
					endwhile;
				?>
			</div>
		</div>
		
	</main>

</div>

<?php wp_footer(); /* Keep wp_footer for admin bar and scripts */ ?>
</body>
</html>
