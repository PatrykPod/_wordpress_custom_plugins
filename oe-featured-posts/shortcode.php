<?php
function cfp_display_featured_posts($atts) {
    // Set default values for the attributes
    $atts = shortcode_atts(
        [
            'posts' => 4,   // Default to displaying 4 posts
            'images' => 2,  // Default to 2 posts with images
        ],
        $atts,
        'featured_posts'
    );

    $posts_to_display = intval($atts['posts']);
    $images_to_display = intval($atts['images']);

    $args = [
        'post_type' => 'post',
        'meta_query' => [
            [
                'key' => '_cfp_featured',
                'value' => '1',
                'compare' => '=',
            ],
        ],
        'posts_per_page' => -1,
        'meta_key' => '_cfp_order',
        'orderby' => [
            'meta_value_num' => 'ASC',
            'date' => 'DESC',
        ],
    ];

    $query = new WP_Query($args);
    $output = '<div class="featured-posts">';
    $count = 0;

    if ($query->have_posts()) {
        $ordered = [];
        $unordered = [];
        $featured_posts = [];

        // Separate ordered and unordered posts
        while ($query->have_posts()) {
            $query->the_post();
            $order = intval(get_post_meta(get_the_ID(), '_cfp_order', true));

            if ($order >= 1 && $order <= 4) {
                $ordered[$order] = $query->post;
            } else {
                $unordered[] = $query->post;
            }
        }

        // Ensure ordered posts are sorted and fill slots up to the limit
        ksort($ordered);
        $featured_posts = array_merge($ordered, array_slice($unordered, 0, $posts_to_display - count($ordered)));

        wp_reset_postdata();
        $count = 0;
        $no_image_posts = []; // Store no-image posts

        // Loop through the selected posts
        foreach ($featured_posts as $post) {
            setup_postdata($post);
            if ($count < $images_to_display) {
                // Posts with images
                $output .= '<div class="featured-post with-image">';
                if (has_post_thumbnail($post->ID)) {
                    $custom_image_map = [
                        0 => 'full',
                        768 => 'desktop-featured-posts',
                        1520 => 'desktop-featured-posts',
                    ];

                    $output .= render_custom_mapped_picture(
                        get_post_thumbnail_id($post->ID),
                        $custom_image_map,
                        'desktop-featured-posts',
                        [
                            'sizes' => '(max-width: 768px) 100vw, 410px'
                        ]
                    );
                }
                $output .= '<div class="post-list-content content">';
                $output .= '    <span class="post-list-categories categories">' . get_first_post_categories($post->ID) . '</span>';
                $output .= '    <h3 class="post-list-title featured-post-title"><a href="' . get_permalink($post->ID) . '">' . get_the_title($post->ID) . '</a></h3>';
                $output .= '    <p class="post-list-text featured-post-text">' . wp_trim_words(get_the_excerpt($post->ID), 20, '...') . '</p>';
                $output .= '</div></div>';
            } else {
                // Store no-image posts for later processing
                $no_image_posts[] = $post;
            }
            $count++;
            // Stop when reaching the post limit
            if ($count >= $posts_to_display) break;
        }

        // Handle no-image-wrapper
        if (!empty($no_image_posts)) {
            $output .= '<div class="no-image-wrapper">';
            foreach ($no_image_posts as $post) {
                setup_postdata($post);
                $output .= '<div class="featured-post no-image">';
                $output .= '    <div class="post-list-content content">';
                $output .= '        <span class="post-list-categories categories">' . get_first_post_categories($post->ID) . '</span>';
                $output .= '        <h3 class="post-list-title featured-post-title"><a href="' . get_permalink($post->ID) . '" title="' . get_the_title($post->ID) . '">' . get_the_title($post->ID) . '</a></h3>';
                $output .= '        <p class="post-list-text featured-post-text">' . get_the_excerpt($post->ID) . '</p>';
                $output .= '        <a class="post-list-btn featured-post-btn" href="' . get_permalink($post->ID) . '" title="' . get_the_title($post->ID) . '"><span>Read more</span><span class="fa-sr-only"> about the article: ' . get_the_title($post->ID) . '</span></a>';
                $output .= '</div></div>';
            }
            $output .= '</div>'; // Close .no-image-wrapper
        }

        wp_reset_postdata();
    }

    return $output . '</div>';
}
add_shortcode('featured_posts', 'cfp_display_featured_posts');

