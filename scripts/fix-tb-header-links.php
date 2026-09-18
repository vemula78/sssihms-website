<?php
/**
 * The Theme Builder header (#54939) top bar carries two links, and "Blog" points at
 * /blog — a 404 on every page of the site, because the live blog lives at
 * /sssihms-blog/ (#1458). Same class of bug as the footer: the layout kept the
 * prototype's slug instead of the live permalink.
 *
 * The Telemedicine link is left pointing at /help-desk/: that is what the approved
 * design does (its top-bar button navigates to 'help-desk', and the For Patients menu
 * calls the page "Help Desk / Telemedicine"), so it is intentional, not a stale slug.
 * Only the trailing slash is added, to save a redirect.
 */
$id = 54939;
$post = get_post( $id );
if ( ! $post ) { WP_CLI::error( 'header layout #' . $id . ' not found' ); }
$c = $orig = $post->post_content;

$c = str_replace( 'href="/blog"', 'href="/sssihms-blog/"', $c );
$c = str_replace( 'href="/help-desk"', 'href="/help-desk/"', $c );

if ( $c === $orig ) { WP_CLI::log( 'no change needed' ); return; }
$r = wp_update_post( array( 'ID' => $id, 'post_content' => $c ), true );
if ( is_wp_error( $r ) ) { WP_CLI::error( $r->get_error_message() ); }
WP_CLI::success( 'header updated' );
foreach ( (array) glob( WP_CONTENT_DIR . '/et-cache/*/*/*/*.css' ) as $f ) { @unlink( $f ); }
