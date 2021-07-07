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

function get_plugin_slug( $folder_name ) {
	if ( ! function_exists( 'get_plugins' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$plugin_slugs = array_keys( get_plugins() );
	$match = array_values( array_filter( $plugin_slugs, function( $slug ) use( $folder_name ) {
		return stripos( $slug, $folder_name . '/' ) === 0;
	} ) );
	return count( $match ) ? $match[ 0 ] : false;
}

if ( isset( $_GET[ 'setup' ] ) ) {
	add_action('init', function() {
		// Always make sure that Stackable is active.
		$active_plugins = get_option( 'active_plugins' );

		// Make sure our tested plugin is activated.
		$plugins_activated = array( plugin_basename( __FILE__ ) );
		if ( ! isset( $_GET[ 'plugins' ] ) || empty( $_GET[ 'plugins' ] ) ) {
			$plugins_activated[] = get_plugin_slug( 'stackable' );
		} else {
			$plugins_to_activate = explode( ',', $_GET[ 'plugins' ] );
			foreach ( $plugins_to_activate as $plugin_name ) {
				$plugin_slug = get_plugin_slug( $plugin_name );
				if ( $plugin_slug ) {
					$plugins_activated[] = $plugin_slug;
				}
			}
		}

		// Cleanup plugin names.
		$plugins_activated = array_values( array_filter( $plugins_activated, function( $slug ) {
			return ! empty( $slug );
		} ) );

		update_option( 'active_plugins', $plugins_activated );

		$user = get_user_by( 'login', 'admin' );
		if( $user ) {
			$user_id = $user->ID;
			wp_set_current_user( $user_id, $user->user_login );
			wp_set_auth_cookie( $user_id, true );
			do_action( 'wp_login', $user->user_login, $user );

			// Get the current role of the admin user.
			// Set the user to be an administrator upon setup.
			$curr_role = reset( wp_get_current_user()->roles );
			$u = new WP_User( $user_id );
			$u->remove_role( $curr_role );
			$u->add_role( 'administrator' );
			// Set stackable_welcome_video_closed to 1.
			update_user_meta( $user_id, 'stackable_welcome_video_closed', 1 );
		}

		// Reset all stackable settings.
		update_option( 'stackable_editor_roles_content_only', [] );
		update_option( 'stackable_global_colors', [[]] );
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
		update_option( 'stackable_optimization_settings', false );
		update_option( 'stackable_optimize_script_load', false );

		// Get all pages in the site.
		$all_pages = get_posts( array(
			'post_type' => 'page',
			'post_status' => 'any'
		) );

		// Remove all pages.
		forEach( $all_pages as $pages ){
			wp_delete_post( $pages->ID );
		}

		// Get all posts in the site.
		$all_posts = get_posts( array(
			'post_type' => 'post',
			'post_status' => 'any'
		) );

		// Remove all posts.
		forEach( $all_posts as $posts ){
			wp_delete_post( $posts->ID );
		}

		// Get all images in the site.
		$all_images = get_posts( array(
			'post_type' => 'attachment',
			'post_status' => 'any'
		) );

		// Remove all images.
		forEach( $all_images as $images ){
			wp_delete_attachment( $images->ID );
		}

		die();
	});
}

if ( isset( $_GET[ 'deactivate-plugin' ] ) ) {
	add_action( 'init', function() {
		$plugin = $_GET[ 'deactivate-plugin' ];
		deactivate_plugins( '/'. $plugin .'/plugin.php');
		die();
	} );
}

if ( isset( $_GET[ 'activate-plugin' ] ) ) {
	add_action( 'init', function() {
		$plugin = '/' . $_GET[ 'activate-plugin' ] . '/plugin.php';

		$active_plugins = get_option( 'active_plugins' );
		if ( ! in_array( $plugin, $active_plugins ) ) {
			$active_plugins[] = $plugin;
			update_option( 'active_plugins', $active_plugins );
		}

		die();
	} );
}

if ( isset( $_GET[ 'register-posts' ] ) ) {
	add_action( 'init', function() {
		$user = get_user_by( 'login', 'admin' );
		$num_of_posts = intval( $_GET[ 'numOfPosts' ] );

		foreach ( range( 1, $num_of_posts ) as $num ) {
			// Register Post Data
			$post = array();
			$post[ 'post_type' ]     = $_GET[ 'postType' ];
			$post[ 'post_title' ]    = $_GET[ 'postTitle' ] . $num;
			$post[ 'post_content' ]  = $_GET[ 'postContent' ];
			$post[ 'post_author' ]   = $user->ID;
			$post[ 'post_category' ]   = array( 1 );
			$post[ 'post_status' ]   = 'publish';

			$post_id = wp_insert_post( $post );

			// Add Featured Image to Post
			$upload_dir = wp_upload_dir();
			$image_data = file_get_contents( $_GET[ 'featuredImage' ] );
			$unique_file_name = wp_unique_filename( $upload_dir[ 'path' ], $_GET[ 'imageName' ] );
			$filename = basename( $unique_file_name );

			// Check folder permission and define file location
			if( wp_mkdir_p( $upload_dir[ 'path' ] ) ) {
				$file = $upload_dir[ 'path' ] . '/' . $filename;
			} else {
				$file = $upload_dir[ 'basedir' ] . '/' . $filename;
			}

			// Create the image file on the server
			file_put_contents( $file, $image_data );

			// Check image file type
			$wp_filetype = wp_check_filetype( $filename, null );

			// Set attachment data
			$attachment = array(
				'post_mime_type' => $wp_filetype[ 'type' ],
				'post_title'     => sanitize_file_name( $filename ),
				'post_content'   => '',
				'post_status'    => 'inherit'
			);

			// Create the attachment
			$attach_id = wp_insert_attachment( $attachment, $file, $post_id );

			// Include image.php
			require_once( ABSPATH . 'wp-admin/includes/image.php' );

			// Define attachment metadata
			$attach_data = wp_generate_attachment_metadata( $attach_id, $file );

			// Assign metadata to attachment
			wp_update_attachment_metadata( $attach_id, $attach_data );

			// Assign featured image to post
			set_post_thumbnail( $post_id, $attach_id );
		}
	} );
}

if ( isset( $_GET[ 'change-role' ] ) ) {
	add_action( 'init', function() {
		$role_to = strtolower( $_GET[ 'roleTo' ] );
		$role_from = reset( wp_get_current_user()->roles );
	
		$user = new WP_User( 1 );
		// Remove role
		$user->remove_role( $role_from );
		// Add role
		$user->add_role( $role_to );
	} );
}
