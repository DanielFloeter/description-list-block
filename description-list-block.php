<?php
/**
 * Plugin Name:     Description List Block
 * Plugin URI:      https://wordpress.org/plugins/description-list-block/
 * Description:     Displays a description list using the DL element consist of a series of DT (term) and DD (description) pairs.
 * Version:         0.1.0
 * Author:          TipTopPress
 * Author URI:      http://tiptoppress.com
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     description-list-block
 *
 * @package         tiptip
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function create_description_list_block_init() {
	register_block_type_from_metadata( __DIR__ );
}
add_action( 'init', 'create_description_list_block_init' );
