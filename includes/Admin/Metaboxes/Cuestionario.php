<?php

namespace AcademiaLms\Admin\Metaboxes;

/**
 * Handle custom fields for Quizzes (Questions, Options, Correct Answer).
 */
class Cuestionario {

	/**
	 * Init the class.
	 */
	public static function init() {
		add_action( 'add_meta_boxes', [ __CLASS__, 'add_meta_box' ] );
		add_action( 'save_post', [ __CLASS__, 'save_meta_box_data' ] );
	}

	/**
	 * Add the meta box for Quiz Questions.
	 */
	public static function add_meta_box() {
		add_meta_box(
			'academia_quiz_questions_meta',
			__( 'Gestor de Preguntas del Cuestionario', 'academia-lms' ),
			[ __CLASS__, 'render_meta_box_content' ],
			'academia_quiz',
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
		wp_nonce_field( 'academia_quiz_meta_box', 'academia_quiz_meta_box_nonce' );

		// Retrieve existing JSON questions string.
		$questions_json = get_post_meta( $post->ID, '_academia_quiz_questions', true );
		if ( empty( $questions_json ) ) {
			$questions_json = '[]';
		}

		?>
		<style>
			#academia-quiz-builder { margin-top: 15px; }
			.acad-question-card { background: #f9f9f9; border: 1px solid #ccd0d4; padding: 15px; margin-bottom: 15px; border-radius: 4px; position:relative; }
			.acad-question-card input[type="text"] { width: 100%; display: block; margin-bottom: 10px; }
			.acad-options-list { margin-top: 10px; margin-left: 15px; }
			.acad-option-item { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
			.acad-option-item input[type="text"] { flex: 1; margin: 0; }
			.acad-btn-remove { position: absolute; top: 10px; right: 10px; color: #d63638; cursor: pointer; text-decoration: none; }
			.acad-btn-remove:hover { color: #a12a2a; }
			.acad-add-question { margin-top: 15px; }
		</style>

		<div id="academia-quiz-builder">
			<div id="quiz-questions-container"></div>
			<button type="button" class="button button-primary acad-add-question" id="acad-add-que-btn">
				+ <?php esc_html_e( 'Añadir Nueva Pregunta', 'academia-lms' ); ?>
			</button>
			
			<!-- Hidden input to store serialized JSON payload -->
			<input type="hidden" name="academia_quiz_questions_payload" id="academia_quiz_questions_payload" value="<?php echo esc_attr( $questions_json ); ?>">
		</div>

		<script>
		jQuery(document).ready(function($) {
			let questions = [];
			try {
				questions = JSON.parse($('#academia_quiz_questions_payload').val());
			} catch(e) {
				questions = [];
			}

			if(!Array.isArray(questions)) questions = [];

			function renderQuestions() {
				const container = $('#quiz-questions-container');
				container.empty();

				questions.forEach((q, qIndex) => {
					let html = `
						<div class="acad-question-card" data-index="${qIndex}">
							<a href="#" class="acad-btn-remove acad-remove-question" title="Eliminar Pregunta">❌</a>
							<label><strong>Pregunta ${qIndex + 1}:</strong></label>
							<input type="text" class="acad-q-title" value="${q.title || ''}" placeholder="Ej. ¿Qué es React?..." />
							
							<div class="acad-options-list">
								<p><strong>Opciones de Respuesta:</strong> <small>(Selecciona el 🟢 para marcar la correcta)</small></p>
					`;

					for (let i = 0; i < 4; i++) {
						let isChecked = (q.correct_index == i) ? 'checked' : '';
						let optText = q.options && q.options[i] ? q.options[i] : '';
						html += `
							<div class="acad-option-item">
								<input type="radio" name="acad_correct_${qIndex}" class="acad-q-correct" value="${i}" ${isChecked} title="Marcar como correcta">
								<input type="text" class="acad-q-option" data-optindex="${i}" value="${optText}" placeholder="Opción ${i+1}">
							</div>
						`;
					}

					html += `
							</div>
						</div>
					`;

					container.append(html);
				});

				updatePayload();
			}

			function updatePayload() {
				$('#quiz-questions-container .acad-question-card').each(function(index) {
					const card = $(this);
					questions[index] = {
						title: card.find('.acad-q-title').val(),
						correct_index: card.find('.acad-q-correct:checked').val() || 0,
						options: []
					};

					card.find('.acad-q-option').each(function() {
						questions[index].options.push($(this).val());
					});
				});

				$('#academia_quiz_questions_payload').val(JSON.stringify(questions));
			}

			$('#acad-add-que-btn').on('click', function(e) {
				e.preventDefault();
				questions.push({ title: '', correct_index: 0, options: ['','','',''] });
				renderQuestions();
			});

			$(document).on('click', '.acad-remove-question', function(e) {
				e.preventDefault();
				const index = $(this).closest('.acad-question-card').data('index');
				questions.splice(index, 1);
				renderQuestions();
			});

			$(document).on('input change', '.acad-question-card input', function() {
				updatePayload();
			});

			renderQuestions(); // Initial render
		});
		</script>
		<?php
	}

	/**
	 * Save the meta box data.
	 *
	 * @param int $post_id
	 */
	public static function save_meta_box_data( $post_id ) {
		// Verify nonce.
		if ( ! isset( $_POST['academia_quiz_meta_box_nonce'] ) ) {
			return;
		}
		if ( ! wp_verify_nonce( $_POST['academia_quiz_meta_box_nonce'], 'academia_quiz_meta_box' ) ) {
			return;
		}
		// Prevent auto save.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		// Check permissions.
		if ( isset( $_POST['post_type'] ) && 'academia_quiz' === $_POST['post_type'] ) {
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return;
			}
		}

		// Save payload
		if ( isset( $_POST['academia_quiz_questions_payload'] ) ) {
			// Saneamos la cadena JSON básica para evitar inyecciones. 
			// wp_kses_post es permisivo, para json puro sanitize_text_field es seguro pero escapa mucho.
			// Lo más seguro es decodificar, validar estructura y volver a codificar, o usar wp_slash/json_encode.
			
			$payload_string = stripslashes($_POST['academia_quiz_questions_payload']);
			$decoded_json = json_decode( $payload_string, true );
			
			if( is_array($decoded_json) ) {
				// Sanitizamos cada elemento
				$sane_array = [];
				foreach($decoded_json as $q) {
					$sane_options = [];
					if(isset($q['options']) && is_array($q['options'])) {
						foreach($q['options'] as $opt) {
							$sane_options[] = sanitize_text_field($opt);
						}
					}

					$sane_array[] = [
						'title' => isset($q['title']) ? sanitize_text_field($q['title']) : '',
						'correct_index' => isset($q['correct_index']) ? intval($q['correct_index']) : 0,
						'options' => $sane_options
					];
				}

				update_post_meta( $post_id, '_academia_quiz_questions', wp_json_encode($sane_array) );
			}
		}
	}
}
