<?php
/** Repair dead-host asset URLs inside serialized options. Dry run unless SSSIHMS_APPLY=1. */
$apply = getenv( 'SSSIHMS_APPLY' ) === '1';
$rules = array(
	'http://52.148.87.145.in.md-in-25.webhostbox.net/wfd/wp-content/uploads/' => 'https://whitefield.sssihms.org/wp-content/uploads/sites/4/',
	'http://52.148.87.145.in.md-in-25.webhostbox.net/wfd'                     => 'https://whitefield.sssihms.org',
);

function sssihms_walk_urls( $v, $rules, &$hits ) {
	if ( is_string( $v ) ) {
		$o = $v;
		foreach ( $rules as $from => $to ) {
			$v = str_replace( $from, $to, $v );
		}
		if ( $o !== $v ) { $hits++; }
		return $v;
	}
	if ( is_array( $v ) ) {
		foreach ( $v as $k => $i ) { $v[ $k ] = sssihms_walk_urls( $i, $rules, $hits ); }
		return $v;
	}
	if ( is_object( $v ) ) {
		foreach ( get_object_vars( $v ) as $k => $i ) { $v->$k = sssihms_walk_urls( $i, $rules, $hits ); }
		return $v;
	}
	return $v;
}

foreach ( array( 'theme_mods_Divi' ) as $name ) {
	$val  = get_option( $name, null );
	if ( null === $val ) { echo "$name MISSING\n"; continue; }
	$hits = 0;
	$new  = sssihms_walk_urls( $val, $rules, $hits );
	echo str_pad( $name, 20 ), " hits=$hits keys=", ( is_array( $new ) ? count( $new ) : 0 );
	if ( $hits && $apply ) {
		update_option( $name, $new );
		$c = wp_json_encode( get_option( $name ) );
		echo ' — applied, remaining=', substr_count( $c, 'md-in-25' );
	}
	echo "\n";
	if ( is_array( $new ) && isset( $new['background_image'] ) ) {
		echo "  background_image = ", $new['background_image'], "\n";
	}
}
