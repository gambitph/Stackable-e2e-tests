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

		die();
	});
}
