<?php
/**
 * Plugin Name:     Description List Block
 * Plugin URI:      https://wordpress.org/plugins/description-list-block/
 * Description:     Description list (also known as definition list) block for glossaries, FAQs and specs using semantic dl, dt and dd HTML.
 * Version:         1.3.1
 * Author:          TipTopPress
 * Author URI:      https://tiptoppress.com
 * Requires at least: 6.6
 * Requires PHP:      7.0
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     description-list-block
 *
 * @package         tiptip
 */

namespace descriptionList;

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
function description_list_block_block_init() {
	register_block_type_from_metadata( __DIR__ . '/build' );
}
add_action( 'init', __NAMESPACE__ . '\description_list_block_block_init' );
