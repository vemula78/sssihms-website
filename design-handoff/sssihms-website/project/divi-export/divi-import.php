<?php
/**
 * SSSIHMS — Divi layout importer (run via WP-CLI on the VM)
 *
 *   sudo -u www-data wp --path=/srv/www/wordpress eval-file divi-import.php /tmp/divi-export
 *
 * Reads every *.json Divi layout in the given directory and creates (or
 * updates) a matching WordPress Page with the Divi Builder enabled. Idempotent:
 * re-running updates existing pages by slug instead of duplicating them.
 *
 * header.json / footer.json are skipped on purpose — those belong in
 * Divi -> Theme Builder and are imported there via the browser (Portability).
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	fwrite( STDERR, "This script must be run with: wp eval-file divi-import.php <json-dir>\n" );
	exit( 1 );
}

$dir = isset( $args[0] ) ? rtrim( $args[0], '/' ) : '/tmp/divi-export';

// Optional 2nd arg: import ONLY this slug (e.g. "blog"). Omit to import all.
$only = isset( $args[1] ) ? $args[1] : '';

if ( ! is_dir( $dir ) ) {
	WP_CLI::error( "Directory not found: $dir" );
}

/* slug => human page title. Anything not listed falls back to a title-cased slug. */
$titles = array(
	'about'          => 'About SSSIHMS',
	'philosophy'     => 'Our Philosophy',
	'genesis'        => 'Genesis',
	'statistics'     => 'Statistics',
	'patient-speak'  => 'Patient Speak',
	'visitor-speak'  => 'Visitor Speak',
	'departments'    => 'Departments',
	'cardiology'     => 'Cardiology',
	'cardiac-surgery'=> 'Cardiac Surgery',
	'neurosurgery'   => 'Neurosurgery',
	'neurology'      => 'Neurology',
	'anesthesiology' => 'Anaesthesiology',
	'radiology'      => 'Radiology',
	'sssgh'          => 'Sri Sathya Sai General Hospital',
	'services'       => 'Clinical Support Services',
	'patients'       => 'For Patients',
	'treatments'     => 'Treatments',
	'appointments'   => 'Appointments',
	'helpdesk'       => 'Help Desk',
	'facilities'     => 'Facilities',
	'academics'      => 'Academics',
	'dnb'            => 'DNB Programmes',
	'fellowship'     => 'Fellowships',
	'nursing'        => 'Nursing',
	'involved'       => 'Get Involved',
	'sevadal'        => 'Sevadal',
	'volunteer'      => 'Volunteer',
	'bhagawan'       => 'Bhagawan Sri Sathya Sai Baba',
	'gogreen'        => 'Go Green',
	'careers'        => 'Careers',
	'manohriday'     => 'Manohriday',
	'trust'          => 'The Trust',
	'songs'          => 'Songs &amp; Bhajans',
	'blog'           => 'Blog',
);

$skip  = array( 'header', 'footer' );  // Theme Builder — import via browser

$files = glob( $dir . '/*.json' );
if ( empty( $files ) ) {
	WP_CLI::error( "No .json layouts found in $dir" );
}

WP_CLI::log( 'Importing ' . count( $files ) . " layout file(s) from $dir\n" );

$created = 0;
$updated = 0;
$skipped = 0;

foreach ( $files as $file ) {
	$slug = basename( $file, '.json' );

	if ( $only !== '' && $slug !== $only ) {
		continue; // single-page mode: skip everything except the requested slug
	}

	if ( in_array( $slug, $skip, true ) ) {
		WP_CLI::log( "  •  skip   $slug.json  (import via Divi -> Theme Builder)" );
		$skipped++;
		continue;
	}

	$raw  = file_get_contents( $file );
	$data = json_decode( $raw, true );

	if ( empty( $data['data'] ) || ! is_array( $data['data'] ) ) {
		WP_CLI::warning( "  !  bad layout JSON, skipping: $slug.json" );
		continue;
	}

	$content  = reset( $data['data'] ); // the Divi shortcode string
	$title    = ( $slug === 'home' ) ? 'Home' : ( isset( $titles[ $slug ] ) ? $titles[ $slug ] : ucwords( str_replace( '-', ' ', $slug ) ) );

	$existing = get_page_by_path( $slug, OBJECT, 'page' );

	$postarr = array(
		'post_title'   => $title,
		'post_name'    => $slug,
		'post_status'  => 'publish',
		'post_type'    => 'page',
		'post_content' => $content,
	);

	if ( $existing ) {
		$postarr['ID'] = $existing->ID;
		$id            = wp_update_post( $postarr, true );
	} else {
		$id = wp_insert_post( $postarr, true );
	}

	if ( is_wp_error( $id ) ) {
		WP_CLI::warning( "  !  $slug: " . $id->get_error_message() );
		continue;
	}

	// Tell Divi this page is built with the Builder.
	update_post_meta( $id, '_et_pb_use_builder', 'on' );
	update_post_meta( $id, '_et_pb_built_for_post_type', 'page' );
	update_post_meta( $id, '_et_builder_version', 'VB|Divi|4.27.0' );
	update_post_meta( $id, '_et_pb_show_page_creation', 'off' );

	if ( $existing ) {
		WP_CLI::log( "  ↻  update /$slug/   #$id   $title" );
		$updated++;
	} else {
		WP_CLI::log( "  ＋  create /$slug/   #$id   $title" );
		$created++;
	}
}

WP_CLI::success( "Created $created, updated $updated, skipped $skipped." );
WP_CLI::log( "Front page NOT changed — set it manually under Settings -> Reading when ready." );
WP_CLI::log( "Header & footer: import header.json / footer.json via Divi -> Theme Builder (browser)." );
