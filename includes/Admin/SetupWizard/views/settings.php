<?php
if ( ! defined( 'ABSPATH' ) ) { exit; } ?>

<div class="setup-view-step">
	<div class="step-header">
		<div class="icon-circle">⚙️</div>
		<h2>General Settings</h2>
		<p>Configure basic settings for your platform.</p>
	</div>

	<form method="post" action="<?php echo esc_url( admin_url( 'admin.php?page=academia-setup' ) ); ?>" class="setup-form">
		<?php wp_nonce_field( 'academia_setup_action', 'academia_setup_nonce' ); ?>
		<input type="hidden" name="academia_setup_step" value="settings">

		<div class="settings-list">
			<div class="setting-row">
				<div class="setting-info">
					<h4>Dashboard Page</h4>
				</div>
				<div class="setting-control">
					<select name="dashboard_page">
						<option>Dashboard</option>
					</select>
				</div>
			</div>

			<div class="setting-row">
				<div class="setting-info">
					<h4>Load Academy LMS Font</h4>
					<p>If you want to apply your theme font with your theme's own style, then disable it.</p>
				</div>
				<div class="setting-control toggle-switch">
					<input type="checkbox" id="load_font" name="load_font" checked>
					<label for="load_font"></label>
				</div>
			</div>

			<div class="setting-row">
				<div class="setting-info">
					<h4>Enable Academy LMS Login</h4>
					<p>Switch to the academy login instead of the default WordPress login page.</p>
				</div>
				<div class="setting-control toggle-switch">
					<input type="checkbox" id="enable_login" name="enable_login" checked>
					<label for="enable_login"></label>
				</div>
			</div>
		</div>

		<div class="setup-actions flex-actions">
			<a href="?page=academia-setup&step=business_type" class="btn-back">&larr; Back</a>
			<div class="right-actions">
				<a href="?page=academia-setup&step=roles" class="btn-skip">Skip Step</a>
				<button type="submit" class="button-primary setup-btn">Next &rarr;</button>
			</div>
		</div>
	</form>
</div>
