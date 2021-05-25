=== Description List Block ===
Contributors:      kometschuh
Donate link:       https://www.paypal.com/donate/?hosted_button_id=RSR28JGA4M7JC
Tags:              block, description list, gutenberg, list
Requires at least: 5.6
Tested up to:      5.7
Stable tag:        1.1.1
Requires PHP:      7.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Displays a description list using the dl element consist of a series of term and description pairs (dt, dd).

== Description ==

Displays a description list or definition list using the `<dl>` element consist of a series of term and description pairs (`<dt>`, `<dd>`) and displays that elements in definition form like a dictionary in the Gutenberg block editor.

= Features =
* Shortcuts
* Default and Grid styles
* Create a description list with n-elements
* Insert a new term (`<dt>`) and description (`<dd>`) before selection
* Insert a new term (`<dt>`) and description (`<dd>`) after selection
* Delete the selcted term (`<dt>`) and description (`<dd>`) pair

= Shortcuts =
* Cmd(⌘)+E (Mac) or Shift+E (Window): Insert before selection
* Cmd(⌘)+D (Mac) or Shift+D (Window)): Insert after selection
* Cmd(⌘)+Y (Mac) or Shift+Y (Window)): Delete selection
* Shift+ENTER (Mac or Window): Line break (`<br>`)

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

== Changelog ==

= 1.1.0 - Mai 09th 2021 =
* Shortcut Delete selected description list

= 1.1.0 - Mai 09th 2021 =
* Grid style

= 1.0.0 - Mai 02rd 2021 =
* Shortcuts

= 0.1.0 - April 05th 2021 =
* Release
