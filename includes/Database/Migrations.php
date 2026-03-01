<?php

namespace AcademiaLms\Database;

/**
 * Handle custom database table creation.
 */
class Migrations {

	/**
	 * Run all migrations.
	 */
	public static function init() {
		self::crear_tabla_matriculas();
		self::crear_tabla_progreso();
	}

	/**
	 * Crea la tabla de matrículas / inscripciones.
	 */
	private static function crear_tabla_matriculas() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'academia_matriculas';

		$charset_collate = $wpdb->get_charset_collate();

		// `id`         : ID único de la matrícula
		// `user_id`    : ID del estudiante
		// `curso_id`   : ID del curso en el CPT `academia_curso`
		// `fecha_alta` : Cuándo se matriculó
		// `estado`     : 'activa', 'completada', 'suspendida'
		$sql = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			user_id bigint(20) unsigned NOT NULL,
			curso_id bigint(20) unsigned NOT NULL,
			fecha_alta datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			fecha_completado datetime NULL,
			estado varchar(50) DEFAULT 'activa' NOT NULL,
			porcentaje decimal(5,2) DEFAULT '0.00' NOT NULL,
			PRIMARY KEY  (id),
			KEY user_id (user_id),
			KEY curso_id (curso_id)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}

	/**
	 * Crea la tabla de progreso pormenorizado (por lección/quiz).
	 */
	private static function crear_tabla_progreso() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'academia_progreso';

		$charset_collate = $wpdb->get_charset_collate();

		// `matricula_id` : Clave foránea a la matrícula
		// `item_id`      : ID de la lección o cuestionario completado
		// `item_tipo`    : 'leccion', 'cuestionario'
		$sql = "CREATE TABLE $table_name (
			id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			matricula_id bigint(20) unsigned NOT NULL,
			item_id bigint(20) unsigned NOT NULL,
			item_tipo varchar(50) NOT NULL,
			fecha_completado datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			puntuacion int(11) NULL,
			PRIMARY KEY  (id),
			KEY matricula_id (matricula_id),
			KEY item_id (item_id)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}
}
