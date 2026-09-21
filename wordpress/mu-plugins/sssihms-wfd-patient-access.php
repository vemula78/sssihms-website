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

/** Presentation. */
function sssihms_wfd_search_css() {
	if ( ! sssihms_wfd_is_target() || ! is_search() ) {
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
</style>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_search_css', 2 );
