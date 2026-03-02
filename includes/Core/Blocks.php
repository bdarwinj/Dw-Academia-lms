<?php

namespace AcademiaLms\Core;

/**
 * Register Gutenberg Blocks for Academia LMS
 */
class Blocks {

    /**
     * Init the class.
     */
    public static function init() {
        add_action( 'init', [ __CLASS__, 'register_blocks' ] );
        add_filter( 'block_categories_all', [ __CLASS__, 'add_block_category' ], 10, 2 );
        add_action( 'enqueue_block_editor_assets', [ __CLASS__, 'enqueue_block_editor_assets' ] );
        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_block_frontend_assets' ] );
    }

    /**
     * Add a custom block category.
     */
    public static function add_block_category( $categories, $post ) {
        return array_merge(
            $categories,
            [
                [
                    'slug'  => 'academia-lms',
                    'title' => __( 'Academia LMS', 'academia-lms' ),
                    'icon'  => 'welcome-learn-more',
                ],
            ]
        );
    }

    /**
     * Register individual blocks.
     */
    public static function register_blocks() {
        // Register Search Bar Block
        register_block_type( 'academia-lms/search-bar', [
            'editor_script' => 'academia-blocks-editor',
            'editor_style'  => 'academia-blocks-editor-style',
            'style'         => 'academia-blocks-style',
        ] );

        // Register Hero Block
        register_block_type( 'academia-lms/hero', [
            'editor_script' => 'academia-blocks-editor',
            'editor_style'  => 'academia-blocks-editor-style',
            'style'         => 'academia-blocks-style',
        ] );

        // Register Course Grid Block
        register_block_type( 'academia-lms/course-grid', [
            'editor_script' => 'academia-blocks-editor',
            'editor_style'  => 'academia-blocks-editor-style',
            'style'         => 'academia-blocks-style',
            'render_callback' => [ __CLASS__, 'render_course_grid' ],
        ] );
    }

    /**
     * Enqueue assets for the block editor.
     */
    public static function enqueue_block_editor_assets() {
        wp_enqueue_script(
            'academia-blocks-editor',
            ACADEMIA_LMS_URL . 'assets/blocks/js/blocks.js',
            [ 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n' ],
            ACADEMIA_LMS_VERSION,
            true
        );

        wp_enqueue_style(
            'academia-blocks-editor-style',
            ACADEMIA_LMS_URL . 'assets/admin/css/blocks-editor.css',
            [],
            ACADEMIA_LMS_VERSION
        );
    }

    /**
     * Enqueue assets for the frontend.
     */
    public static function enqueue_block_frontend_assets() {
        wp_enqueue_style(
            'academia-blocks-style',
            ACADEMIA_LMS_URL . 'assets/blocks/css/style.css',
            [],
            ACADEMIA_LMS_VERSION
        );
    }

    /**
     * Dynamic rendering for Course Grid block.
     */
    public static function render_course_grid( $attributes ) {
        $columns = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;
        $limit   = isset( $attributes['limit'] ) ? $attributes['limit'] : 6;
        
        // We reuse the existing shortcode logic or call the template directly
        ob_start();
        echo '<div class="academia-block-course-grid" style="--grid-columns: ' . esc_attr($columns) . '">';
        echo do_shortcode( '[academia_courses]' ); // Simplified for now
        echo '</div>';
        return ob_get_clean();
    }
}
