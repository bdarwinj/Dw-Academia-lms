<?php

namespace AcademiaLms\Integrations;

/**
 * Handle WooCommerce integration for selling courses.
 */
class WooCommerce {

	/**
	 * Init the class.
	 */
	public static function init() {
		// Only run if WooCommerce is active
		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}

		// Add Course selection metabox to WooCommerce Products
		add_action( 'add_meta_boxes', [ __CLASS__, 'add_product_course_metabox' ] );
		add_action( 'save_post', [ __CLASS__, 'save_product_course_meta' ] );

		// Hook into order completion to auto-enroll students
		add_action( 'woocommerce_order_status_completed', [ __CLASS__, 'auto_enroll_student_on_purchase' ], 10, 2 );
	}

	/**
	 * Add custom meta box to WooCommerce product edit screen.
	 */
	public static function add_product_course_metabox() {
		add_meta_box(
			'academia_product_course',
			__( 'Asignar a Curso (Academia LMS)', 'academia-lms' ),
			[ __CLASS__, 'render_product_course_metabox' ],
			'product',
			'side',
			'default'
		);
	}

	/**
	 * Render the metabox content.
	 *
	 * @param \WP_Post $post
	 */
	public static function render_product_course_metabox( $post ) {
		wp_nonce_field( 'academia_lms_woo_course', 'academia_lms_woo_course_nonce' );

		$linked_course_id = get_post_meta( $post->ID, '_academia_linked_course_id', true );

		// Get all published courses
		$courses = get_posts( [
			'post_type'      => 'academia_curso',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
		] );

		?>
		<p>
			<label for="academia_linked_course_id"><strong><?php esc_html_e( 'Selecciona el curso a vender con este producto:', 'academia-lms' ); ?></strong></label>
			<br><br>
			<select name="academia_linked_course_id" id="academia_linked_course_id" style="width: 100%;">
				<option value=""><?php esc_html_e( '-- Ninguno (Producto Normal) --', 'academia-lms' ); ?></option>
				<?php foreach ( $courses as $course ) : ?>
					<option value="<?php echo esc_attr( $course->ID ); ?>" <?php selected( $linked_course_id, $course->ID ); ?>>
						<?php echo esc_html( $course->post_title ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</p>
		<p class="description">Al comprar este producto, el usuario se matriculará automáticamente en el curso seleccionado.</p>
		<?php
	}

	/**
	 * Save the metabox data.
	 *
	 * @param int $post_id
	 */
	public static function save_product_course_meta( $post_id ) {
		if ( ! isset( $_POST['academia_lms_woo_course_nonce'] ) || ! wp_verify_nonce( $_POST['academia_lms_woo_course_nonce'], 'academia_lms_woo_course' ) ) {
			return;
		}

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		if ( isset( $_POST['post_type'] ) && 'product' === $_POST['post_type'] ) {
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return;
			}
		}

		if ( isset( $_POST['academia_linked_course_id'] ) ) {
			$course_id = sanitize_text_field( wp_unslash( $_POST['academia_linked_course_id'] ) );
			update_post_meta( $post_id, '_academia_linked_course_id', $course_id );
		}
	}

	/**
	 * Auto-enroll student when a WooCommerce order is marked as completed.
	 *
	 * @param int $order_id
	 * @param \WC_Order $order
	 */
	public static function auto_enroll_student_on_purchase( $order_id, $order ) {
		
		// Get the user ID who made the purchase
		$user_id = $order->get_user_id();

		// If it's a guest checkout, we can't enroll them unless we auto-create users (WooCommerce setting).
		if ( ! $user_id ) {
			// Podríamos registrar en log que se vendió un curso a un invitado.
			return;
		}

		// Loop through order items
		foreach ( $order->get_items() as $item_id => $item ) {
			// Ensure item is a product line item
			if ( is_callable( [ $item, 'get_product_id' ] ) ) {
				$product_id = $item->get_product_id();
			} else {
				$product_id = isset( $item['product_id'] ) ? $item['product_id'] : 0;
			}
			
			if ( ! $product_id ) {
				continue;
			}
			
			// Check if this product is linked to a course
			$linked_course_id = get_post_meta( $product_id, '_academia_linked_course_id', true );

			if ( ! empty( $linked_course_id ) ) {
				// Enroll the student in the custom DB table!
				self::enroll_student( $user_id, $linked_course_id, $order_id );
			}
		}
	}

	/**
	 * Insert enrollment record into academia_matriculas table.
	 * 
	 * @param int $user_id
	 * @param int $course_id
	 * @param int $order_id
	 */
	private static function enroll_student( $user_id, $course_id, $order_id ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'academia_matriculas';

		// Check if already enrolled
		$exists = $wpdb->get_var( $wpdb->prepare(
			"SELECT id FROM $table_name WHERE user_id = %d AND curso_id = %d",
			$user_id,
			$course_id
		) );

		if ( ! $exists ) {
			// Insert new enrollment
			$wpdb->insert(
				$table_name,
				[
					'user_id'          => $user_id,
					'curso_id'         => $course_id,
					'fecha_inscripcion'=> current_time( 'mysql' ),
					'estado'           => 'activo',
					'nivel_acceso'     => 'estudiante'
				],
				[ '%d', '%d', '%s', '%s', '%s' ]
			);

			// Optional: Update user meta to cache total courses, or log the order ID
			add_user_meta( $user_id, '_academia_enrolled_course_' . $course_id, $order_id, true );
		}
	}
}
