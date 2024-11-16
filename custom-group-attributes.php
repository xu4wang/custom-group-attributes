<?php
/**
 * Plugin Name: Custom Group Block Attributes
 * Description: Extends WordPress Group Block with custom data attributes and ID
 * Version: 1.0.0
 * Author: Austin Wang
 * Requires at least: 6.5
 * Author URI:        https://github.com/xu4wang
 * Plugin URI:        https://github.com/xu4wang/custom-group-attributes
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    exit;
}

class Custom_Group_Block_Attributes {
    public function __construct() {
        add_action('init', array($this, 'register_scripts'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        add_filter('render_block', array($this, 'process_dynamic_attributes'), 10, 2);
    }

    public function register_scripts() {
        wp_register_script(
            'custom-group-block',
            plugins_url('build/custom-group-block.js', __FILE__),
            array(
                'wp-blocks',
                'wp-element',
                'wp-editor',
                'wp-components',
                'wp-compose',
                'wp-block-editor',
                'wp-hooks'
            ),
            filemtime(plugin_dir_path(__FILE__) . 'build/custom-group-block.js'),
            true
        );
    }

    public function enqueue_editor_assets() {
        wp_enqueue_script('custom-group-block');
    }

    public function process_dynamic_attributes($block_content, $block) {
        if ($block['blockName'] !== 'core/group') {
            return $block_content;
        }

        // Get dynamic values
        $dynamic_values = array(
            '{{post_permalink}}' => get_permalink(),
            '{{post_title}}' => get_the_title(),
            '{{post_id}}' => get_the_ID(),
            '{{author_name}}' => get_the_author(),
            '{{current_date}}' => current_time('Y-m-d')
        );

        // Replace dynamic values in block content
        foreach ($dynamic_values as $token => $value) {
            $block_content = str_replace($token, esc_attr($value), $block_content);
        }

        return $block_content;
    }
}

new Custom_Group_Block_Attributes();
