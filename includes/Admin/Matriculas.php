<?php

namespace AcademiaLms\Admin;

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Handle Enrollments (Matriculas) Admin view using WP_List_Table.
 */
class Matriculas_Table extends \WP_List_Table {

	public function __construct() {
		parent::__construct( [
			'singular' => __( 'Matrícula', 'academia-lms' ),
			'plural'   => __( 'Matrículas', 'academia-lms' ),
			'ajax'     => false
		] );
	}

	public function get_columns() {
		return [
			'cb'                => '<input type="checkbox" />',
			'user_id'           => __( 'Estudiante', 'academia-lms' ),
			'curso_id'          => __( 'Curso', 'academia-lms' ),
			'fecha_inscripcion' => __( 'Fecha de Inscripción', 'academia-lms' ),
			'estado'            => __( 'Estado', 'academia-lms' ),
		];
	}

	protected function column_default( $item, $column_name ) {
		switch ( $column_name ) {
			case 'fecha_inscripcion':
				return date_i18n( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), strtotime( $item['fecha_inscripcion'] ) );
			case 'estado':
				return ucfirst( esc_html( $item['estado'] ) );
			default:
				return print_r( $item, true );
		}
	}

	protected function column_cb( $item ) {
		return sprintf(
			'<input type="checkbox" name="matricula[]" value="%s" />', $item['id']
		);
	}

	protected function column_user_id( $item ) {
		$user = get_userdata( $item['user_id'] );
		$name = $user ? $user->display_name . ' (' . $user->user_login . ')' : __( 'Usuario Eliminado', 'academia-lms' );
		
		$actions = [
			'delete' => sprintf( '<a href="?page=%s&action=%s&matricula=%s">Eliminar</a>', esc_attr( $_REQUEST['page'] ), 'delete', absint( $item['id'] ) ),
		];
		
		return sprintf( '%1$s %2$s', $name, $this->row_actions( $actions ) );
	}

	protected function column_curso_id( $item ) {
		$course_title = get_the_title( $item['curso_id'] );
		return esc_html( $course_title ? $course_title : __( 'Curso Eliminado', 'academia-lms' ) );
	}

	public function prepare_items() {
		global $wpdb;

		$table_name = $wpdb->prefix . 'academia_matriculas';
		$per_page   = 20;

		$columns  = $this->get_columns();
		$hidden   = [];
		$sortable = [];

		$this->_column_headers = [ $columns, $hidden, $sortable ];

		$current_page = $this->get_pagenum();
		$offset       = ( $current_page - 1 ) * $per_page;

		$total_items = $wpdb->get_var( "SELECT COUNT(id) FROM $table_name" );

		// Process bulk/single action
		$this->process_bulk_action();

		$this->items = $wpdb->get_results( $wpdb->prepare(
			"SELECT * FROM $table_name ORDER BY id DESC LIMIT %d OFFSET %d",
			$per_page,
			$offset
		), ARRAY_A );

		$this->set_pagination_args( [
			'total_items' => $total_items,
			'per_page'    => $per_page,
			'total_pages' => ceil( $total_items / $per_page )
		] );
	}

	public function get_bulk_actions() {
		return [
			'delete' => __( 'Eliminar', 'academia-lms' )
		];
	}

	public function process_bulk_action() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'academia_matriculas';

		if ( 'delete' === $this->current_action() ) {
			$ids = isset( $_REQUEST['matricula'] ) ? (array) wp_unslash( $_REQUEST['matricula'] ) : [];
			
			if ( ! empty( $ids ) ) {
				$ids = array_map( 'absint', $ids );
				$placeholders = array_fill( 0, count( $ids ), '%d' );
				
				$wpdb->query( $wpdb->prepare(
					"DELETE FROM $table_name WHERE id IN (" . implode( ',', $placeholders ) . ")", 
					$ids
				) );
			}
		}
	}
}

/**
 * Handle the display and processing of the Enrollments page.
 */
class Matriculas {

	public static function init() {
		add_action( 'admin_menu', [ __CLASS__, 'add_submenu_page' ] );
		add_action( 'admin_init', [ __CLASS__, 'handle_manual_enrollment' ] );
	}

