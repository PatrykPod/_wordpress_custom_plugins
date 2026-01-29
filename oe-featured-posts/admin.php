<?php

function cfp_add_columns($columns) {
    $columns['cfp_featured_order'] = 'Featured & Order';
    return $columns;
}
add_filter('manage_posts_columns', 'cfp_add_columns');

function cfp_custom_column_content($column, $post_id) {
    if ($column == 'cfp_featured_order') {
        $is_featured = get_post_meta($post_id, '_cfp_featured', true);
        $order = get_post_meta($post_id, '_cfp_order', true);
        
        echo '<div style="display: flex; align-items: center; gap: 10px;">';
        
        // Checkbox
        echo '<input type="checkbox" class="cfp-featured-checkbox" data-post-id="' . $post_id . '" ' . checked($is_featured, '1', false) . '>';
        
        // Order Select
        echo '<select class="cfp-order-select" data-post-id="' . $post_id . '">';
        echo '<option value="-" ' . selected($order, '-', false) . '>–</option>';
        for ($i = 1; $i <= 4; $i++) {
            // Check if this order is already assigned to another post
            $query = new WP_Query([
                'post_type' => 'post',
                'meta_query' => [
                    ['key' => '_cfp_order', 'value' => $i, 'compare' => '='],
                    ['key' => '_cfp_featured', 'value' => '1', 'compare' => '=']
                ]
            ]);
            $disabled = $query->have_posts() && $query->posts[0]->ID != $post_id ? 'disabled' : '';
            echo '<option value="' . $i . '" ' . selected($order, $i, false) . ' ' . $disabled . '>' . $i . '</option>';
        }
        echo '</select>';
        
        echo '</div>';
    }
}
add_action('manage_posts_custom_column', 'cfp_custom_column_content', 10, 2);

add_action('admin_head', function () {
    ?>
    <style>
        #cfp_featured_order {
            width: 75px;
        }
    </style>
    <?php
});


function cfp_enqueue_admin_scripts($hook) {
    if ('edit.php' !== $hook) return;
    
    // Get total count of featured posts across all pages
    $query = new WP_Query([
        'post_type' => 'post',
        'posts_per_page' => -1,
        'meta_query' => [
            [
                'key' => '_cfp_featured',
                'value' => '1',
                'compare' => '='
            ]
        ]
    ]);
    $total_featured = $query->found_posts;

    wp_enqueue_script('cfp-admin-js', plugins_url('/assets/admin.js', __FILE__), ['jquery'], false, true);
    wp_localize_script('cfp-admin-js', 'cfpData', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'maxFeatured' => 4,
        'maxFeaturedWithImage' => 2,
        'currentFeatured' => $total_featured
    ]);
}
add_action('admin_enqueue_scripts', 'cfp_enqueue_admin_scripts');

// Add AJAX handler to check total featured count
function cfp_check_featured_count() {
    $query = new WP_Query([
        'post_type' => 'post',
        'posts_per_page' => -1,
        'meta_query' => [
            [
                'key' => '_cfp_featured',
                'value' => '1',
                'compare' => '='
            ]
        ]
    ]);
    
    wp_send_json_success([
        'totalFeatured' => $query->found_posts
    ]);
}
add_action('wp_ajax_cfp_check_featured_count', 'cfp_check_featured_count');

// Add AJAX handler to save featured status with count check
function cfp_save_featured_status() {
    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $featured = isset($_POST['featured']) ? intval($_POST['featured']) : 0;
    
    if (!$post_id) {
        wp_send_json_error('Invalid post ID');
        return;
    }
    
    // Check current total count
    $query = new WP_Query([
        'post_type' => 'post',
        'posts_per_page' => -1,
        'meta_query' => [
            [
                'key' => '_cfp_featured',
                'value' => '1',
                'compare' => '='
            ]
        ]
    ]);
    $current_count = $query->found_posts;
    
    // If trying to add a new featured post and we're at the limit
    if ($featured && $current_count >= 4) {
        wp_send_json_error('Maximum of 4 featured posts allowed');
        return;
    }
    
    // Update the post meta
    update_post_meta($post_id, '_cfp_featured', $featured);
    
    // Send updated count
    wp_send_json_success([
        'totalFeatured' => $featured ? $current_count + 1 : $current_count - 1
    ]);
}
add_action('wp_ajax_cfp_save_featured_status', 'cfp_save_featured_status');

function cfp_save_order() {
    $post_id = intval($_POST['post_id']);
    $order = intval($_POST['order']);
    update_post_meta($post_id, '_cfp_order', $order);
    wp_die();
}
add_action('wp_ajax_cfp_save_order', 'cfp_save_order');

// Add AJAX handler to get all used orders
function cfp_get_used_orders() {
    $query = new WP_Query([
        'post_type' => 'post',
        'posts_per_page' => -1,
        'meta_query' => [
            'relation' => 'AND',
            [
                'key' => '_cfp_featured',
                'value' => '1',
                'compare' => '='
            ],
            [
                'key' => '_cfp_order',
                'value' => '',
                'compare' => '!='
            ]
        ]
    ]);
    
    $used_orders = [];
    foreach ($query->posts as $post) {
        $order = get_post_meta($post->ID, '_cfp_order', true);
        if ($order && $order !== '-') {
            $used_orders[] = $order;
        }
    }
    
    wp_send_json_success([
        'usedOrders' => $used_orders
    ]);
}
add_action('wp_ajax_cfp_get_used_orders', 'cfp_get_used_orders');