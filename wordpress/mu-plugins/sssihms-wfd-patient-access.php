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
 * Department tab strips (32 pages) link to the statistics pages, which are private while
 * they are revised (16-Oct-2026). Visitors who cannot read the target get no tab instead of
 * a 404; the tabs come back by themselves when the pages are published again.
 */
function sssihms_wfd_hide_private_stats_tabs( $content ) {
	if ( ! sssihms_wfd_is_target() || is_admin() || false === strpos( (string) $content, 'subnav-link' ) || false === stripos( $content, 'statistic' ) ) {
		return $content;
	}
	return preg_replace_callback(
		'#<a\b[^>]*\bclass="subnav-link"[^>]*>.*?</a>#is',
		function ( $m ) {
			if ( ! preg_match( '#href="([^"]*statistic[^"]*)"#i', $m[0], $h ) ) {
				return $m[0];
			}
			$id = url_to_postid( $h[1] );
			if ( $id && ( 'publish' === get_post_status( $id ) || current_user_can( 'read_post', $id ) ) ) {
				return $m[0];
			}
			return '';
		},
		$content
	);
}
add_filter( 'the_content', 'sssihms_wfd_hide_private_stats_tabs', 21 );

/**
 * List markers (17-Oct-2026, external heuristic review F10). Pages mark every list item with
 * a "✓", including warnings ("do not pay anyone") and unsolved problems, which reads as
 * "done". page.css draws a neutral dot in .feature-tick instead; this drops the glyph so
 * screen readers do not announce "check mark" either.
 */
add_filter( 'the_content', function ( $content ) {
	if ( ! sssihms_wfd_is_target() || is_admin() ) {
		return $content;
	}
	return str_replace( '<span class="feature-tick">✓</span>', '<span class="feature-tick" aria-hidden="true"></span>', (string) $content );
}, 22 );

/**
 * Sticky tap-to-call bar on phones. Calling the Help Desk is the only way to get
 * an OPD appointment, so it should never be more than one tap away. Emergency sits
 * beside it (17-Oct-2026, external heuristic review F01): the header top bar scrolls away.
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
 .sssihms-callbar a{flex:1 1 0;display:flex;align-items:center;justify-content:center;gap:8px;
  padding:9px 6px;color:#fff;font-family:"Nunito Sans",sans-serif;font-size:15px;font-weight:700;
  text-decoration:none;line-height:1.2;min-height:52px;text-align:center}
 .sssihms-callbar a+a{border-left:1px solid rgba(255,255,255,.28)}
 .sssihms-callbar .cb-call{flex-grow:1.5}
 .sssihms-callbar .cb-em{background:#b3261e}
 .sssihms-callbar small{display:block;font-size:11px;font-weight:600;opacity:.85}
 body{padding-bottom:64px}
 #main-footer{margin-bottom:0}
}
@media (max-width:400px){.sssihms-callbar .cb-icon{display:none}.sssihms-callbar a{font-size:14px}}
@media print{.sssihms-callbar{display:none!important}}
</style>
<div class="sssihms-callbar" role="region" aria-label="Contact the hospital">
 <a class="cb-call" href="tel:+918047104600" aria-label="Call the Patient Help Desk on +91 80 4710 4600, 10 AM to 4 PM, Monday to Saturday">
  <span class="cb-icon" aria-hidden="true">&#9742;</span>
  <span>Call Help Desk<small>10 AM &ndash; 4 PM, Mon&ndash;Sat</small></span>
 </a>
 <a class="cb-em" href="/emergency/"><span>Emergency<small>Open 24/7</small></span></a>
 <a href="/contact-us/"><span>Contact<small>&amp; directions</small></span></a>
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
 * The old Opportunities page (1159) carried an undated vacancy notice and a Google Form that
 * HR withdrew (08-Oct-2026). Vacancies and the application form now live on /careers/.
 */
