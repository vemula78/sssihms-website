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
 *
 * SAFETY (added 18-Sep-2026). This importer originally wrote post_status=publish
 * unconditionally, which on this live site would have republished 67 existing pages
 * straight to the public, forced 3 private pages public, and created 50 new pages
 * already published. It now:
 *   - creates new pages as DRAFT (override with SSSIHMS_IMPORT_STATUS=publish)
 *   - NEVER changes the status of a page that already exists
 *   - maps redesign slugs onto the live URLs they belong to, instead of creating
 *     a duplicate page at the new slug (see $aliases)
 *   - supports DRY RUN: set SSSIHMS_IMPORT_DRYRUN=1 to report and change nothing
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	fwrite( STDERR, "This script must be run with: wp eval-file divi-import.php <json-dir>\n" );
	exit( 1 );
}

$dir = isset( $args[0] ) ? rtrim( $args[0], '/' ) : '/tmp/divi-export';

// Optional 2nd arg: import ONLY these slugs — one, or a comma-separated batch
// (e.g. "blog" or "blog,careers,trust"). Omit to import all.
$only = isset( $args[1] ) ? array_filter( array_map( 'trim', explode( ',', $args[1] ) ) ) : array();

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
	'statistics-combined' => 'Combined Hospital &mdash; Statistics',
);

$skip  = array( 'header', 'footer', 'gg-biomedical' );
// header/footer: Theme Builder, import via browser.
// gg-biomedical: the Go Green biomedical page is the BMW plugin's own dashboard
// (/biomedical-waste-management/, page 54788, shortcode [bmw_public_disclosure]).
// Importing the static layout would create a duplicate that shows stale figures,
// so the sub-nav now links to the live plugin page instead.

/*
 * Redesign slug => the LIVE page id it should update.
 * Praveen's decision (18-Sep-2026): keep the live URLs, so these must NOT create
 * new pages at the redesign slug. Verified against the live site by REST.
 */
$aliases = array(
	'anes-infrastructure'     => 677,    // anesthesiology-infrastructure
	'blood-donation'          => 52021,  // blood-donation-information
	'cardiology-achievements' => 663,    // achievements-cardiology  (private)
	'cardiology-events'       => 713,    // events-cardiology-2
	'gg-power'                => 52973,  // power-conservation
	'gg-rainwater'            => 52712,  // rain-water-harvesting
	'gg-solar'                => 52658,  // solar-power-plant
	'gg-trees'                => 52721,  // tree-transplantation
	'gg-waste'                => 52680,  // wastemgmt
	'gg-water'                => 52966,  // water-usage
	'volunteer'               => 52990,  // volunteer-expertise
	'songs'                   => 53061,  // poems  -- CONFIRM: titles differ

	// Nested pages the flat get_page_by_path() lookup could never see (added 18-Sep-2026
	// after it silently created duplicates at the site root for three of them).
	'anesthesiology'           => 89,   // /anesthesiology1/
	'cardiology-faculty'       => 108,  // /cardiology/faculty/
	'cardiology-infrastructure'=> 104,  // /cardiology/infrastructure/
	'ctvs-faculty'             => 116,  // /cardiac-surgery/faculty/
	'ctvs-infrastructure'      => 112,  // /cardiac-surgery/infrastructure/
	'nesu-achievements'        => 669,  // /neurosurgery/neurosurgery-achievements/
	'nesu-infrastructure'      => 122,  // /neurosurgery/infrastructure/
	'neurology'                => 83,
	'radiology'                => 202,  // /radiology1/
	'radiology-infrastructure' => 218,  // /radiology1/infrastructure/
	'nursing-and-allied-health'=> 259,  // /academics/nursing-and-allied-health/
	'bhagawan'                 => 609,
	'pediatrics'               => 53296, // /sssgh/pediatrics/

	// Renames, not new pages: the pack's slug differs from the live one, so without
	// these the importer would create a second copy alongside a page already in the menu.
	// 'patients': #1316 looked like the live page but is a custom nav_menu_item pointing
	// at /conditions-treatment/; there is no page at /for-patients/ (404). Created new.
	'blog'                     => 1458,  // /sssihms-blog/
	// 'statistics-combined' had been aliased to 53091, but #53091 (/statistics/) is the
	// Statistics LANDING page, which the pack supplies as statistics.json. The combined
	// dashboard is the eleventh department dashboard, sibling to cardiology-statistics
	// (#54908) etc., and had no live page — aliasing both files to #53091 meant whichever
	// imported second silently destroyed the other. It now gets its own page.
	// home.json is built by scripts/make-home-json.py from dist/index.html (the design
	// pass never exported it, because in the prototype the home page is index.html).
	// Without this alias the slug "home" matches #37, which is the CURRENT live front
	// page — the redesign belongs in the draft, #54830, which then becomes the front page.
	'home'                     => 54830, // "Home — Divi Draft (Sacred Warmth redesign)"

	// /achievements-ctvs/ existed only as an empty 2015 placeholder; the page is built
	// from published departmental material rather than restored. Alias, not create, so
	// the existing URL and its history are kept.
	'ctvs-achievements'        => 590,   // /achievements-ctvs/

	'fellowship'               => 255,   // /academics/fellowship/ — confirmed 18-Sep-2026;
	                                     // #550 (private, under /radiology1/) is a different page.
	// 'gg-biomedical' deliberately absent: biomedical-waste-management (54788) is the
	// BMW plugin's own page. Do not overwrite a working app with content.
);

