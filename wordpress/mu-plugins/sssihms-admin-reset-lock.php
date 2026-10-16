<?php
/**
 * Plugin Name: SSSIHMS — Admin Reset Lock and Username Hiding
 * Description: Network-wide. No password-reset emails for administrators, and no page
 *              reveals a login name through ?author=N or author archives.
 *
 * Added 16-Oct-2026 after 132 password-reset requests (mostly 15-Oct-2026, from a handful of
 * IPs) against the network's first admin account, whose login /?author=1 handed out on every
 * site except Whitefield. A reset link only reaches the account's own inbox, so the requests
 * were noise rather than a breach, but each one mailed the Director's office.
 *
 * Admin resets: the lost-password form answers as if it had sent the email and sends nothing,
 * so the form does not reveal which usernames are admins. A locked-out admin is reset from the
 * server with WP-CLI (`wp user update <login> --user_pass=...`), which 2FA does not affect.
 * Uses sssihms_2fa_is_admin_anywhere() from sssihms-admin-two-factor.php — keep both installed.
 */

defined( 'ABSPATH' ) || exit;

function sssihms_reset_lock_applies( $user ) {
	return $user instanceof WP_User && function_exists( 'sssihms_2fa_is_admin_anywhere' )
		&& sssihms_2fa_is_admin_anywhere( $user );
}

/** Backstop for every reset path (lost-password form, "Send password reset" in Users). */
add_filter( 'allow_password_reset', function ( $allow, $user_id ) {
	return sssihms_reset_lock_applies( get_userdata( $user_id ) ) ? false : $allow;
}, 10, 2 );

/** The form: same "check your email" screen as a real reset, no email sent. */
add_action( 'lostpassword_post', function ( $errors, $user ) {
	if ( sssihms_reset_lock_applies( $user ) ) {
		wp_safe_redirect( wp_login_url() . '?checkemail=confirm' );
		exit;
	}
}, 10, 2 );

/**
 * Username hiding on every site of the network (Whitefield already had this in
 * sssihms-wfd-patient-access.php; this covers the rest). ?author=N and author archives go to
 * the home page, and author links point there too.
 */
add_action( 'template_redirect', function () {
	if ( ! is_admin() && ( isset( $_GET['author'] ) || is_author() ) ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}, 1 );

add_filter( 'author_link', function () {
	return home_url( '/' );
} );
