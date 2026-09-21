<?php
/**
 * Repair the @52.148.87.145.in -> @sssihms.org.in domain inside serialized options.
 * Walks the unserialized structure and lets WP re-serialize, so byte-length
 * prefixes are rebuilt rather than left stale.
 *
 * Dry run unless SSSIHMS_APPLY=1 is set in the environment.
 */

$bad   = '@52.148.87.145.in';
$good  = '@sssihms.org.in';
$apply = getenv( 'SSSIHMS_APPLY' ) === '1';

$targets = array(
	'_caldera_forms',
	'CF5667d73741237',
	'postman_options',
	'wp_mail_smtp',
	'itsec-storage',
	'auto_core_update_notified',
);

function sssihms_walk( $v, $bad, $good, &$hits ) {
	if ( is_string( $v ) ) {
		if ( false !== strpos( $v, $bad ) ) {
			$hits++;
			return str_replace( $bad, $good, $v );
		}
		return $v;
	}
	if ( is_array( $v ) ) {
		foreach ( $v as $k => $item ) {
			$v[ $k ] = sssihms_walk( $item, $bad, $good, $hits );
		}
		return $v;
	}
	if ( is_object( $v ) ) {
		foreach ( get_object_vars( $v ) as $k => $item ) {
			$v->$k = sssihms_walk( $item, $bad, $good, $hits );
		}
		return $v;
	}
	return $v;
}

echo $apply ? "=== APPLYING ===\n" : "=== DRY RUN (set SSSIHMS_APPLY=1 to write) ===\n";

foreach ( $targets as $name ) {
	$val = get_option( $name, null );
	if ( null === $val ) {
		echo str_pad( $name, 28 ), " MISSING\n";
		continue;
	}
	$hits = 0;
	$new  = sssihms_walk( $val, $bad, $good, $hits );

	if ( 0 === $hits ) {
		echo str_pad( $name, 28 ), " no change\n";
		continue;
	}

	// Prove the new value survives a serialize/unserialize round-trip before writing.
	$round = @unserialize( serialize( $new ) );
	if ( false === $round && serialize( $new ) !== serialize( false ) ) {
		echo str_pad( $name, 28 ), " REFUSED — failed round-trip\n";
		continue;
	}

	if ( $apply ) {
		update_option( $name, $new );
		$check = get_option( $name );
		$ok    = false === strpos( wp_json_encode( $check ), '52.148.87.145' );
		echo str_pad( $name, 28 ), " {$hits} string(s) fixed — verified: ", ( $ok ? 'yes' : 'NO' ), "\n";
	} else {
		echo str_pad( $name, 28 ), " {$hits} string(s) would change\n";
	}
}
