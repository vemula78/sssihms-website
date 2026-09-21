<?php
/**
 * Plugin Name: SSSIHMS Whitefield — Patient Access
 * Description: Patient-facing usability fixes for whitefield.sssihms.org (blog 4):
 *              restores pinch-zoom, turns helpline numbers into tap-to-call links,
 *              and adds a sticky mobile "Call Help Desk" bar.
 * Author:      SSSIHMS Web
 * Version:     1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Only ever act on the Whitefield site. */
function sssihms_wfd_is_target() {
	return function_exists( 'get_current_blog_id' ) && 4 === (int) get_current_blog_id();
}

/**
 * WCAG 1.4.4 — Divi hard-codes maximum-scale=1.0,user-scalable=0, which blocks
 * pinch-zoom. Many of our patients are elderly. Replace it with a zoomable one.
 */
function sssihms_wfd_viewport() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	remove_action( 'wp_head', 'et_add_viewport_meta' );
	add_action(
		'wp_head',
		function () {
			echo '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' . "\n";
		},
		1
	);
}
add_action( 'wp', 'sssihms_wfd_viewport' );

/** The verified hospital numbers, longest first so 4710 4600 wins over 4710. */
function sssihms_wfd_numbers() {
	return array(
		'+918047104600' => array( '+91-80-4710-4600', '+91 80 4710 4600', '080 47104600', '080-47104600', '08047104600' ),
		'+918028004600' => array( '+91-80-2800-4600', '+91 80 2800 4600', '080 2800 4600', '080-2800-4600', '+91-80-28004600' ),
		'+918296004600' => array( '+91-829600-4600', '+91-82-9600-4600', '+91 82 9600 4600' ),
		'+918028004763' => array( '080 28004763', '080-28004763' ),
		'+918028004640' => array( '080 2800 4640', '080-2800-4640' ),
		'+918028004641' => array( '080 2800 4641', '080-2800-4641' ),
	);
}

/**
 * Wrap plain-text helpline numbers in tel: links.
 * Splits on existing tags/anchors so we never nest a link or rewrite an attribute.
 */
function sssihms_wfd_linkify_phones( $content ) {
	if ( ! sssihms_wfd_is_target() || is_admin() || '' === trim( (string) $content ) ) {
		return $content;
	}

	$map = array();
	foreach ( sssihms_wfd_numbers() as $tel => $forms ) {
		foreach ( $forms as $form ) {
			$map[ $form ] = $tel;
		}
	}
	// Longest literal first, so partial forms don't win.
	uksort(
		$map,
		function ( $a, $b ) {
			return strlen( $b ) - strlen( $a );
		}
	);

	// Split into tags and text; only touch text, and skip anything inside <a>.
	$parts     = preg_split( '/(<[^>]+>)/', $content, -1, PREG_SPLIT_DELIM_CAPTURE );
	$in_anchor = 0;
	$out       = '';

	foreach ( $parts as $part ) {
		if ( '' === $part ) {
			continue;
		}
		if ( '<' === $part[0] ) {
			if ( preg_match( '/^<a[\s>]/i', $part ) ) {
				$in_anchor++;
			} elseif ( preg_match( '#^</a\s*>#i', $part ) && $in_anchor > 0 ) {
				$in_anchor--;
			}
			$out .= $part;
			continue;
		}
		if ( $in_anchor > 0 ) {
			$out .= $part;
			continue;
		}
		foreach ( $map as $literal => $tel ) {
			if ( false === strpos( $part, $literal ) ) {
				continue;
			}
			$part = str_replace(
				$literal,
				'<a href="tel:' . $tel . '" class="sssihms-tel">' . $literal . '</a>',
				$part
			);
		}
		$out .= $part;
	}

	return $out;
}
add_filter( 'the_content', 'sssihms_wfd_linkify_phones', 20 );

/**
 * Sticky tap-to-call bar on phones. Calling the Help Desk is the only way to get
 * an OPD appointment, so it should never be more than one tap away.
 */
