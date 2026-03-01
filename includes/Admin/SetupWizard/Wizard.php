<?php

namespace AcademiaLms\Admin\SetupWizard;

/**
 * Handle the LMS configuration onboarding wizard.
 */
class Wizard {

	/**
	 * Init the class.
	 */
	public static function init() {
		add_action( 'admin_menu', [ __CLASS__, 'add_wizard_page' ] );
		add_action( 'admin_init', [ __CLASS__, 'setup_wizard_redirect' ] );
		add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_styles' ] );
	}

	/**
	 * Redirect to the wizard after plugin activation.
	 */
	public static function setup_wizard_redirect() {
		if ( get_transient( 'academia_lms_activation_redirect' ) ) {
			delete_transient( 'academia_lms_activation_redirect' );

			// Only redirect if no other massive activation is happening
			if ( ! isset( $_GET['activate-multi'] ) && current_user_can( 'manage_options' ) ) {
				wp_safe_redirect( admin_url( 'admin.php?page=academia-setup' ) );
				exit;
			}
		}

		// Handle step submissions
		if ( isset( $_POST['academia_setup_step'] ) && isset( $_POST['academia_setup_nonce'] ) ) {
			if ( wp_verify_nonce( $_POST['academia_setup_nonce'], 'academia_setup_action' ) ) {
				self::handle_step_save( sanitize_text_field( wp_unslash( $_POST['academia_setup_step'] ) ) );
			}
		}
	}

	/**
	 * Enqueue CSS only on the wizard page.
	 */
	public static function enqueue_styles( $hook ) {
		if ( 'admin_page_academia-setup' !== $hook ) {
			return;
		}

		wp_enqueue_style(
			'academia-setup-wizard',
			ACADEMIA_LMS_URL . 'assets/admin/css/setup-wizard.css',
			[],
			ACADEMIA_LMS_VERSION
		);
	}

	/**
	 * Register the invisible page for the wizard.
	 */
	public static function add_wizard_page() {
		// Use a hidden page (null parent) so it doesn't clutter the menu.
		add_submenu_page(
			null,
			__( 'Asistente de Configuración - Academia LMS', 'academia-lms' ),
			__( 'Asistente', 'academia-lms' ),
			'manage_options',
			'academia-setup',
			[ __CLASS__, 'render_wizard' ]
		);
	}

	/**
	 * Handle saving data between steps and redirecting to the next one.
	 */
	private static function handle_step_save( $step ) {
		switch ( $step ) {
			case 'welcome':
				// Guardar opciones del primer paso si hubiese
                update_option('academia_setup_complete_step1', true);
				$next_step = 'business_type';
				break;
			case 'business_type':
				if(isset($_POST['business_type_option'])) {
					update_option('academia_business_model', sanitize_text_field($_POST['business_type_option']));
				}
				$next_step = 'settings';
				break;
			case 'settings':
				$load_font = isset($_POST['load_font']) ? 1 : 0;
				$enable_login = isset($_POST['enable_login']) ? 1 : 0;
				update_option('academia_load_font', $load_font);
				update_option('academia_enable_custom_login', $enable_login);
				
				$next_step = 'roles';
				break;
			case 'roles':
				$public_profile = isset($_POST['public_profile']) ? 1 : 0;
				$allow_publishing = isset($_POST['allow_publishing']) ? 1 : 0;
				$allow_upload = isset($_POST['allow_upload']) ? 1 : 0;
				
				update_option('academia_instructor_public_profile', $public_profile);
				update_option('academia_instructor_publish', $allow_publishing);
				update_option('academia_student_uploads', $allow_upload);
				
				// Wizard Complete
				update_option('academia_setup_completed', true);
				wp_safe_redirect( admin_url( 'admin.php?page=academia-lms' ) );
				exit;
		}

		wp_safe_redirect( admin_url( 'admin.php?page=academia-setup&step=' . $next_step ) );
		exit;
	}

	/**
	 * Render the Wizard HTML UI.
	 */
	public static function render_wizard() {
		$step = isset( $_GET['step'] ) ? sanitize_text_field( $_GET['step'] ) : 'welcome';
        
        $steps = [
            'welcome' => 'Welcome',
            'business_type' => 'Business Type',
            'settings' => 'General Settings',
            'roles' => 'Role Management',
        ];

		// Include the template
		$template_path = ACADEMIA_LMS_PATH . 'includes/Admin/SetupWizard/views/' . $step . '.php';
		
		?>
		<div class="academia-setup-wrap">
			<!-- Header -->
			<div class="academia-setup-header">
				<div class="logo">
					<h2>🎓 Academia LMS</h2>
				</div>
                <?php if($step !== 'welcome'): ?>
                <div class="setup-breadcrumbs">
                    <ul>
                        <?php 
                        $i = 1;
                        foreach($steps as $slug => $label) {
                            if($slug === 'welcome') continue;
                            $class = ($slug === $step) ? 'active' : '';
                            echo "<li class='{$class}'><span class='step-num'>{$i}</span> {$label}</li>";
                            $i++;
                        }
                        ?>
                    </ul>
                </div>
                <div class="setup-close">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=academia-lms')); ?>">×</a>
                </div>
                <?php endif; ?>
			</div>

			<!-- Main Content Area -->
			<div class="academia-setup-content">
				<?php
				if ( file_exists( $template_path ) ) {
					include $template_path;
				} else {
					echo '<h3>Paso no encontrado.</h3>';
				}
				?>
			</div>
		</div>
		<?php
	}
}