function sssihms_wfd_opportunities_redirect() {
	if ( ! sssihms_wfd_is_target() || is_admin() ) {
		return;
	}
	if ( 'opportunities' === trim( parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' ) ) {
		wp_safe_redirect( home_url( '/careers/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'sssihms_wfd_opportunities_redirect' );

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
				'dayOfWeek' => array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ),
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

/**
 * Accessibility pass (WCAG 2.1 AA).
 *
 * Contrast was measured against the palette in the shared page stylesheet:
 *   --primary #c8813a on paper = 3.00:1  — fails AA for text under 18.66px bold
 *   --primary-deep #a4581f on paper = 4.84:1 — passes
 * Elements on the dark panels keep --primary: there the lighter tone is the
 * one that passes (5.28:1 on #2c1a0e) and darkening would fail it.
 * So small text that used --primary is moved to --primary-deep. Large display
 * type (stat values, quote marks) stays on --primary: at 24px+ it only needs 3:1
 * and the lighter tone is part of the approved look.
 */
function sssihms_wfd_a11y_css() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	?>
<style id="sssihms-a11y">
/* 1. Contrast — small saffron text on light backgrounds */
/* 1a. Saffron text on light backgrounds. #c8813a is 2.90:1 on paper and fails
      at every text size; #96591a gives 5.17 on paper, 4.60 on --bg-alt, 5.48 on cards. */
.eyebrow,.spec-link,.btn-outline,.vm-label,.pat-card-btn{color:#96591a!important}
/* 1b. The dark panels are the opposite case: there the LIGHTER tone is the one
      that passes (5.28:1 on #2c1a0e), so it is restored inside them. */
.section-dark .eyebrow,.section-dark .btn-outline,.section-dark .spec-link,
.section-dark .quote-attr,.quote-attr{color:#c8813a!important}
/* 1c. White on solid saffron was 3.15:1. #a4581f lifts it to 5.26:1. */
.btn-primary,.free-pill,#sssi-s+button,.sssihms-callbar{background:#a4581f!important}
/* 1d. The pale pill takes ink, not saffron — saffron cannot reach 4.5 on #f0d5b0. */
.free-pill-sm{color:#2a1f14!important}
/* 1e. Muted body text was 4.28:1 on the alt background. */
.section-sub,.stat-lbl{color:#6e604c!important}
/* 1f. The admissions band is a saffron gradient. White body text over its light
      end was 3.15:1; starting the gradient at #a4581f lifts it to 5.26:1. */
.admit-section{background-image:linear-gradient(130deg,#a4581f 0%,#7a4a2e 100%)!important}
/* 2. Visible keyboard focus. Divi suppresses outlines in several places. */
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,
textarea:focus-visible,summary:focus-visible,[tabindex]:focus-visible{
 outline:3px solid #a4581f!important;outline-offset:2px!important;
 border-radius:3px;box-shadow:0 0 0 3px rgba(255,255,255,.85)!important}
.et_pb_section a:focus-visible,#main-header a:focus-visible,#main-footer a:focus-visible{
 outline:3px solid #f0d5b0!important;box-shadow:0 0 0 3px rgba(44,26,14,.9)!important}
/* 3. Skip link — first tab stop on every page */
.sssihms-skip{position:absolute;left:-9999px;top:0;z-index:100000;
 background:#2c1a0e;color:#fff;padding:12px 20px;font:700 15px/1.3 "Nunito Sans",sans-serif;
 text-decoration:none;border-radius:0 0 6px 0}
.sssihms-skip:focus{left:0}
/* 4. Touch targets — 44px minimum on phones (WCAG 2.5.5) */
@media (max-width:980px){
 #main-header a,#et-top-navigation a,.et_mobile_menu a,#main-footer a{
  min-height:44px;display:inline-flex;align-items:center}
 .sssihms-callbar a{min-height:48px}
}
/* 5. Respect reduced-motion preferences */
@media (prefers-reduced-motion:reduce){
 *,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;
  transition-duration:.001ms!important;scroll-behavior:auto!important}
}
/* 6. Placeholder contrast in the header search */
#sssi-s::placeholder{color:rgba(255,255,255,.75);opacity:1}
</style>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_a11y_css', 1 );

/** The skip link itself, as the first focusable thing in the document. */
function sssihms_wfd_skip_link() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	echo '<a class="sssihms-skip" href="#main-content">Skip to main content</a>';
}
add_action( 'wp_body_open', 'sssihms_wfd_skip_link', 1 );

/** Give the skip link something to land on. */
function sssihms_wfd_main_anchor( $classes ) {
	return $classes;
}
function sssihms_wfd_main_id() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	?>
<script>
(function(){
 var m=document.getElementById('et-main-area')||document.querySelector('main,#main-content');
 if(m&&!document.getElementById('main-content')){m.id=m.id||'';m.setAttribute('id','main-content');}
 if(m){m.setAttribute('tabindex','-1');}
})();
</script>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_main_id', 5 );

/* -------------------------------------------------------------------------
 * Search results.
 *
 * Three problems with the stock Divi/WordPress search on this site:
 *   1. No relevance ranking at all — results come back newest-first, so a search
 *      for "cardiology" returned a 2019 CME notice and not the Cardiology
 *      department page.
 *   2. Excerpts were the whole page flattened to text, run together without
 *      spaces, because Divi strips tags but not shortcodes.
 *   3. Every result carried an author byline and a post date, which mean
 *      nothing to a patient looking for the appointment number.
 * ---------------------------------------------------------------------- */

/** Only pages and posts, ten at a time. */
function sssihms_wfd_search_query( $q ) {
	if ( is_admin() || ! $q->is_main_query() || ! $q->is_search() ) {
		return;
	}
	$q->set( 'post_type', array( 'page', 'post' ) );
	$q->set( 'posts_per_page', 10 );
}
add_action( 'pre_get_posts', 'sssihms_wfd_search_query' );

/** Rank exact title matches first, then titles containing the term, then the rest. */
function sssihms_wfd_search_orderby( $orderby, $q ) {
	if ( is_admin() || ! $q->is_main_query() || ! $q->is_search() ) {
		return $orderby;
	}
	global $wpdb;
	$s = trim( (string) $q->get( 's' ) );
	if ( '' === $s ) {
		return $orderby;
	}
	$like = '%' . $wpdb->esc_like( $s ) . '%';
	return $wpdb->prepare(
		"(CASE
			WHEN {$wpdb->posts}.post_title = %s THEN 0
			WHEN {$wpdb->posts}.post_title LIKE %s THEN 1
			ELSE 2
		 END) ASC, {$wpdb->posts}.post_type ASC, {$wpdb->posts}.post_date DESC",
		$s,
		$like
	);
}
add_filter( 'posts_orderby', 'sssihms_wfd_search_orderby', 10, 2 );

/** Readable text from Divi content: drop style/script, keep shortcode inner text. */
function sssihms_wfd_plain_text( $content ) {
	$content = preg_replace( '#<(style|script)\b[^>]*>.*?</\1>#is', ' ', (string) $content );
	$content = preg_replace( '/\[\/?[^\]]{1,200}\]/', ' ', $content );   // shortcode tags, not their text
	$content = preg_replace( '#</[a-z][a-z0-9]*\s*>#i', ' ', $content );
	$content = preg_replace( '#<br\s*/?>#i', ' ', $content );
	$content = wp_strip_all_tags( $content );
	$content = html_entity_decode( $content, ENT_QUOTES, 'UTF-8' );
	return trim( preg_replace( '/\s+/u', ' ', $content ) );
}

/** One clean summary for a result: the hand-written SEO description if there is one. */
function sssihms_wfd_summary_for( $post_id ) {
	$desc = get_post_meta( $post_id, '_yoast_wpseo_metadesc', true );
	if ( '' === trim( (string) $desc ) ) {
		$p = get_post( $post_id );
		if ( ! $p ) {
			return '';
		}
		$desc = trim( (string) $p->post_excerpt );
		if ( '' === $desc ) {
			$desc = sssihms_wfd_plain_text( $p->post_content );
			// Divi pages open with a breadcrumb trail and then repeat the page title
			// in the banner, so a naive excerpt reads "Cardiology Cardiology …".
			$desc = preg_replace( '/^\s*Home\s*›\s*/u', '', $desc );
			// Peel off breadcrumb segments ("Departments · Cardiology · ").
			$desc = preg_replace( '/^(?:[^·]{1,48}·\s*){1,4}/u', '', $desc );
			// Drop the page title where the banner repeats it.
			$title = get_the_title( $post_id );
			if ( '' !== $title ) {
				$desc = preg_replace( '/^\s*' . preg_quote( $title, '/' ) . '\s*/ui', '', $desc );
			}
			// Collapse an immediately repeated opening phrase.
			$desc = preg_replace( '/^(.{4,60}?)\s*\1\s*/ui', '$1 ', $desc );
		}
	}
	return wp_trim_words( $desc, 32, '…' );
}

/** The heading markup: what was searched, how many results, and a way to search again. */
function sssihms_wfd_search_header_html() {
	global $wp_query;
	$term  = get_search_query();
	$found = (int) $wp_query->found_posts;
	$page  = max( 1, (int) $wp_query->get( 'paged' ) );

	if ( $found ) {
		$count = sprintf( _n( '%s result', '%s results', $found ), number_format_i18n( $found ) );
		if ( $page > 1 ) {
			$count = sprintf( '%s &middot; page %d', $count, $page );
		}
	} else {
		$count = 'No results';
	}

	$html  = '<div class="sssihms-searchhead">';
	$html .= '<h1>Search results</h1>';
	$html .= '<p class="sssihms-searchmeta"><strong>' . esc_html( $count ) . '</strong> for &ldquo;'
	         . esc_html( $term ) . '&rdquo;</p>';
	$html .= '<form role="search" method="get" action="' . esc_url( home_url( '/' ) ) . '" class="sssihms-searchagain">'
	       . '<label for="sssi-s2">Search again</label>'
	       . '<input id="sssi-s2" type="search" name="s" value="' . esc_attr( $term ) . '" placeholder="Search this site&hellip;">'
	       . '<button type="submit">Search</button></form>';

	if ( ! $found ) {
		$html .= '<p class="sssihms-searchhelp">Nothing matched that. You may be looking for '
		       . '<a href="/appointments-admission/">appointments</a>, '
		       . '<a href="/emergency/">emergency care</a>, '
		       . '<a href="/specialties/">departments</a>, '
		       . '<a href="/donate/">how to donate</a> or '
		       . '<a href="/contact-us/">contact details</a>. '
		       . 'Or call the Patient Help Desk on <a href="tel:+918047104600">+91&nbsp;80&nbsp;4710&nbsp;4600</a>.</p>';
	}

	return $html . '</div>';
}

/**
 * Inject the heading by buffering the page. Divi's search template offers no hook
 * that fires for both the results and the no-results case, and `loop_start` never
 * runs when nothing matched — so the markup goes in just before the results column.
 */
function sssihms_wfd_search_buffer() {
	if ( is_admin() || ! is_search() || ! sssihms_wfd_is_target() ) {
		return;
	}
	ob_start(
		function ( $html ) {
			// Rewrite each result: keep the title, drop the byline, and replace the
			// flattened page dump with a real summary.
			$html = preg_replace_callback(
				'#<article id="post-(\d+)"[^>]*>.*?</article>#is',
				function ( $m ) {
					$id    = (int) $m[1];
					$title = get_the_title( $id );
					$link  = get_permalink( $id );
					if ( ! $link ) {
						return $m[0];
					}
					$sum = sssihms_wfd_summary_for( $id );
					$out  = '<article id="post-' . $id . '" class="et_pb_post sssihms-result">';
					$out .= '<h2 class="entry-title"><a href="' . esc_url( $link ) . '">' . esc_html( $title ) . '</a></h2>';
					if ( '' !== $sum ) {
						$out .= '<p class="sssihms-excerpt">' . esc_html( $sum ) . '</p>';
					}
					$out .= '<p class="sssihms-url">' . esc_html( str_replace( home_url(), '', untrailingslashit( $link ) ) . '/' ) . '</p>';
					return $out . '</article>';
				},
				$html
			);

			if ( false === strpos( $html, '<div class="sssihms-searchhead">' ) ) {
				$head = sssihms_wfd_search_header_html();
				foreach ( array( '<div id="left-area"', '<article', '<div id="content-area"' ) as $needle ) {
					$at = strpos( $html, $needle );
					if ( false !== $at ) {
						$html = substr( $html, 0, $at ) . $head . substr( $html, $at );
						break;
					}
				}
			}
			return $html;
		}
	);
}
add_action( 'template_redirect', 'sssihms_wfd_search_buffer', 20 );

/**
 * 404 (17-Oct-2026). Divi's own page says "No Results Found" and lists blog categories;
 * this one names the pages a patient most likely wanted and gives the Help Desk number.
 * Same injection point and styles as the search page.
 */
function sssihms_wfd_404_html() {
	return '<div class="sssihms-searchhead sssihms-notfound">'
	     . '<h1>Page not found</h1>'
	     . '<p class="sssihms-searchmeta">This page may have moved, or the address may be mistyped.</p>'
	     . '<form role="search" method="get" action="' . esc_url( home_url( '/' ) ) . '" class="sssihms-searchagain">'
	     . '<label for="sssi-s2">Search this site</label>'
	     . '<input id="sssi-s2" type="search" name="s" placeholder="Search this site&hellip;">'
	     . '<button type="submit">Search</button></form>'
	     . '<p class="sssihms-searchhelp">You may be looking for '
	     . '<a href="/appointments-admission/">appointments</a>, '
	     . '<a href="/emergency/">emergency care (open 24/7)</a>, '
	     . '<a href="/specialties/">departments</a>, '
	     . '<a href="/help-desk/">the Help Desk</a> or '
	     . '<a href="/contact-us/">contact details</a>. '
	     . 'Or call the Patient Help Desk on <a href="tel:+918047104600">+91&nbsp;80&nbsp;4710&nbsp;4600</a> '
	     . '(10 AM &ndash; 4 PM, Monday to Saturday).</p></div>';
}

function sssihms_wfd_404_buffer() {
	if ( is_admin() || ! is_404() || ! sssihms_wfd_is_target() ) {
		return;
	}
	ob_start(
		function ( $html ) {
			if ( false !== strpos( $html, 'sssihms-notfound' ) ) {
				return $html;
			}
			foreach ( array( '<div id="left-area"', '<div id="content-area"' ) as $needle ) {
				$at = strpos( $html, $needle );
				if ( false !== $at ) {
					return substr( $html, 0, $at ) . sssihms_wfd_404_html() . substr( $html, $at );
				}
			}
			return $html;
		}
	);
}
add_action( 'template_redirect', 'sssihms_wfd_404_buffer', 20 );

/** Presentation (search results and the 404 page). */
function sssihms_wfd_search_css() {
	if ( ! sssihms_wfd_is_target() || ! ( is_search() || is_404() ) ) {
		return;
	}
	?>
<style id="sssihms-search">
.sssihms-searchhead{max-width:900px;margin:0 auto 34px;padding:0 16px}
.sssihms-searchhead h1{font-family:var(--f-head,'EB Garamond',Georgia,serif);font-size:38px;margin:0 0 6px;color:var(--text,#2a1f14)}
.sssihms-searchmeta{font-size:16px;color:#6e604c;margin:0 0 18px}
.sssihms-searchagain{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.sssihms-searchagain label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.sssihms-searchagain input{flex:1 1 260px;min-height:46px;padding:10px 14px;font-size:16px;
 border:1px solid #cdbfa6;border-radius:6px;background:#fff;color:#2a1f14}
.sssihms-searchagain button{min-height:46px;padding:10px 22px;font-size:15px;font-weight:700;
 background:#a4581f;color:#fff;border:0;border-radius:6px;cursor:pointer}
.sssihms-searchhelp{margin-top:20px;font-size:16px;line-height:1.9;color:#2a1f14}
/* the byline and date mean nothing to a patient looking for a phone number */
body.search .post-meta,body.search .entry-featured-image-url{display:none!important}
body.search article.et_pb_post{border-bottom:1px solid #e0d5c0;padding:0 0 22px;margin:0 auto 26px;max-width:900px;padding-inline:16px}
body.search .entry-title{font-size:23px;line-height:1.35;margin:0 0 8px}
body.search .entry-title a{color:#96591a}
body.search .sssihms-excerpt{font-size:16px;line-height:1.75;color:#2a1f14;margin:0 0 6px}
body.search .sssihms-url{font-size:13px;color:#6e604c;margin:0}
body.search article.et_pb_post p{font-size:16px;line-height:1.75;color:#2a1f14;margin:0}
body.search .pagination{max-width:900px;margin:0 auto;padding:0 16px}
/* Divi prints its own 'No Results Found' plus a category list; ours names the
   pages a patient probably wanted and gives the Help Desk number. */
body.search .et_pb_no_results,body.search #sidebar,body.search .widget_categories{display:none!important}
body.search #left-area{width:100%!important;padding-right:0!important}
body.error404 .not_found,body.error404 #sidebar{display:none!important}
body.error404 #left-area{width:100%!important;padding-right:0!important}
body.error404 #main-content .container::before{display:none}
</style>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_search_css', 2 );

/**
 * Whole-card click targets.
 *
 * People click the card heading, not the small "Open →" beneath it. Rather than
 * wrapping each card in an <a> — which makes a screen reader announce the heading,
 * the description and the button as one long link — this stretches the card's
 * single existing link across the card with an overlay. One link per card, the
 * heading stays a heading, and keyboard focus still lands on the link.
 *
 * Opt-in: only cards marked .card-clickable with one .card-link inside.
 */
function sssihms_wfd_card_css() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	?>
<style id="sssihms-cards">
.info-card.card-clickable{position:relative;transition:transform .16s ease,box-shadow .16s ease}
.info-card.card-clickable .card-link::after{content:"";position:absolute;inset:0;z-index:1;border-radius:inherit}
.info-card.card-clickable:hover{transform:translateY(-2px);box-shadow:0 6px 22px rgba(44,26,14,.13)}
.info-card.card-clickable:hover h3{text-decoration:underline;text-underline-offset:3px}
/* the pointer should say "clickable" anywhere on the card */
.info-card.card-clickable,.info-card.card-clickable h3,.info-card.card-clickable p{cursor:pointer}
/* keyboard focus must outline the card, not just the small button inside it */
.info-card.card-clickable:focus-within{outline:3px solid #a4581f;outline-offset:3px;border-radius:10px}
.info-card.card-clickable .card-link:focus-visible{outline:none;box-shadow:none}
/* anything else in the card must stay above the overlay to remain clickable */
.info-card.card-clickable a:not(.card-link){position:relative;z-index:2}
@media (prefers-reduced-motion:reduce){
 .info-card.card-clickable,.info-card.card-clickable:hover{transition:none;transform:none}
}
</style>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_card_css', 3 );

/**
 * The three poetry slugs were Divi pages holding nothing but a banner and a link
 * onward to the real collection at /static/poetry-pages/. The menu now points
 * straight at the content, so these send anyone arriving from an old link,
 * bookmark or search result to the same place instead of a dead-end shell.
 */
function sssihms_wfd_poetry_redirects() {
	if ( ! sssihms_wfd_is_target() || is_admin() ) {
		return;
	}
	$map = array(
		'divine-poetry' => '/static/poetry-pages/divine-poetry.html',
		'songs-baba'    => '/static/poetry-pages/sai-compositions.html',
		'sai_padhyam'   => '/static/poetry-pages/padya-sudha.html',
	);
	$path = trim( parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' );
	if ( isset( $map[ $path ] ) ) {
		wp_redirect( home_url( $map[ $path ] ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'sssihms_wfd_poetry_redirects', 5 );

/**
 * Light-only colour scheme. The site has no dark theme; without this, Android
 * forced-dark modes (Chrome auto-dark, Samsung Internet) darken the white logo
 * box while the transparent logo's black text stays black. 25-Sep-2026.
 */
function sssihms_wfd_color_scheme() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	echo '<meta name="color-scheme" content="only light">' . "\n";
	echo '<style id="sssihms-color-scheme">:root{color-scheme:only light}</style>' . "\n";
}
add_action( 'wp_head', 'sssihms_wfd_color_scheme', 1 );

/**
 * The old monthly "Biomedical Waste Report" page (51982, now draft) is replaced
 * by the sssihms-bmw-tracker plugin's statutory disclosure page. Old links and
 * bookmarks go there instead of a 404. 26-Sep-2026.
 */
function sssihms_wfd_bmw_redirect() {
	if ( ! sssihms_wfd_is_target() || is_admin() ) {
		return;
	}
	$path = trim( parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' );
	if ( 'biomedical-waste-report' === $path ) {
		wp_redirect( home_url( '/biomedical-waste-management/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'sssihms_wfd_bmw_redirect', 5 );

/**
 * The Emergency Care page (55655) lives at /emergency/. /emergency-care/ — its title, and
 * the address the 19-Oct-2026 accessibility check tried — returned 404. Only while it is
 * a 404, so a real page at that slug would win. 20-Oct-2026.
 */
function sssihms_wfd_emergency_alias() {
	if ( ! sssihms_wfd_is_target() || ! is_404() ) {
		return;
	}
	if ( 'emergency-care' === trim( parse_url( $_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH ), '/' ) ) {
		wp_safe_redirect( home_url( '/emergency/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'sssihms_wfd_emergency_alias' );

/**
 * Stat cards ("Service in Numbers" etc.) overflowed phone screens: the 2-column
 * mobile grid used 1fr, which cannot shrink below the widest number
 * ("1,43,500+", "29.9 Lakh+" at 46px), so pages scrolled sideways.
 * minmax(0,1fr) lets the columns shrink; the value font steps down on narrow
 * screens. Loaded in the footer so it follows each page's own stylesheet. 28-Sep-2026.
 */
function sssihms_wfd_stats_css() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	?>
<style id="sssihms-stats">
@media (max-width:768px){.stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:480px){.stats-grid{gap:12px}.stat-card{padding:20px 12px;min-width:0}.stat-val{font-size:clamp(26px,8vw,36px);overflow-wrap:anywhere}.stat-lbl{font-size:14px}}
</style>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_stats_css', 4 );

/**
 * Contrast and target-size fixes from the axe-core 4.12.1 scan of 19-Oct-2026.
 * Ratios (WCAG relative luminance):
 *   muted text #7a6a55 on --bg-alt #f0e8d6 = 4.28 → #6e604c = 5.00 (6.10 on white),
 *     the tone rule 1e above already uses for .section-sub; set as --tm inside
 *     beige sections only, so muted text elsewhere is unchanged;
 *   call-bar captions: opacity .85 made them #f1e6dd on #a4581f = 4.28 → #fff = 5.26;
 *   saffron text #c8813a on white/cards = 3.15/3.07 → #96591a = 5.61/5.48;
 *   white on #c8813a = 3.15 → on #a4581f = 5.26 (as rule 1c);
 *   404 help links were Divi's default #2ea3f2 = 2.74 on white → #96591a = 5.61.
 */
function sssihms_wfd_a11y_contrast_css() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	?>
<style id="sssihms-a11y-contrast">
.section-alt{--tm:#6e604c}
.theme-b .section-alt,.theme-b.section-alt{--tm:#5a6a85}
.sssihms-callbar a small{opacity:1;color:#fff}
.ct-mail,.vac-pdf,.subnav-link.active,.prose-p a[style*="var(--primary)"]{color:#96591a!important}
.ct-mail[href^="tel:"]{text-decoration:underline}
.free-band,.et_pb_contact_submit.et_pb_button{background:#a4581f!important}
.sssihms-searchhelp a{color:#96591a;text-decoration:underline}
.ach-group>summary{min-height:26px;box-sizing:border-box}
</style>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_a11y_contrast_css', 6 );

/**
 * Links that leave whitefield.sssihms.org are marked (audit F15, 20-Oct-2026): a small
 * arrow after text links, and for screen readers "(opens another website)" — "… in a new
 * tab" when target=_blank, which also gets rel=noopener. Icon-only links (social icons,
 * linked images) get the spoken note only; one with an aria-label has the note added to
 * that label, since the label replaces the link text. mailto:/tel: links are not touched.
 * Runs once in the footer, so it covers page content, header, footer and menu alike.
 * Same-site links that open a new tab (PDF brochures, flyers) get "(opens in a new tab)",
 * spoken only, no arrow (keyboard/link-text check, 20-Oct-2026).
 */
function sssihms_wfd_external_links() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	?>
<style id="sssihms-ext-links">
.sssihms-ext-icon{display:inline-block;width:.7em;height:.7em;margin-left:.25em;vertical-align:baseline;background:currentColor;
 -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M4 1h7v7h-1.6V3.7L2.1 11 1 9.9l7.3-7.3H4z'/%3E%3C/svg%3E") center/contain no-repeat;
 mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M4 1h7v7h-1.6V3.7L2.1 11 1 9.9l7.3-7.3H4z'/%3E%3C/svg%3E") center/contain no-repeat}
.sssihms-sr{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
</style>
<script id="sssihms-ext-links-js">
(function(){
 var links=document.querySelectorAll('a[href]');
 for(var i=0;i<links.length;i++){
  var a=links[i],u;
  if(a.classList.contains('sssihms-ext')||a.classList.contains('sssihms-newtab'))continue;
  try{u=new URL(a.href);}catch(e){continue;}
  if(u.protocol!=='http:'&&u.protocol!=='https:')continue;
  var tab=a.target==='_blank',ext=u.hostname!==location.hostname;
  if(!ext&&!tab)continue;
  var note=ext?(tab?'opens another website in a new tab':'opens another website'):'opens in a new tab';
  if(tab&&!/\bnoopener\b/.test(a.rel))a.rel=(a.rel+' noopener').trim();
  a.classList.add(ext?'sssihms-ext':'sssihms-newtab');
  var textLink=ext&&a.textContent.trim()!==''&&!a.querySelector('img,svg,picture,video');
  var label=a.getAttribute('aria-label');
  if(label){a.setAttribute('aria-label',label+' ('+note+')');}
  else{var s=document.createElement('span');s.className='sssihms-sr';s.textContent=' ('+note+')';a.appendChild(s);}
  if(textLink){var ic=document.createElement('span');ic.className='sssihms-ext-icon';ic.setAttribute('aria-hidden','true');a.appendChild(ic);}
 }
})();
</script>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_external_links', 7 );

/**
 * Keyboard use, from the keyboard check of 20-Oct-2026 (25 pages, Tab walks at 390 and 1366 px):
 *  1. Skip link: Divi's smooth-scroll click handler (it matches a[href*="#"]) scrolled to the
 *     content but left focus on the link, so the next Tab went back into the header. A
 *     capture-phase handler now moves focus to #main-content first.
 *  2. Desktop menu: submenus were opened by hover only (visibility/opacity), so Tab skipped all
 *     101 submenu links. They now open while focus is inside their parent (:focus-within);
 *     parents carry aria-haspopup/aria-expanded; Escape closes the open submenu and returns
 *     focus to its parent link. The menu's content and order are unchanged.
 *  3. Mobile menu button: a <span> Tab could not reach. Now a named, focusable button that
 *     Enter/Space toggle, with aria-expanded kept in step with Divi's opened/closed class;
 *     Escape inside the open menu closes it and returns focus to the button.
 *  4. Phones: the fixed call bar (52px) hid focused footer links; scroll-padding keeps them clear.
 */
function sssihms_wfd_keyboard_nav() {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	?>
<style id="sssihms-keyboard">
#main-content[tabindex="-1"]:focus{outline:none!important;box-shadow:none!important}
.et_pb_menu .et-menu li.menu-item-has-children:focus-within>ul.sub-menu{visibility:visible;opacity:1}
.et_pb_menu .et-menu li.sssi-sub-closed>ul.sub-menu{visibility:hidden!important;opacity:0!important}
@media (max-width:980px){html{scroll-padding-bottom:80px}}
</style>
<script id="sssihms-keyboard-js">
(function(){
 document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a.sssihms-skip'),t=document.getElementById('main-content');
  if(!a||!t)return;
  e.preventDefault();e.stopImmediatePropagation();
  t.setAttribute('tabindex','-1');t.focus({preventScroll:true});t.scrollIntoView({block:'start'});
 },true);
 var parents=document.querySelectorAll('.et_pb_menu .et-menu li.menu-item-has-children');
 for(var i=0;i<parents.length;i++)(function(li){
  var a=li.querySelector(':scope>a');if(!a)return;
  a.setAttribute('aria-haspopup','true');a.setAttribute('aria-expanded','false');
  li.addEventListener('focusin',function(){li.classList.remove('sssi-sub-closed');a.setAttribute('aria-expanded','true');});
  li.addEventListener('focusout',function(e){if(!li.contains(e.relatedTarget)){li.classList.remove('sssi-sub-closed');a.setAttribute('aria-expanded','false');}});
  li.addEventListener('keydown',function(e){
   if(e.key!=='Escape'||li.classList.contains('sssi-sub-closed'))return;
   e.stopPropagation();a.focus();li.classList.add('sssi-sub-closed');a.setAttribute('aria-expanded','false');
  });
 })(parents[i]);
 var bars=document.querySelectorAll('.et_mobile_nav_menu .mobile_menu_bar');
 for(var j=0;j<bars.length;j++)(function(bar){
  var nav=bar.closest('.mobile_nav');if(!nav)return;
  bar.setAttribute('role','button');bar.tabIndex=0;bar.setAttribute('aria-label','Menu');
  function sync(){
   bar.setAttribute('aria-expanded',nav.classList.contains('opened')?'true':'false');
   var m=nav.querySelector('ul[id]');if(m)bar.setAttribute('aria-controls',m.id);
  }
  sync();new MutationObserver(sync).observe(nav,{attributes:true,attributeFilter:['class'],childList:true});
  bar.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();bar.click();}});
  nav.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('opened')){bar.click();bar.focus();}});
 })(bars[j]);
})();
</script>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_keyboard_nav', 8 );

/**
 * Stop author lookups revealing login names. /?author=1 redirected to
 * /author/saiadmin/, handing bots a real admin username (29-Sep-2026: ~20,000
 * failed logins in 30 days, many against real names). ?author=N requests and
 * author archives now go to the home page, and author links point there too,
 * so no page prints a login slug. Logged-in editors are unaffected in wp-admin.
 */
function sssihms_wfd_block_author_enum() {
	if ( ! sssihms_wfd_is_target() || is_admin() ) {
		return;
	}
	if ( isset( $_GET['author'] ) || is_author() ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'sssihms_wfd_block_author_enum', 1 );

add_filter( 'author_link', function ( $link ) {
	return sssihms_wfd_is_target() ? home_url( '/' ) : $link;
} );

/**
 * WCAG 3.1.1 — the four patient-information pages are written in Kannada, Hindi,
 * Telugu and Bengali, but every page declared lang="en-US" (audit 11-Oct-2026).
 * Declare the page's own language, and mark the English header and footer as
 * English so screen readers switch back for the navigation.
 */
function sssihms_wfd_page_lang() {
	if ( ! sssihms_wfd_is_target() || ! is_page() ) {
		return '';
	}
	$langs = array( 55667 => 'kn', 55668 => 'hi', 55669 => 'te', 55670 => 'bn' );
	$id    = (int) get_queried_object_id();
	return isset( $langs[ $id ] ) ? $langs[ $id ] : '';
}

add_filter( 'language_attributes', function ( $output ) {
	$lang = sssihms_wfd_page_lang();
	return '' === $lang ? $output : preg_replace( '/lang="[^"]*"/', 'lang="' . $lang . '"', $output );
} );

function sssihms_wfd_lang_buffer() {
	if ( is_admin() || '' === sssihms_wfd_page_lang() ) {
		return;
	}
	ob_start(
		function ( $html ) {
			return str_replace(
				array( '<header class="et-l et-l--header">', '<footer class="et-l et-l--footer">' ),
				array( '<header class="et-l et-l--header" lang="en">', '<footer class="et-l et-l--footer" lang="en">' ),
				$html
			);
		}
	);
}
add_action( 'template_redirect', 'sssihms_wfd_lang_buffer', 20 );

/**
 * Shared page stylesheet (12-Oct-2026). It used to be a "Page Stylesheet — shared,
 * do not edit" code module at the top of 126 pages. Department editors lack
 * unfiltered_html, so saving a page in the builder stripped its <style> tags and the
 * whole stylesheet printed as text (Cardiac Surgery Infrastructure, 12-Oct-2026).
 * Pages flagged with _sssihms_page_css get the file at the spot where the module sat,
 * just before the main content, so it still loads after Divi's head CSS.
 */
function sssihms_wfd_page_css() {
	if ( ! sssihms_wfd_is_target() || ! is_singular() ) {
		return;
	}
	if ( ! get_post_meta( get_queried_object_id(), '_sssihms_page_css', true ) ) {
		return;
	}
	$file = __DIR__ . '/sssihms-wfd-assets/page.css';
	$url  = content_url( 'mu-plugins/sssihms-wfd-assets/page.css' ) . '?ver=' . filemtime( $file );
	echo '<link rel="stylesheet" id="sssihms-page-css" href="' . esc_url( $url ) . '">' . "\n";
}
add_action( 'et_before_main_content', 'sssihms_wfd_page_css', 1 );

/**
 * Per-page CSS (12-Oct-2026). Small component <style> blocks that used to sit inside
 * code modules on 26 pages now live in post meta _sssihms_page_css_extra, printed
 * after the shared stylesheet. Builder saves by editors can no longer strip them.
 */
add_action( 'et_before_main_content', function () {
	if ( ! sssihms_wfd_is_target() || ! is_singular() ) {
		return;
	}
	$css = (string) get_post_meta( get_queried_object_id(), '_sssihms_page_css_extra', true );
	if ( '' !== $css && false === stripos( $css, '</style' ) ) {
		echo '<style id="sssihms-page-css-extra">' . $css . "</style>\n";
	}
}, 2 );

/**
 * [sssihms_embed] — iframes as a shortcode (12-Oct-2026). Editors' saves stripped raw
 * <iframe> tags (statistics dashboards, poetry embeds, maps). Only same-site paths and
 * Google Maps embeds are rendered.
 */
function sssihms_wfd_embed_shortcode( $atts ) {
	$a   = shortcode_atts( array( 'src' => '', 'title' => '', 'style' => '', 'width' => '', 'height' => '', 'loading' => '', 'referrerpolicy' => '' ), $atts, 'sssihms_embed' );
	$src = html_entity_decode( $a['src'] );
	$ok  = ( '/' === substr( $src, 0, 1 ) && '//' !== substr( $src, 0, 2 ) )
		|| 0 === strpos( $src, 'https://maps.google.com/maps?' )
		|| 0 === strpos( $src, 'https://www.google.com/maps/embed?' );
	if ( ! $ok ) {
		return '';
	}
	$out = '<iframe src="' . esc_url( $src ) . '"';
	foreach ( array( 'title', 'width', 'height', 'style', 'loading', 'referrerpolicy' ) as $k ) {
		if ( '' !== $a[ $k ] ) {
			$out .= ' ' . $k . '="' . esc_attr( html_entity_decode( $a[ $k ] ) ) . '"';
		}
	}
	return $out . '></iframe>';
}
add_shortcode( 'sssihms_embed', 'sssihms_wfd_embed_shortcode' );

/**
 * [sssihms_proceedings slug="…"] — conference proceedings pages (13-Oct-2026). Each is
 * built outside WordPress (videos, QR codes, transcripts; ~500 KB) and converted by
 * wordpress/tools/proceedings_to_wp.py into sssihms-wfd-assets/proceedings/<slug>.html,
 * .css and .js. The page content holds only the shortcode, so a builder save can't strip it.
 */
function sssihms_wfd_proceedings_file( $slug, $ext ) {
	return __DIR__ . '/sssihms-wfd-assets/proceedings/' . sanitize_key( $slug ) . '.' . $ext;
}

function sssihms_wfd_proceedings_shortcode( $atts ) {
	$a    = shortcode_atts( array( 'slug' => '' ), $atts, 'sssihms_proceedings' );
	$file = sssihms_wfd_proceedings_file( $a['slug'], 'html' );
	return ( '' !== $a['slug'] && is_readable( $file ) ) ? file_get_contents( $file ) : '';
}
add_shortcode( 'sssihms_proceedings', 'sssihms_wfd_proceedings_shortcode' );

add_action( 'wp_enqueue_scripts', function () {
	if ( ! sssihms_wfd_is_target() || ! is_singular() ) {
		return;
	}
	$content = (string) get_post_field( 'post_content', get_queried_object_id() );
	if ( ! preg_match( '/\[sssihms_proceedings\s+slug="([a-z0-9_-]+)"/', $content, $m ) ) {
		return;
	}
	$slug = $m[1];
	$css  = sssihms_wfd_proceedings_file( $slug, 'css' );
	$js   = sssihms_wfd_proceedings_file( $slug, 'js' );
	$base = content_url( 'mu-plugins/sssihms-wfd-assets/proceedings/' . $slug );
	wp_enqueue_style( 'sssihms-proc-fonts', 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap', array(), null );
	wp_enqueue_style( 'sssihms-proc', $base . '.css', array(), filemtime( $css ) );
	wp_enqueue_script( 'sssihms-proc', $base . '.js', array(), filemtime( $js ), true );
} );

/**
 * Inline style attributes: kses dropped borders and backgrounds written with rgba(),
 * and a few properties core does not list (list-style, overflow-x, animation-delay…),
 * whenever an editor saved a page. Plain CSS only — no url(), expressions or script.
 */
add_filter( 'safe_style_css', function ( $props ) {
	return sssihms_wfd_is_target() ? array_merge( $props, array( 'list-style', 'overflow-x', 'overflow-y', 'animation-delay', 'font-variant-numeric', 'word-break' ) ) : $props;
} );
add_filter( 'safecss_filter_attr_allow_css', function ( $allow, $css ) {
	if ( $allow || ! sssihms_wfd_is_target() ) {
		return $allow;
	}
	// Allow only when every "(...)" in the declaration is an rgb/rgba/hsl/hsla colour.
	$rest = preg_replace( '/\b(?:rgba?|hsla?)\(\s*[0-9.%\s,\/]+\)/i', '', $css );
	return false === strpos( $rest, '(' ) && false === strpos( $rest, ')' ) && ! preg_match( '/[\\\\&}=<>]|\/\*/', $rest );
}, 10, 2 );

/**
 * Fellowship page (255): scroll to #fellowship-admissions or #arthroplasty-fellowship
 * after load, which the page's late layout otherwise pushes out of view. Was a <script>
 * in the content.
 */
add_action( 'wp_footer', function () {
	if ( sssihms_wfd_is_target() && is_page( 255 ) ) {
		echo '<script id="fa-anchor-fix">window.addEventListener("load",function(){var h=location.hash;if(h!=="#fellowship-admissions"&&h!=="#arthroplasty-fellowship")return;setTimeout(function(){var e=document.getElementById(h.slice(1));if(e&&Math.abs(e.getBoundingClientRect().top)>200){e.scrollIntoView();}},1500);});</script>' . "\n";
	}
} );

/**
 * Home (54830): one-off removal of the RGUHS fellowship line from the notice band after
 * the last date to apply (18-Nov-2026, RGUHS Revised Notification 1). The Arthroplasty
 * line stays. Runs once via WP-Cron; does nothing if the line is already gone.
 */
const SSSIHMS_WFD_RGUHS_NOTICE = '<strong>FELLOWSHIP 2026 ADMISSIONS</strong> – Applications are invited for Interventional Cardiology & Cardiac and Vascular Anaesthesia | Last date to apply (RGUHS revised schedule): <strong>18-Nov-2026</strong>; entrance exam 20-Nov-2026. <a href="/academics/fellowship/apply/">Apply online →</a> &nbsp;·&nbsp; <a href="/academics/fellowship/#fellowship-admissions">Flyers, details & RGUHS notification →</a><br>';

add_action( 'init', function () {
	if ( sssihms_wfd_is_target() && ! get_option( 'sssihms_wfd_rguhs_notice_off' ) && ! wp_next_scheduled( 'sssihms_wfd_rguhs_notice_off' ) ) {
		wp_schedule_single_event( ( new DateTime( '2026-11-19 00:00:00', wp_timezone() ) )->getTimestamp(), 'sssihms_wfd_rguhs_notice_off' );
	}
} );

add_action( 'sssihms_wfd_rguhs_notice_off', function () {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	$c = get_post_field( 'post_content', 54830 );
	if ( 1 === substr_count( $c, SSSIHMS_WFD_RGUHS_NOTICE ) ) {
		kses_remove_filters();
		wp_update_post( array( 'ID' => 54830, 'post_content' => str_replace( SSSIHMS_WFD_RGUHS_NOTICE, '', $c ), 'page_template' => '' ) );
		kses_init_filters();
		if ( function_exists( 'w3tc_flush_post' ) ) {
			w3tc_flush_post( 54830 );
		}
	}
	update_option( 'sssihms_wfd_rguhs_notice_off', current_time( 'mysql' ), false );
} );

/**
 * IC/CVA applications open on 11-Nov-2026 (RGUHS fellowships circular). Until then the home
 * notice and the fellowship page (255) say so and carry no IC/CVA "Apply online" link; this
 * one-off job puts the "Applications are invited" wording back on 11-Nov-2026 00:00 IST.
 * Each swap needs an exact single match, so the restored home line is
 * SSSIHMS_WFD_RGUHS_NOTICE and the 19-Nov removal above still finds it.
 * Pairs: post ID => list of array( open wording, held wording ).
 */
function sssihms_wfd_fa_wording() {
	return array(
		54830 => array(
			array( SSSIHMS_WFD_RGUHS_NOTICE, '<strong>FELLOWSHIP 2026 ADMISSIONS</strong> – Applications for Interventional Cardiology & Cardiac and Vascular Anaesthesia open on <strong>11-Nov-2026</strong> | Last date to apply (RGUHS revised schedule): <strong>18-Nov-2026</strong>; entrance exam 20-Nov-2026. <a href="/academics/fellowship/#fellowship-admissions">Flyers, details & RGUHS notification →</a><br>' ),
		),
		255   => array(
			array( 'Applications are invited for the <strong>Fellowship in Interventional Cardiology</strong> and the <strong>Fellowship in Cardiac and Vascular Anaesthesia</strong>, conducted under the aegis of the Rajiv Gandhi University of Health Sciences (RGUHS), Karnataka.</p>', 'Applications for the <strong>Fellowship in Interventional Cardiology</strong> and the <strong>Fellowship in Cardiac and Vascular Anaesthesia</strong>, conducted under the aegis of the Rajiv Gandhi University of Health Sciences (RGUHS), Karnataka, open on <strong>11-Nov-2026</strong>.</p>' ),
			array( 'supersedes the earlier calendar.</p>' . "\n" . '<p class="prose-p"><a class="btn btn-primary" href="/academics/fellowship/apply/" style="color:#fff;text-decoration:none">Apply online →</a></p>', 'supersedes the earlier calendar.</p>' . "\n" . '<p class="prose-p"><strong>Online applications open on 11-Nov-2026.</strong></p>' ),
		),
	);
}

/** Swap to the open ($open = true) or held wording; returns "post:pair" => matched (bool). */
function sssihms_wfd_fa_wording_swap( $open ) {
	$done = array();
	foreach ( sssihms_wfd_fa_wording() as $id => $pairs ) {
		$c = get_post_field( 'post_content', $id );
		$n = $c;
		foreach ( $pairs as $i => $pair ) {
			list( $from, $to ) = $open ? array( $pair[1], $pair[0] ) : $pair;
			$done[ "$id:$i" ]  = 1 === substr_count( $n, $from );
			if ( $done[ "$id:$i" ] ) {
				$n = str_replace( $from, $to, $n );
			}
		}
		if ( $n !== $c ) {
			kses_remove_filters();
			wp_update_post( array( 'ID' => $id, 'post_content' => $n, 'page_template' => '' ) );
			kses_init_filters();
			if ( function_exists( 'w3tc_flush_post' ) ) {
				w3tc_flush_post( $id );
			}
		}
	}
	return $done;
}

add_action( 'init', function () {
	if ( sssihms_wfd_is_target() && ! get_option( 'sssihms_wfd_fa_wording_open' ) && ! wp_next_scheduled( 'sssihms_wfd_fa_wording_open' ) ) {
		wp_schedule_single_event( ( new DateTime( '2026-11-11 00:00:00', wp_timezone() ) )->getTimestamp(), 'sssihms_wfd_fa_wording_open' );
	}
} );

add_action( 'sssihms_wfd_fa_wording_open', function () {
	if ( ! sssihms_wfd_is_target() ) {
		return;
	}
	update_option( 'sssihms_wfd_fa_wording_open', array( current_time( 'mysql' ), sssihms_wfd_fa_wording_swap( true ) ), false );
} );
