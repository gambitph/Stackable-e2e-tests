<?php
/**
 * Plugin Name: Stackable - End-to-end Tests
 * Plugin URI: https://wpstackable.com
 * Description: End-to-end Integration & Acceptance Testing
 * Author: Gambit Technologies, Inc
 * Author URI: http://gambit.ph
 * Text Domain: stackable-ultimate-gutenberg-blocks
 * Version: 0.1
 *
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$PLUGIN = 'stackable/plugin.php';

if ( isset( $_GET['setup'] ) ) {
	add_action('init', function() {
		// Always make sure that Stackable is active.
		$active_plugins = get_option( 'active_plugins' );
		if ( ! in_array( $PLUGIN, $active_plugins ) ) {
			$active_plugins[] = $PLUGIN;
			update_option( 'active_plugins', $active_plugins );
		}

		$user_id = 1;
		$user = get_user_by( 'id', $user_id );
		if( $user ) {
			wp_set_current_user( $user_id, $user->user_login );
			wp_set_auth_cookie( $user_id );
			do_action( 'wp_login', $user->user_login, $user );
		}

		// Reset all stackable settings.
		update_option( 'stackable_editor_roles_content_only', [] );
		update_option( 'stackable_global_colors', [] );
		update_option( 'stackable_global_colors_palette_only', false );
		update_option( 'stackable_global_content_selector', '' );
		update_option( 'stackable_global_force_typography', false );
		update_option( 'stackable_global_typography', [] );
		update_option( 'stackable_global_typography_apply_to', '' );
		update_option( 'stackable_help_tooltip_disabled', '1' );
		update_option( 'stackable_icons_dont_show_fa_error', '' );
		update_option( 'stackable_icons_fa_kit', '' );
		update_option( 'stackable_icons_fa_version', '' );
		update_option( 'stackable_load_v1_styles', '' );
		update_option( 'stackable_show_pro_notices', '' );

		// Get all pages in the site.
		$all_pages = get_posts( array(
			'post_type' => 'page',
			'post_status' => 'any'
		) );

		// Remove all pages.
		forEach( $all_pages as $pages ){
			wp_delete_post( $pages->ID );
		}

		die();
	});
}
