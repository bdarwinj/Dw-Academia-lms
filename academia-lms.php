<?php
/**
 * Plugin Name: Dw Bolivar Academia lms
 * Plugin URI:  https://www.youtube.com/@bdarwinj
 * Description: Sistema de Gestión de Aprendizaje (LMS) premium, inmersivo y de alto rendimiento. Diseñado por Darwin j. Bolivar con asistencia de IA.
 * Version:           1.0.0
 * Author:      Darwin j. Bolivar
 * Author URI:  https://www.youtube.com/@bdarwinj
 * License:     GPL2
 * Text Domain:       academia-lms
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Define Constants
define('ACADEMIA_LMS_VERSION', '1.0.0');
define('ACADEMIA_LMS_FILE', __FILE__);
define('ACADEMIA_LMS_PATH', plugin_dir_path(__FILE__));
define('ACADEMIA_LMS_URL', plugin_dir_url(__FILE__));

// Require the Composer autoloader.
if (file_exists(ACADEMIA_LMS_PATH . 'vendor/autoload.php')) {
    require_once ACADEMIA_LMS_PATH . 'vendor/autoload.php';
}

/**
 * Initializes the main plugin class.
 *
 * @since 1.0.0
 */
function academia_lms_init()
{
    if (class_exists('AcademiaLms\Core\Plugin')) {
        $plugin = \AcademiaLms\Core\Plugin::get_instance();
        $plugin->run();
    }
}

// Boot the plugin.
add_action('plugins_loaded', 'academia_lms_init');