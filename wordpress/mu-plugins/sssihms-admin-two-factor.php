<?php
/**
 * Plugin Name: SSSIHMS — Two-Factor Required for Administrators
 * Description: Makes Kadence Security's two-factor login mandatory for super admins, for
 *              anyone who is an Administrator on any site of the network, and for the patient
 *              feedback portal's staff roles on Whitefield.
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

/**
 * Feedback portal staff on Whitefield (blog 4) see patients' names, numbers and recordings, so
 * the portal SOP (section 7) extends two-factor login to them. Roles from
 * sssihms-wfd-feedback-portal.php; sssihms_pws is the Patient Welfare Services role.
 */
function sssihms_2fa_is_feedback_staff( $user ) {
	global $wpdb;
	$caps = get_user_meta( $user->ID, $wpdb->get_blog_prefix( 4 ) . 'capabilities', true );
	return is_array( $caps ) && array_intersect_key( $caps, array_flip( array( 'sssihms_pws', 'sssihms_fb_coord', 'sssihms_fb_owner', 'sssihms_fb_esc1', 'sssihms_fb_esc2' ) ) );
}

add_filter( 'itsec_two_factor_requirement_reason', function ( $reason, $user ) {
	if ( $reason || ! $user instanceof WP_User ) {
		return $reason;
	}
	if ( sssihms_2fa_is_admin_anywhere( $user ) ) {
		return 'sssihms_administrator';
	}
	return sssihms_2fa_is_feedback_staff( $user ) ? 'sssihms_feedback_staff' : $reason;
}, 10, 2 );

add_filter( 'itsec_two_factor_requirement_reason_description', function ( $description, $reason = '' ) {
	// Kadence passes the reason as the first argument.
	if ( 'sssihms_feedback_staff' === $description ) {
		return 'Two-factor login is required for patient feedback portal staff.';
	}
	return 'sssihms_administrator' === $description
		? 'Two-factor login is required for administrator accounts on SSSIHMS websites.'
		: $description;
}, 10, 2 );
