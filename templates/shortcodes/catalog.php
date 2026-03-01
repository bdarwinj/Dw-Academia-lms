<?php
/**
 * Shortcode Template: Course Catalog
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Ensure we have the query object
if ( ! isset( $courses_query ) || ! $courses_query instanceof \WP_Query ) {
	return;
}
?>
<div class="academia-catalog-container">
	<header class="academia-catalog-header">
		<h2><?php echo esc_html( $atts['title'] ); ?></h2>
		<p>Explora nuestra oferta educativa y comienza a aprender hoy mismo.</p>
	</header>

	<?php if ( $courses_query->have_posts() ) : ?>
		<div class="academia-catalog-grid">
			<?php while ( $courses_query->have_posts() ) : $courses_query->the_post(); ?>
				<div class="academia-catalog-card">
					<div class="catalog-thumbnail">
						<?php if ( has_post_thumbnail() ) : ?>
							<?php the_post_thumbnail( 'medium' ); ?>
						<?php else : ?>
							<img src="https://via.placeholder.com/300x160/e2e4e7/586069?text=Sin+Imagen" alt="<?php the_title_attribute(); ?>">
						<?php endif; ?>
					</div>
					<div class="catalog-info">
						<h3 class="catalog-title"><?php the_title(); ?></h3>
						<div class="catalog-excerpt">
							<?php echo wp_trim_words( get_the_excerpt(), 15, '...' ); ?>
						</div>
						<div class="catalog-actions">
							<!-- En el futuro esto redirigirá al producto de WooCommerce si tiene precio -->
							<a href="<?php the_permalink(); ?>" class="button btn-view-course">Ver Detalles</a>
						</div>
					</div>
				</div>
			<?php endwhile; ?>
		</div>
	<?php else : ?>
		<div class="academia-notice info">
			<p>Aún no hay cursos publicados en el catálogo.</p>
		</div>
	<?php endif; ?>
</div>
