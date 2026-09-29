<?php
/**
 * Plugin Name: SSSIHMS — Two-Factor Required for Administrators
 * Description: Makes Kadence Security's two-factor login mandatory for super admins and for
 *              anyone who is an Administrator on any site of the network.
 *
 * Kadence Security Basic ships the two-factor module but leaves "who must use it" to the Pro
 * add-on, which answers through the `itsec_two_factor_requirement_reason` filter. This file
 * answers that filter instead. With a reason set, Kadence forces the set-up screen at login
 * (no Skip button) and, until an authenticator app is configured, sends a one-time code by
 * email. Network-wide on purpose: accounts are shared across the multisite, so an admin
 * account left unprotected on one site is a way into all of them. Added 29-Sep-2026 after
 * ~20,000 failed logins in 30 days, many against real admin usernames.
 */

defined( 'ABSPATH' ) || exit;

function sssihms_2fa_is_admin_anywhere( $user ) {
	if ( is_super_admin( $user->ID ) ) {
		return true;
	}
	global $wpdb;
	foreach ( array_keys( get_blogs_of_user( $user->ID ) ) as $blog_id ) {
		$caps = get_user_meta( $user->ID, $wpdb->get_blog_prefix( $blog_id ) . 'capabilities', true );
		if ( is_array( $caps ) && ! empty( $caps['administrator'] ) ) {
			return true;
		}
	}
	return false;
}

add_filter( 'itsec_two_factor_requirement_reason', function ( $reason, $user ) {
	if ( $reason || ! $user instanceof WP_User ) {
		return $reason;
	}
	return sssihms_2fa_is_admin_anywhere( $user ) ? 'sssihms_administrator' : $reason;
}, 10, 2 );

add_filter( 'itsec_two_factor_requirement_reason_description', function ( $description, $reason = '' ) {
	// Kadence passes the reason as the first argument.
	return 'sssihms_administrator' === $description
		? 'Two-factor login is required for administrator accounts on SSSIHMS websites.'
		: $description;
}, 10, 2 );
