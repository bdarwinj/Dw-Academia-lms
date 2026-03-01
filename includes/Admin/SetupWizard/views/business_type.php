<?php
if ( ! defined( 'ABSPATH' ) ) { exit; } ?>

<div class="setup-view-step">
	<div class="step-header">
		<div class="icon-circle">💼</div>
		<h2>Choose Your Business Type</h2>
		<p>Select the model that best suits your eLearning journey.</p>
	</div>

	<form method="post" action="<?php echo esc_url( admin_url( 'admin.php?page=academia-setup' ) ); ?>" class="setup-form">
		<?php wp_nonce_field( 'academia_setup_action', 'academia_setup_nonce' ); ?>
		<input type="hidden" name="academia_setup_step" value="business_type">

		<div class="business-type-cards">
			<label class="biz-card active">
				<input type="radio" name="business_type_option" value="individual" checked>
				<div class="card-icon">👨‍🏫</div>
				<h3>Individual</h3>
				<p>Share your knowledge individually as a Single Instructor</p>
			</label>
			
			<label class="biz-card">
				<input type="radio" name="business_type_option" value="marketplace">
				<div class="card-icon">🏢</div>
				<h3>Marketplace</h3>
				<p>Enter the marketplace with your eLearning platform and let Instructors earn</p>
			</label>
		</div>

		<div class="setup-actions flex-actions">
			<a href="?page=academia-setup&step=welcome" class="btn-back">&larr; Back</a>
			<button type="submit" class="button-primary setup-btn">Next &rarr;</button>
		</div>
	</form>
</div>

<script>
	// Toggle active class on cards
	document.querySelectorAll('.biz-card').forEach(card => {
		card.addEventListener('click', function() {
			document.querySelectorAll('.biz-card').forEach(c => c.classList.remove('active'));
			this.classList.add('active');
		});
	});
</script>
