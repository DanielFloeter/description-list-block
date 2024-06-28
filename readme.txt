=== Description List Block ===
Contributors:      kometschuh
Donate link:       https://www.paypal.com/donate/?hosted_button_id=RSR28JGA4M7JC
Tags:              block, description list, definition list, gutenberg, list
Requires at least: 5.6
Tested up to:      6.5
Stable tag:        1.2.5
Requires PHP:      7.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Displays a description list using the dl element consist of a series of term and description pairs (dt, dd).

== Description ==

Displays a description list or definition list using the `<dl>` element consist of a series of term and description pairs (`<dt>`, `<dd>`) and displays that elements in definition form like a dictionary in the Gutenberg block editor.

= Tip Top Press =
We're [Tip Top Press](http://tiptoppress.com/) and create Gutenberg Blocks for Wordpress. If you want to know about what we're working on and you are interested in backgrounds then you can read all newes storys on our [blog](http://tiptoppress.com/blog/?utm_source=wp.org&utm_medium=readme.txt&utm_campaign=description+list+block).

= Features =
* Indent-, Grid and Disable Block CSS Block Styles
* Indent or spacing settings
* Color, spacing, indent, horizontal whitspce, font-size, font-style and font-weight settings for both element tags
* Create a description list with n-elements
* Insert a new term (`<dt>`) and description (`<dd>`) before selection
* Insert a new term (`<dt>`) and description (`<dd>`) after selection
* Delete the selcted term (`<dt>`) and description (`<dd>`) pair
* Access via Shortcuts

= Contribute =
While using this plugin if you find any bug or any conflict, please submit an issue at [Github](https://github.com/DanielFloeter/description-list-block) (If possible with a pull request).

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/description-list-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress 


== Frequently Asked Questions ==

= How to add only dd elements? =

Just use or add also pairs (`<dt>`, `<dd>`) and leave the `<dt>` element empty.

== Screenshots ==

1. The Description List Block in the front-end view.
2. Rendered HTML
3. From the Block control or with shortcuts, you can insert description list pairs (dt, dd) before or after the current selection or delete a description list.
4. Grid style
5. Block Styles 'transformation' without change any code.
6. Seperate Term (dt) and Description (dd) settings

== Changelog ==

= 1.2.5 - Juni 29th 2024 =
* Wrong icon

= 1.2.4 - Juni 27th 2024 =
* Bugfix Rendered HTML

= 1.2.3 - December 02th 2023 =
* Font-Style and Font-Weight 
* Calm whitespace with Horizontal

= 1.2.2 - September 26th 2023 =
* Use CSS selectors

= 1.2.1 - September 16th 2023 =
* Bugfix OnFocus WP 6.3 ready

= 1.2.0 - January 12th 2023 =
* Remove Shortcuts
* Bugfix Slow save

= 1.1.13 - December 31th 2022 =
* Bugfix Update component inside a function body of a different component

= 1.1.12 - March 06th 2022 =
* Backward compatible experimental flag usage

= 1.1.11 - January 28th 2022 =
* Bugfix Shortcuts with WordPress 5.9

= 1.1.10 - January 13th 2022 =
* Add Block Style Disable Block CSS

= 1.1.9 - December 28th 2021 =
* Reset for margin and padding
* Add option padding
* Bugfix Text Colors in Gutenberg widget area

= 1.1.8 - December 19th 2021 =
* Bugfix Inner Blocks

= 1.1.7 - December 18th 2021 =
* Add indent or spacing option
* Delete obsolete styles Grid 1:4, Grid 1:2, Indent 40 PX

= 1.1.6 - December 14th 2021 =
* Add styles Grid 1:4, Grid 1:2, Indent 40 PX
* Change option margin (from padding)

= 1.1.5 - October 18th 2021 =
* Add style Indent Start
* Add option padding

= 1.1.4 - Juni 27th 2021 =
* Color styles for element tags

= 1.1.3 - Juni 26th 2021 =
* Font-size styles for element tags

= 1.1.2 - Juni 22th 2021 =
* Bugfix WordPress 5.8 API change block.json fontSize

= 1.1.1 - Mai 09th 2021 =
* Shortcut Delete selected description list

= 1.1.0 - Mai 09th 2021 =
* Grid style

= 1.0.0 - Mai 02rd 2021 =
* Shortcuts

= 0.1.0 - April 05th 2021 =
* Release
