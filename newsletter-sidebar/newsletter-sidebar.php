<?php
/*
Plugin Name: Open-E Newsletter in Sidebar
Description: Simple newsletter ajaxed from website. Red box in sidebar.
Version: 1.0
Author: Open-E Inc.
Author URI: http://open-e.com
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Enqueue Frontend Scripts and Styles
function nsidebar_enqueue_scripts() {
    wp_enqueue_script(
        'nsidebar-script', 
        plugin_dir_url(__FILE__) . 'newsletter-ajax-sidebar.js', 
        array('jquery'), 
        null, 
        array(
            'in_footer' => true,
            'strategy'  => 'async',
        )
    );

    // load css later to be none blocking
    add_action('wp_footer', function() {
        echo '<link rel="stylesheet" href="' . plugin_dir_url(__FILE__) . 'style.css" type="text/css" media="all" />';
    }, 999);
}
add_action('wp_enqueue_scripts', 'nsidebar_enqueue_scripts');

// Shortcode for displaying the form
function newsletter_sidebar_form() {
    ob_start();
    ?>

    <div class="newsletter-subscription"></div>

    <?php
    return ob_get_clean();
}
add_shortcode('newsletter_form_sidebar', 'newsletter_sidebar_form');