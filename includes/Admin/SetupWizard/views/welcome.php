<?php
if ( ! defined( 'ABSPATH' ) ) { exit; } ?>

<div class="setup-view-welcome">
	<div class="welcome-hero">
		<h1>Welcome to Academy LMS!</h1>
		<p>From Single Instructor to massive learning platforms, Academy LMS evolves with you to develop your dream eLearning website.</p>
	</div>

	<!-- Decorative feature grid based on screenshot -->
	<div class="welcome-features-grid">
		<div class="feature-tag"><span>🔒</span> Security</div>
		<div class="feature-tag"><span>🧩</span> Add-ons</div>
		<div class="feature-tag"><span>🔄</span> Native Ecosystem</div>
		<div class="feature-tag"><span>🎓</span> Certificate</div>
		<div class="feature-tag"><span>💧</span> Content Drip</div>
		<div class="feature-tag"><span>👥</span> Organization Team</div>
		<div class="feature-tag"><span>🤖</span> AI Course Creation</div>
		<div class="feature-tag"><span>🔗</span> Integration</div>
		<div class="feature-tag"><span>🛠️</span> Form Builder</div>
	</div>

	<div class="setup-actions center-actions">
		<p class="terms-text">By proceeding, you consent to this plugin collecting your information. <a href="#">What We Collect?</a></p>
		
		<form method="post" action="<?php echo esc_url( admin_url( 'admin.php?page=academia-setup' ) ); ?>">
			<?php wp_nonce_field( 'academia_setup_action', 'academia_setup_nonce' ); ?>
			<input type="hidden" name="academia_setup_step" value="welcome">
			<button type="submit" class="button-primary setup-btn">Proceed To Next Step &rarr;</button>
		</form>
		
		<div class="skip-step">
			<a href="<?php echo esc_url( admin_url( 'admin.php?page=academia-lms' ) ); ?>">Skip this step</a>
		</div>
	</div>
</div>
