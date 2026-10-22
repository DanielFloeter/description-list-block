=== Description List Block ===
Contributors:      kometschuh
Donate link:       https://www.paypal.com/donate/?hosted_button_id=RSR28JGA4M7JC
Tags:              description list, definition list, glossary, faq, dictionary
Requires at least: 6.6
Tested up to:      7.1
Stable tag:        1.3.1
Requires PHP:      7.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Description list (also known as definition list) block for glossaries, FAQs and specs using semantic dl, dt and dd HTML.

== Description ==

Build glossaries, FAQs, product specs and other term–description lists in the WordPress block editor (Gutenberg). The Description List Block outputs a semantic HTML definition list: a `<dl>` element with term (`<dt>`) and description (`<dd>`) pairs, the markup made for exactly this kind of content and understood by browsers, screen readers and search engines.

Add, insert and delete term and description pairs right in the editor, choose an indent or grid layout and style terms and descriptions separately. Already have a list, a few paragraphs or `<dl>` HTML? Transform it into a description list with one click, or simply paste the markup.

= Tip Top Press =
We're [Tip Top Press](https://tiptoppress.com/) and create Gutenberg blocks for WordPress. If you want to know what we're working on and are interested in the background, you can read all news stories on our [blog](https://tiptoppress.com/blog/?utm_source=wp.org&utm_medium=readme.txt&utm_campaign=description+list+block).

= Features =
* Indent-, Grid and Disable Block CSS Block Styles
* Indent or spacing settings
* Color, spacing, indent, horizontal whitespace, font-size, font-style and font-weight settings for both element tags
* Create a description list with n-elements
* Insert a new term (`<dt>`) and description (`<dd>`) before selection
* Insert a new term (`<dt>`) and description (`<dd>`) after selection
* Delete the selected term (`<dt>`) and description (`<dd>`) pair
* Transform a Custom HTML block, a list or paragraphs into a description list and back
* Paste description list markup as a description list

= Contribute =
If you find a bug or a conflict while using this plugin, please submit an issue on [GitHub](https://github.com/DanielFloeter/description-list-block) (if possible with a pull request).

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/description-list-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.


== Frequently Asked Questions ==

= How do I create a glossary in WordPress? =

Add the Description List Block to a post or page, type a term in the first line and its explanation in the second. Use the block toolbar to insert more term and description pairs before or after the selected one. Pick the Grid style to show terms and descriptions side by side.

= Is the output SEO-friendly and accessible? =

Yes. The block saves plain semantic HTML: a `<dl>` with `<dt>` terms and `<dd>` descriptions, without wrapper `<div>`s inside the list. Screen readers announce it as a list of terms, and search engines can tell which description belongs to which term.

= How do I convert a list, paragraphs or HTML into a description list? =

Select the block and choose "Description List Block" in the transform menu of the block toolbar. It works with the List block, one or more Paragraph blocks and a Custom HTML block that contains `<dl>` markup:

* List or paragraphs: the items become term, description, term, description, and so on.
* Nested list: each top-level item becomes a term, its sub-items become the descriptions.
* Custom HTML: every `<dl>` becomes a description list; the HTML around it stays in Custom HTML blocks.

You can transform a description list back into a list, paragraphs or Custom HTML the same way. Pasting `<dl>` markup into the editor creates a description list directly.

= Can I use the styles of my theme instead of the block's CSS? =

Yes. Choose the block style "Disable Block CSS" and the block no longer adds its own spacing, font and color rules, so the `<dl>`, `<dt>` and `<dd>` styles of your theme apply.

= Can I link to a description list? =

Yes. Enter an HTML anchor under Advanced in the block settings, then link to it with `#your-anchor`.

= How to add only dd elements? =

Add term and description pairs (`<dt>`, `<dd>`) as usual and leave the `<dt>` element empty.

== Screenshots ==

1. A description list on the front end: terms with indented descriptions in the default Indent style.
2. The semantic HTML the block saves: a `<dl>` with `<dt>` term and `<dd>` description pairs, no extra wrappers.
3. Insert a term and description pair before or after the selected one, or delete it, right from the block toolbar.
4. Grid style: terms and descriptions side by side in two columns, ideal for glossaries and product specs.
5. Switch between block styles in the block settings without changing any code.
6. Separate typography and color settings for terms (dt) and descriptions (dd).

== Changelog ==

= 1.3.1 - October 22nd 2026 =
* Translation and dependencies update

= 1.3.0 - August 30th 2026 =
* Transform a Custom HTML block into a description list and back
* Transform a list into a description list and back
* Transform paragraphs into a description list and back
* Paste description list markup as a description list
* Bugfix Invalid CSS variables in the saved markup
* Write only non-default values to the block markup

= 1.2.5 - June 29th 2024 =
* Wrong icon

= 1.2.4 - June 27th 2024 =
* Bugfix Rendered HTML

= 1.2.3 - December 2nd 2023 =
* Font-Style and Font-Weight 
* Calm whitespace with Horizontal

= 1.2.2 - September 26th 2023 =
* Use CSS selectors

= 1.2.1 - September 16th 2023 =
* Bugfix OnFocus WP 6.3 ready

= 1.2.0 - January 12th 2023 =
* Remove Shortcuts
* Bugfix Slow save

= 1.1.13 - December 31st 2022 =
* Bugfix Update component inside a function body of a different component

= 1.1.12 - March 6th 2022 =
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

= 1.1.4 - June 27th 2021 =
* Color styles for element tags

= 1.1.3 - June 26th 2021 =
* Font-size styles for element tags

= 1.1.2 - June 22nd 2021 =
* Bugfix WordPress 5.8 API change block.json fontSize

= 1.1.1 - May 9th 2021 =
* Shortcut Delete selected description list

= 1.1.0 - May 9th 2021 =
* Grid style

= 1.0.0 - May 2nd 2021 =
* Shortcuts

= 0.1.0 - April 5th 2021 =
* Release
