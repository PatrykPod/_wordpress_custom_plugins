<?php
/**
 * Plugin Name:       Open E Guttenberg Blocks
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       open-e-guttenberg-blocks
 *
 * @package Oeblocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function oeblocks_open_e_guttenberg_blocks_block_init() {
	// register_block_type( __DIR__ . '/build/open-e-guttenberg-blocks' );
	register_block_type( __DIR__ . '/build/lead-section' );
	register_block_type( __DIR__ . '/build/highlight-section' );
}
add_action( 'init', 'oeblocks_open_e_guttenberg_blocks_block_init' );