$new_status = getenv( 'SSSIHMS_IMPORT_STATUS' ) ?: 'draft';
$dry        = (bool) getenv( 'SSSIHMS_IMPORT_DRYRUN' );
/*
 * Creating a page is now opt-in. Silent creation is what produced three root-level
 * duplicates of pages that already existed further down the tree.
 */
$allow_create = (bool) getenv( 'SSSIHMS_IMPORT_CREATE' );
if ( $dry ) {
	WP_CLI::log( "DRY RUN — nothing will be written.\n" );
}

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

	if ( $only && ! in_array( $slug, $only, true ) ) {
		continue; // batch mode: skip everything except the requested slugs
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

	if ( isset( $aliases[ $slug ] ) ) {
		$existing = get_post( $aliases[ $slug ] );
		if ( ! $existing || 'page' !== $existing->post_type ) {
			WP_CLI::warning( "  !  $slug: alias target {$aliases[$slug]} is not a page, skipping" );
			continue;
		}
	} else {
		/*
		 * Match on post_name across EVERY parent, not just the site root.
		 * get_page_by_path( $slug ) only ever sees top-level pages, so a nested page
		 * such as /academics/nursing-and-allied-health/ looked unmatched and a duplicate
		 * was created at the root. Ambiguity is never resolved by guessing: if two pages
		 * share the slug the import stops for that page and asks for an explicit alias.
		 */
		$matches = get_posts( array(
			'post_type'        => 'page',
			'name'             => $slug,
			'post_status'      => array( 'publish', 'private', 'draft', 'pending', 'future' ),
			'numberposts'      => -1,
			'suppress_filters' => true,
		) );

		if ( count( $matches ) > 1 ) {
			$where = array();
			foreach ( $matches as $m ) {
				$where[] = sprintf( '#%d (parent %d, %s)', $m->ID, $m->post_parent, $m->post_status );
			}
			WP_CLI::warning( sprintf(
				"  !  %s: %d pages share this slug — %s. Add an explicit alias; nothing written.",
				$slug, count( $matches ), implode( ', ', $where )
			) );
			$skipped++;
			continue;
		}

		$existing = $matches ? $matches[0] : null;

		if ( ! $existing && ! $allow_create ) {
			WP_CLI::warning( "  !  $slug: no live page matches this slug. Re-run with SSSIHMS_IMPORT_CREATE=1 to create it, or add an alias." );
			$skipped++;
			continue;
		}
	}

	$postarr = array(
		'post_title'   => $title,
		'post_type'    => 'page',
		'post_content' => $content,
	);

	if ( $existing ) {
		// Keep the live URL and the live visibility. Only the layout changes.
		$postarr['ID']          = $existing->ID;
		$postarr['post_name']   = $existing->post_name;
		$postarr['post_title']  = $existing->post_title;
		$postarr['post_status'] = $existing->post_status;
	} else {
		$postarr['post_name']   = $slug;
		$postarr['post_status'] = $new_status;
	}

	if ( $dry ) {
		$what = $existing
			? "would UPDATE /{$existing->post_name}/  #{$existing->ID}  (stays {$existing->post_status})"
			: "would CREATE /$slug/  as $new_status";
		WP_CLI::log( "  ·  $what" );
		$existing ? $updated++ : $created++;
		continue;
	}

	/*
	 * 137 pages still carry _wp_page_template = page-template-fullwidth.php, which belongs
	 * to the inactive Extra theme. wp_update_post() re-validates that field and rejects the
	 * update with "Invalid page template". WordPress already ignores the dead value when
	 * rendering (it falls back to page.php), so we pass 'default' to satisfy validation and
	 * then write the original meta back untouched — the page keeps exactly the meta it had.
	 */
	$orig_tpl = $existing ? get_post_meta( $existing->ID, '_wp_page_template', true ) : '';
	if ( $existing ) {
		$valid = wp_get_theme()->get_page_templates( null, 'page' );
		if ( $orig_tpl && 'default' !== $orig_tpl && ! isset( $valid[ $orig_tpl ] ) ) {
			$postarr['page_template'] = 'default';
		}
	}

	$id = $existing ? wp_update_post( $postarr, true ) : wp_insert_post( $postarr, true );

	if ( $existing && ! is_wp_error( $id ) && isset( $postarr['page_template'] ) ) {
		update_post_meta( $id, '_wp_page_template', $orig_tpl ); // restore verbatim
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

	/*
	 * Divi caches each page's compiled CSS under wp-content/et-cache/<net>/<site>/<id>/,
	 * keyed by module index (.et_pb_text_0 and friends). Left in place, the OLD page's
	 * rules land on the NEW page's modules — a cyan block turned up mid-page on /dental/
	 * this way. Divi's own remove_static_resources() reported success without deleting
	 * anything, so remove the files directly.
	 */
	$cache = WP_CONTENT_DIR . '/et-cache';
	foreach ( glob( $cache . '/*/*/' . $id . '/*.css' ) ?: array() as $css ) {
		@unlink( $css );
	}
	foreach ( glob( $cache . '/' . $id . '/*.css' ) ?: array() as $css ) {
		@unlink( $css );
	}

	if ( $existing ) {
		WP_CLI::log( "  ↻  update /{$existing->post_name}/   #$id   ({$existing->post_status})" );
		$updated++;
	} else {
		WP_CLI::log( "  ＋  create /$slug/   #$id   $title   [$new_status]" );
		$created++;
	}
}

WP_CLI::success( "Created $created, updated $updated, skipped $skipped." );
WP_CLI::log( "Front page NOT changed — set it manually under Settings -> Reading when ready." );
WP_CLI::log( "Header & footer: import header.json / footer.json via Divi -> Theme Builder (browser)." );
