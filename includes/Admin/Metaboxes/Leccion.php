<?php

namespace AcademiaLms\Admin\Metaboxes;

/**
 * Handle custom fields for Lessons (Video Source, Duration, etc.)
 */
class Leccion {

	/**
	 * Init the class.
	 */
	public static function init() {
		add_action( 'add_meta_boxes', [ __CLASS__, 'add_meta_box' ] );
		add_action( 'save_post', [ __CLASS__, 'save_meta_box_data' ] );
	}

	/**
	 * Add the meta box for video settings.
	 */
	public static function add_meta_box() {
		add_meta_box(
			'academia_leccion_video_meta',
			__( 'Configuraciones de Video', 'academia-lms' ),
			[ __CLASS__, 'render_meta_box_content' ],
			'academia_leccion',
			'normal',
			'high'
		);
	}

	/**
	 * Render the HTML for the meta box.
	 *
	 * @param \WP_Post $post
	 */
	public static function render_meta_box_content( $post ) {
		// Add a nonce field so we can check for it later.
		wp_nonce_field( 'academia_leccion_video_meta_box', 'academia_leccion_video_meta_box_nonce' );

		// Retrieve existing values.
		$video_source = get_post_meta( $post->ID, '_academia_video_source', true );
		$video_url    = get_post_meta( $post->ID, '_academia_video_url', true );
		$video_time   = get_post_meta( $post->ID, '_academia_video_duration', true );

		if ( empty( $video_source ) ) {
			$video_source = 'youtube';
		}

		?>
		<style>
			.acad_meta_wrapper { padding: 10px 0; }
			.acad_meta_field { margin-bottom: 15px; }
			.acad_meta_field label { font-weight: 600; display: block; margin-bottom: 5px; }
			.acad_meta_field input[type=text], .acad_meta_field select { width: 100%; max-width: 400px; }
		</style>
		<div class="acad_meta_wrapper">
			<div class="acad_meta_field">
				<label for="academia_video_source"><?php esc_html_e( 'Fuente de Video', 'academia-lms' ); ?></label>
				<select name="academia_video_source" id="academia_video_source">
					<option value="youtube" <?php selected( $video_source, 'youtube' ); ?>>YouTube</option>
					<option value="vimeo" <?php selected( $video_source, 'vimeo' ); ?>>Vimeo</option>
					<option value="html5" <?php selected( $video_source, 'html5' ); ?>>HTML5 (MP4)</option>
				</select>
			</div>

			<div class="acad_meta_field">
				<label for="academia_video_url"><?php esc_html_e( 'URL del Video', 'academia-lms' ); ?></label>
				<input type="text" id="academia_video_url" name="academia_video_url" value="<?php echo esc_attr( $video_url ); ?>" placeholder="https://..." />
			</div>

			<div class="acad_meta_field">
				<label for="academia_video_duration"><?php esc_html_e( 'Duración (ej. 10:30)', 'academia-lms' ); ?></label>
				<input type="text" id="academia_video_duration" name="academia_video_duration" value="<?php echo esc_attr( $video_time ); ?>" placeholder="00:00" />
			</div>
		</div>
		<?php
	}

	/**
	 * Save the meta box data.
	 *
	 * @param int $post_id
	 */
	public static function save_meta_box_data( $post_id ) {
		// Verify nonce.
		if ( ! isset( $_POST['academia_leccion_video_meta_box_nonce'] ) ) {
			return;
		}
		if ( ! wp_verify_nonce( $_POST['academia_leccion_video_meta_box_nonce'], 'academia_leccion_video_meta_box' ) ) {
			return;
		}
		// Prevent auto save.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		// Check permissions.
		if ( isset( $_POST['post_type'] ) && 'academia_leccion' === $_POST['post_type'] ) {
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return;
			}
		}

		// Sanitize inputs and save.
		if ( isset( $_POST['academia_video_source'] ) ) {
			update_post_meta( $post_id, '_academia_video_source', sanitize_text_field( $_POST['academia_video_source'] ) );
		}
		if ( isset( $_POST['academia_video_url'] ) ) {
			update_post_meta( $post_id, '_academia_video_url', esc_url_raw( $_POST['academia_video_url'] ) );
		}
		if ( isset( $_POST['academia_video_duration'] ) ) {
			update_post_meta( $post_id, '_academia_video_duration', sanitize_text_field( $_POST['academia_video_duration'] ) );
		}
	}
}
