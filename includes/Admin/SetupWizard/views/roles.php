<?php
if ( ! defined( 'ABSPATH' ) ) { exit; } ?>

<div class="setup-view-step">
	<div class="step-header">
		<div class="icon-circle">👥</div>
		<h2>Instructor & Student Role Management</h2>
		<p>Manage access and capabilities for instructors and students.</p>
	</div>

	<form method="post" action="<?php echo esc_url( admin_url( 'admin.php?page=academia-setup' ) ); ?>" class="setup-form">
		<?php wp_nonce_field( 'academia_setup_action', 'academia_setup_nonce' ); ?>
		<input type="hidden" name="academia_setup_step" value="roles">

		<div class="settings-list">
			<div class="setting-row">
				<div class="setting-info">
					<h4>Instructor Registration Page</h4>
				</div>
				<div class="setting-control">
					<select name="instructor_page">
						<option>Instructor Registration</option>
					</select>
				</div>
			</div>

			<div class="setting-row">
				<div class="setting-info">
					<h4>Public Profile</h4>
					<p>Enable Instructor Public Profile.</p>
				</div>
				<div class="setting-control toggle-switch">
					<input type="checkbox" id="public_profile" name="public_profile" checked>
					<label for="public_profile"></label>
				</div>
			</div>

			<div class="setting-row">
				<div class="setting-info">
					<h4>Allow Publishing Course</h4>
					<p>Enable instructors to publish courses directly.</p>
				</div>
				<div class="setting-control toggle-switch">
					<input type="checkbox" id="allow_publishing" name="allow_publishing">
					<label for="allow_publishing"></label>
				</div>
			</div>

			<hr style="margin:20px 0; border:none; border-top:1px solid #eaecef;">

			<div class="setting-row">
				<div class="setting-info">
					<h4>Student Registration Page</h4>
				</div>
				<div class="setting-control">
					<select name="student_page">
						<option>Student Registration</option>
					</select>
				</div>
			</div>

			<div class="setting-row">
				<div class="setting-info">
					<h4>Allow Upload Files</h4>
					<p>Enable student upload files.</p>
				</div>
				<div class="setting-control toggle-switch">
					<input type="checkbox" id="allow_upload" name="allow_upload" checked>
					<label for="allow_upload"></label>
				</div>
			</div>
		</div>

		<div class="setup-actions flex-actions">
			<a href="?page=academia-setup&step=settings" class="btn-back">&larr; Back</a>
			<div class="right-actions">
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=academia-lms' ) ); ?>" class="btn-skip">Skip Step</a>
				<button type="submit" class="button-primary setup-btn">Finish &rarr;</button>
			</div>
		</div>
	</form>
</div>