function sssihms_wfd_call_bar() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	?>
<style id="sssihms-call-bar-css">
.sssihms-callbar{display:none}
@media (max-width:980px){
 .sssihms-callbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:99999;
  background:#a8631f;box-shadow:0 -2px 14px rgba(0,0,0,.28)}
 .sssihms-callbar a{flex:1;display:flex;align-items:center;justify-content:center;gap:9px;
  padding:14px 10px;color:#fff;font-family:"Nunito Sans",sans-serif;font-size:16px;font-weight:700;
  text-decoration:none;line-height:1.2;min-height:48px}
 .sssihms-callbar a+a{border-left:1px solid rgba(255,255,255,.28);flex:0 0 42%}
 .sssihms-callbar small{display:block;font-size:11px;font-weight:600;opacity:.82}
 body{padding-bottom:64px}
 #main-footer{margin-bottom:0}
}
@media print{.sssihms-callbar{display:none!important}}
</style>
<div class="sssihms-callbar" role="region" aria-label="Contact the hospital">
 <a href="tel:+918047104600" aria-label="Call the Patient Help Desk on +91 80 4710 4600">
  <span aria-hidden="true">&#9742;</span>
  <span>Call Help Desk<small>10 AM &ndash; 4 PM, Mon&ndash;Fri</small></span>
 </a>
 <a href="/contact-us/"><span>Contact &amp; Directions</span></a>
</div>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_call_bar', 99 );

/**
 * People type these looking for the Contact page; they 404 today.
 */
function sssihms_wfd_contact_aliases() {
	if ( ! sssihms_wfd_is_target() || ! is_404() ) {
		return;
	}
	$path    = trim( parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' );
	$aliases = array( 'reach-us', 'directions', 'how-to-reach', 'contact-us-2', 'enquiry' );
	if ( in_array( $path, $aliases, true ) ) {
		wp_safe_redirect( home_url( '/contact-us/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'sssihms_wfd_contact_aliases' );

/**
 * Hospital schema. Google builds the map/knowledge card from this — the card
 * carrying the call button and directions that patients actually tap. Divi and
 * Yoast emit only WebPage/BreadcrumbList, which cannot carry an address or phone.
 *
 * Every value here is taken from the hospital's own published pages.
 */
function sssihms_wfd_hospital_schema() {
	if ( ! sssihms_wfd_is_target() || ! is_front_page() ) {
		return;
	}

	$schema = array(
		'@context'            => 'https://schema.org',
		'@type'               => 'Hospital',
		'@id'                 => home_url( '/#hospital' ),
		'name'                => 'Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield',
		'alternateName'       => array( 'SSSIHMS Whitefield', 'Sri Sathya Sai Super Speciality Hospital, Whitefield' ),
		'url'                 => home_url( '/' ),
		'description'         => 'A charitable tertiary care hospital in Whitefield, Bengaluru, providing cardiology, cardiac surgery, neurosurgery and multi-specialty care entirely free of charge, regardless of caste, creed, religion or means.',
		'isAcceptingNewPatients' => true,
		'priceRange'          => 'Free',
		'address'             => array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => 'EPIP Area, Whitefield',
			'addressLocality' => 'Bengaluru',
			'addressRegion'   => 'Karnataka',
			'postalCode'      => '560066',
			'addressCountry'  => 'IN',
		),
		'geo'                 => array(
			'@type'     => 'GeoCoordinates',
			'latitude'  => '12.9810778',
			'longitude' => '77.7292023',
		),
		'telephone'           => '+91-80-4710-4600',
		'email'               => 'helpdeskblr@sssihms.org.in',
		'contactPoint'        => array(
			array(
				'@type'             => 'ContactPoint',
				'contactType'       => 'Patient Help Desk',
				'telephone'         => '+91-80-4710-4600',
				'email'             => 'helpdeskblr@sssihms.org.in',
				'availableLanguage' => array( 'en', 'kn', 'hi', 'te', 'ta' ),
			),
			array(
				'@type'       => 'ContactPoint',
				'contactType' => 'General Enquiries',
				'telephone'   => '+91-80-2800-4600',
			),
		),
		'openingHoursSpecification' => array(
			array(
				'@type'     => 'OpeningHoursSpecification',
				'dayOfWeek' => array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ),
				'opens'     => '10:00',
				'closes'    => '16:00',
				'description' => 'Patient Help Desk, for appointments and enquiries',
			),
		),
		'availableService'    => array(
			array( '@type' => 'MedicalProcedure', 'name' => 'Cardiac catheterisation and interventional cardiology' ),
			array( '@type' => 'MedicalProcedure', 'name' => 'Cardiothoracic and vascular surgery' ),
			array( '@type' => 'MedicalProcedure', 'name' => 'Neurosurgery' ),
		),
		'medicalSpecialty'    => array( 'Cardiovascular', 'CardiovascularSurgery', 'Neurologic' ),
		'parentOrganization'  => array(
			'@type' => 'Organization',
			'name'  => 'Sri Sathya Sai Central Trust',
		),
	);

	echo '<script type="application/ld+json">',
		wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ),
		'</script>', "\n";
}
add_action( 'wp_head', 'sssihms_wfd_hospital_schema', 20 );
