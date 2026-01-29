<?php
/*
Plugin Name: Open-E Newsletter in Footer
Description: Simple newsletter ajaxed from website. Newsletter for site footer section.
Version: 1.0
Author: Open-E Inc.
Author URI: http://open-e.com
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Enqueue Frontend Scripts and Styles
function ns_enqueue_scripts() {
    wp_enqueue_script(
        'ns-script', 
        plugin_dir_url(__FILE__) . 'newsletter-ajax.js', 
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
add_action('wp_enqueue_scripts', 'ns_enqueue_scripts');

// Shortcode for displaying the form
function newsletter_subscription_form() {
    ob_start();
    ?>

    <div class="newsletter"></div>

    <?php
    return ob_get_clean();
}
add_shortcode('newsletter_form', 'newsletter_subscription_form');