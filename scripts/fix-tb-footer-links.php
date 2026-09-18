<?php
/**
 * The Theme Builder footer (layout #54940) appears on every page and links by the
 * prototype's slugs rather than the live permalinks. WordPress's fuzzy slug matching
 * hid this by 200-ing every one of them, but three landed on the wrong page entirely:
 *
 *   /neurology       -> /sssihms-blog/neurology-blog/
 *   /anesthesiology  -> /sssihms-blog/anesthesiology-blog/
 *   /radiology       -> /radiology-blog/
 *
 * ...i.e. the footer's "Departments" column sent visitors to blog listings. Five more
 * pointed at the site root for pages that actually live under /about-hospital/.
 *
 * Neurology is dropped rather than repointed: the department is temporarily closed and
 * all three of its pages are private, which is why its header menu items and the cards
 * on / and /specialties/ were already removed.
 *
 * Idempotent: each replacement only fires if the old href is still there.
 */

$id   = 54940;
$post = get_post( $id );
if ( ! $post ) { WP_CLI::error( 'footer layout #' . $id . ' not found' ); }
$c = $orig = $post->post_content;

$map = array(
	'/about-hospital'        => '/about-hospital/',
	'/academics'             => '/academics/',
	'/anesthesiology'        => '/anesthesiology1/',
	'/appointments-admission'=> '/appointments-admission/',
	'/bhagawan'              => '/about-hospital/bhagawan/',
	'/cardiac-surgery'       => '/cardiac-surgery/',
	'/cardiology'            => '/cardiology/',
	'/careers'               => '/careers/',
	'/genesis'               => '/about-hospital/genesis/',
	'/getinvolved'           => '/getinvolved/',
	'/gogreen'               => '/gogreen/',
	'/guiding-philosophy'    => '/guiding-philosophy/',
	'/manohriday'            => '/about-hospital/manohriday/',
	'/neurosurgery'          => '/neurosurgery/',
	'/patient-speak'         => '/about-hospital/patient-speak/',
	'/radiology'             => '/radiology1/',
	'/visitor-speak'         => '/about-hospital/visitor-speak/',
);

// Drop the Neurology link and the <br> that separates it from the next department.
$before = $c;
$c = preg_replace( '#<a href="/neurology"[^>]*>Neurology</a>(<br\s*/?>)?#i', '', $c );
WP_CLI::log( $before === $c ? '  = Neurology link already gone' : '  - removed the Neurology link' );

// Longest href first, so /cardiac-surgery is not eaten by /cardiology's shorter prefix.
uksort( $map, function ( $a, $b ) { return strlen( $b ) - strlen( $a ); } );
foreach ( $map as $from => $to ) {
	$n = 0;
	$c = str_replace( 'href="' . $from . '"', 'href="' . $to . '"', $c, $n );
	if ( $n ) { WP_CLI::log( sprintf( '  %s -> %s (%d)', $from, $to, $n ) ); }
}

$left = array();
if ( preg_match_all( '#href="(/[a-z0-9/-]*)"#i', $c, $m ) ) {
	foreach ( $m[1] as $h ) { if ( '/' !== substr( $h, -1 ) ) { $left[] = $h; } }
}
if ( $left ) { WP_CLI::warning( 'still unslashed: ' . implode( ', ', array_unique( $left ) ) ); }

if ( $c === $orig ) { WP_CLI::log( 'no change needed' ); return; }

$r = wp_update_post( array( 'ID' => $id, 'post_content' => $c ), true );
if ( is_wp_error( $r ) ) { WP_CLI::error( $r->get_error_message() ); }
WP_CLI::success( 'footer updated (' . strlen( $orig ) . ' -> ' . strlen( $c ) . ' bytes)' );

$n = 0;
foreach ( (array) glob( WP_CONTENT_DIR . '/et-cache/*/*/*/*.css' ) as $f ) { @unlink( $f ); $n++; }
WP_CLI::log( 'cleared ' . $n . ' cached css files' );