	public static function add_submenu_page() {
		add_submenu_page(
			'academia-lms',
			__( 'Matrículas', 'academia-lms' ),
			__( 'Matrículas', 'academia-lms' ),
			'manage_options',
			'academia-lms-matriculas',
			[ __CLASS__, 'render_page' ]
		);
	}

	public static function render_page() {
		$table = new Matriculas_Table();
		$table->prepare_items();
		?>
		<div class="wrap">
			<h1 class="wp-heading-inline"><?php esc_html_e( 'Gestión de Matrículas', 'academia-lms' ); ?></h1>
			<hr class="wp-header-end">

			<!-- Form to assign manually -->
			<div class="card" style="margin-top: 20px; max-width: 100%;">
				<h2><?php esc_html_e( 'Matricular Estudiante Manualmente', 'academia-lms' ); ?></h2>
				<form method="post" action="">
					<?php wp_nonce_field( 'academia_manual_enrollment', 'academia_enroll_nonce' ); ?>
					<table class="form-table">
						<tr>
							<th scope="row"><label for="user_id"><?php esc_html_e( 'Usuario:', 'academia-lms' ); ?></label></th>
							<td>
								<?php
								wp_dropdown_users( [
									'name'             => 'user_id',
									'id'               => 'user_id',
									'show_option_none' => __( '-- Selecciona un usuario --', 'academia-lms' )
								] );
								?>
							</td>
						</tr>
						<tr>
							<th scope="row"><label for="curso_id"><?php esc_html_e( 'Curso:', 'academia-lms' ); ?></label></th>
							<td>
								<select name="curso_id" id="curso_id">
									<option value=""><?php esc_html_e( '-- Selecciona un curso --', 'academia-lms' ); ?></option>
									<?php
									$courses = get_posts( [ 'post_type' => 'academia_curso', 'post_status' => 'publish', 'numberposts' => -1 ] );
									foreach ( $courses as $course ) {
										echo '<option value="' . esc_attr( $course->ID ) . '">' . esc_html( $course->post_title ) . '</option>';
									}
									?>
								</select>
							</td>
						</tr>
					</table>
					<?php submit_button( __( 'Matricular', 'academia-lms' ), 'primary', 'submit_enrollment' ); ?>
				</form>
			</div>

			<!-- Enrollments Table -->
			<form id="matriculas-filter" method="get">
				<input type="hidden" name="page" value="<?php echo esc_attr( $_REQUEST['page'] ); ?>" />
				<?php $table->display(); ?>
			</form>
		</div>
		<?php
	}

	public static function handle_manual_enrollment() {
		if ( ! isset( $_POST['submit_enrollment'] ) ) {
			return;
		}

		if ( ! isset( $_POST['academia_enroll_nonce'] ) || ! wp_verify_nonce( $_POST['academia_enroll_nonce'], 'academia_manual_enrollment' ) ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$user_id  = isset( $_POST['user_id'] ) ? absint( $_POST['user_id'] ) : 0;
		$curso_id = isset( $_POST['curso_id'] ) ? absint( $_POST['curso_id'] ) : 0;

		if ( $user_id && $curso_id ) {
			global $wpdb;
			$table_name = $wpdb->prefix . 'academia_matriculas';

			// Verify it doesn't already exist
			$exists = $wpdb->get_var( $wpdb->prepare(
				"SELECT id FROM $table_name WHERE user_id = %d AND curso_id = %d",
				$user_id,
				$curso_id
			) );

			if ( ! $exists ) {
				$wpdb->insert(
					$table_name,
					[
						'user_id'          => $user_id,
						'curso_id'         => $curso_id,
						'fecha_inscripcion'=> current_time( 'mysql' ),
						'estado'           => 'activo',
						'nivel_acceso'     => 'estudiante'
					],
					[ '%d', '%d', '%s', '%s', '%s' ]
				);
				add_action( 'admin_notices', function() {
					echo '<div class="notice notice-success is-dismissible"><p>Estudiante matriculado correctamente.</p></div>';
				} );
			} else {
				add_action( 'admin_notices', function() {
					echo '<div class="notice notice-warning is-dismissible"><p>El estudiante ya está matriculado en este curso.</p></div>';
				} );
			}
		}
	}
}
