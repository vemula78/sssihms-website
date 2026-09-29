<?php
/**
 * Plugin Name: SSSIHMS Whitefield — Site Updates
 * Description: A small wp-admin form for staff to add a newsletter issue, a faculty member,
 *              an event or photos to an existing section of a whitefield.sssihms.org page,
 *              without opening the Divi builder. Blog 4 only.
 *
 * The pages are built from Divi code/text modules holding hand-written HTML. Editing them in
 * the Divi builder has broken pages twice (stylesheets stripped, `>` escaped, a whole
 * archive overwritten). This form instead finds the existing grid on the page, builds one
 * card in the same markup from escaped form fields, and inserts it — nothing else in the
 * page changes. Every save is a normal WordPress revision, so it can be undone from the
 * page's Revisions screen.
 */

defined( 'ABSPATH' ) || exit;

function sssihms_up_is_target() {
	return is_multisite() && get_current_blog_id() === 4;
}

/**
 * The four kinds of item. `child` is the opening of one card; a container is any <div>
 * whose first child is such a card. `where` limits which pages are offered.
 */
function sssihms_up_types() {
	return array(
		'newsletter' => array(
			'label' => 'Newsletter issue',
			'child' => '<a class="cover-cell"',
			'pos'   => 'start',
		),
		'faculty'    => array(
			'label' => 'Faculty member',
			'child' => '<div class="faculty-card"',
			'pos'   => 'end',
		),
		'event'      => array(
			'label' => 'Event',
			'child' => '<div class="info-card"',
			'pos'   => 'start',
			'where' => 'event',
		),
		'photos'     => array(
			'label' => 'Photos',
			'child' => '<figure class="photo-cell"',
			'pos'   => 'end',
		),
	);
}

/** Byte offset of the </div> that closes the <div> opened at $open (depth-balanced). */
function sssihms_up_close_of( $html, $open ) {
	$gt    = strpos( $html, '>', $open );
	$depth = 1;
	if ( ! preg_match_all( '~<div\b|</div>~', $html, $m, PREG_OFFSET_CAPTURE, $gt + 1 ) ) {
		return false;
	}
	foreach ( $m[0] as $tag ) {
		$depth += ( '</div>' === $tag[0] ) ? -1 : 1;
		if ( 0 === $depth ) {
			return $tag[1];
		}
	}
	return false;
}

/**
 * Containers of one type in one page's content, in document order. Each entry gives the
 * offsets of the container's opening tag end and closing tag, the card count and a label.
 */
function sssihms_up_containers( $html, $type ) {
	$child = sssihms_up_types()[ $type ]['child'];
	$out   = array();
	$at    = 0;
	while ( false !== ( $p = strpos( $html, $child, $at ) ) ) {
		$at = $p + 1;
		// First child only: the text just before it must be a <div ...> opening tag.
		$before = substr( $html, max( 0, $p - 300 ), min( 300, $p ) );
		if ( ! preg_match( '~<div\b[^<>]*>$~', $before, $om ) ) {
			continue;
		}
		$open  = $p - strlen( $om[0] );
		$close = sssihms_up_close_of( $html, $open );
		if ( false === $close ) {
			continue;
		}
		$head   = substr( $html, 0, $open );
		$module = max( strrpos( $head, '[et_pb_code ' ), strrpos( $head, '[et_pb_text ' ) );
		$scope  = substr( $head, (int) $module );
		$title  = '';
		if ( preg_match_all( '~<h2[^>]*>(.*?)</h2>~s', $scope, $hm ) ) {
			$title = wp_strip_all_tags( end( $hm[1] ) );
		} elseif ( preg_match( '~admin_label="([^"]*)"~', $scope, $am ) ) {
			$title = $am[1];
		}
		$inner = substr( $html, $p, $close - $p );
		$out[] = array(
			'body_start' => $p,
			'close'      => $close,
			'count'      => substr_count( $inner, $child ),
			'title'      => html_entity_decode( $title, ENT_QUOTES, 'UTF-8' ),
		);
		$at = $close;
	}
	return $out;
}

/** Every published page section that can take this type, for the "Where" dropdown. */
function sssihms_up_targets( $type ) {
	$where = sssihms_up_types()[ $type ]['where'] ?? '';
	$ids   = get_posts( array(
		'post_type'   => 'page',
		'post_status' => 'publish',
		'numberposts' => -1,
		'fields'      => 'ids',
		'orderby'     => 'title',
		'order'       => 'ASC',
	) );
	$out = array();
	foreach ( $ids as $id ) {
		$uri = get_page_uri( $id );
		if ( $where && false === stripos( $uri, $where ) ) {
			continue;
		}
		$html = get_post_field( 'post_content', $id );
		foreach ( sssihms_up_containers( $html, $type ) as $n => $c ) {
			$out[] = array(
				'key'   => $id . ':' . $n . ':' . md5( $html ),
				'label' => html_entity_decode( get_the_title( $id ), ENT_QUOTES, 'UTF-8' ) . ' — ' . ( $c['title'] ?: 'section ' . ( $n + 1 ) )
					. ' (' . $c['count'] . ')  /' . $uri . '/',
			);
		}
	}
	return $out;
}

/** Escape plain text for page HTML: one line, and no [ ] that Divi would read as a shortcode. */
function sssihms_up_text( $s ) {
	$s = trim( preg_replace( '/\s+/u', ' ', (string) $s ) );
	return str_replace( array( '[', ']' ), array( '&#91;', '&#93;' ), esc_html( $s ) );
}

function sssihms_up_initials( $name ) {
	$name  = preg_replace( '/^(Dr|Mr|Mrs|Ms|Prof)\.?\s+/i', '', trim( $name ) );
	$parts = preg_split( '/\s+/', $name );
	$first = mb_substr( $parts[0], 0, 1 );
	$last  = count( $parts ) > 1 ? mb_substr( end( $parts ), 0, 1 ) : '';
	return mb_strtoupper( $first . $last );
}

/** One card's HTML, in the markup the page already uses. */
function sssihms_up_render( $type, $f, $att ) {
	$t = 'sssihms_up_text';
	switch ( $type ) {
		case 'newsletter':
			$pdf   = wp_get_attachment_url( $att['file'] );
			$cover = wp_get_attachment_image_src( $att['cover'], 'medium' )[0];
			return '<a class="cover-cell" href="' . esc_url( $pdf ) . '"><span class="cover-shot"><img src="'
				. esc_url( $cover ) . '" alt="' . $t( $f['title'] ) . '" loading="lazy" /></span><span class="cover-label">'
				. $t( $f['title'] ) . '</span></a>';

		case 'faculty':
			$face = empty( $att['photo'] )
				? '<div class="faculty-avatar">' . $t( sssihms_up_initials( $f['name'] ) ) . '</div>'
				: '<div class="faculty-photo"><img src="' . esc_url( wp_get_attachment_image_src( $att['photo'], 'medium_large' )[0] )
					. '" alt="' . $t( $f['name'] ) . '" loading="lazy"/></div>';
			$detail = '' === trim( $f['detail'] ) ? '' : '<div class="faculty-detail">' . $t( $f['detail'] ) . '</div>';
			return '<div class="faculty-card">' . $face . '<div><div class="faculty-name">' . $t( $f['name'] )
				. '</div><div class="faculty-role">' . $t( $f['role'] ) . '</div>' . $detail . '</div></div>';

		case 'event':
			$pill = '' === trim( $f['tag'] ) ? '' : '<span class="free-pill-sm">' . $t( $f['tag'] ) . '</span>';
			$link = '' === trim( $f['link'] ) ? '' : '<a href="' . esc_url( trim( $f['link'] ) )
				. '" class="btn btn-outline" style="margin-top:8px">' . $t( $f['link_text'] ?: 'Read more' ) . ' →</a>';
			return '<div class="info-card"><div class="info-card-head"><h3>' . $t( $f['title'] ) . '</h3>' . $pill
				. '</div><p>' . $t( $f['text'] ) . '</p>' . $link . '</div>';

		case 'photos':
			$html = '';
			foreach ( $att['photos'] as $i => $id ) {
				$cap   = $t( $f['captions'][ $i ] );
				$html .= '<figure class="photo-cell"><img src="' . esc_url( wp_get_attachment_image_src( $id, 'large' )[0] )
					. '" alt="' . $cap . '" loading="lazy"/><figcaption>' . $cap . '</figcaption></figure>';
			}
			return $html;
	}
	return '';
}

/**
 * Insert $card into container $n of page $page_id and save. $hash is the md5 of the content
 * when the form was opened; if the page changed since, nothing is written.
 * Returns the new revision ID or a WP_Error.
 */
function sssihms_up_apply( $type, $page_id, $n, $hash, $card ) {
	$page = get_post( $page_id );
	if ( ! $page || 'page' !== $page->post_type ) {
		return new WP_Error( 'page', 'That page no longer exists.' );
	}
	$html = $page->post_content;
	if ( ! hash_equals( $hash, md5( $html ) ) ) {
		return new WP_Error( 'stale', 'Someone changed this page after you opened the form. Nothing was saved — reload and try again.' );
	}
	$boxes = sssihms_up_containers( $html, $type );
	if ( ! isset( $boxes[ $n ] ) ) {
		return new WP_Error( 'section', 'That section is no longer on the page.' );
	}
	$at = 'start' === sssihms_up_types()[ $type ]['pos'] ? $boxes[ $n ]['body_start'] : $boxes[ $n ]['close'];
	return sssihms_up_save( $page_id, substr( $html, 0, $at ) . $card . substr( $html, $at ) );
}

/**
 * The cards in container $n, in order: byte range, visible label and first image.
 * Stops at the first thing between cards that is not a card.
 */
function sssihms_up_items( $html, $type, $n ) {
	$boxes = sssihms_up_containers( $html, $type );
	if ( ! isset( $boxes[ $n ] ) ) {
		return null;
	}
	$child = sssihms_up_types()[ $type ]['child'];
	$tag   = substr( strtok( $child, ' ' ), 1 );
	$pos   = $boxes[ $n ]['body_start'];
	$stop  = $boxes[ $n ]['close'];
	$out   = array();
	while ( $pos < $stop && 0 === substr_compare( $html, $child, $pos, strlen( $child ) ) ) {
		if ( 'div' === $tag ) {
			$end = sssihms_up_close_of( $html, $pos );
			$end = false === $end ? false : $end + 6;
		} else {
			$end = strpos( $html, '</' . $tag . '>', $pos );
			$end = false === $end ? false : $end + strlen( $tag ) + 3;
		}
		if ( false === $end || $end > $stop ) {
			break;
		}
		$card  = substr( $html, $pos, $end - $pos );
		$label = '';
		if ( preg_match( '~class="(?:cover-label|faculty-name)">(.*?)</|<h3>(.*?)</h3>|<figcaption>(.*?)</figcaption>~s', $card, $m ) ) {
			$label = html_entity_decode( wp_strip_all_tags( implode( '', array_slice( $m, 1 ) ) ), ENT_QUOTES, 'UTF-8' );
		}
		$img = preg_match( '~<img[^>]*\ssrc="([^"]+)"~', $card, $im ) ? html_entity_decode( $im[1] ) : '';
		if ( '' === $label && $img ) {
			$label = 'Uncaptioned photo: ' . wp_basename( wp_parse_url( $img, PHP_URL_PATH ) );
		}
		$out[] = array(
			'start' => $pos,
			'end'   => $end,
			'label' => $label,
			'img'   => $img,
		);
		$pos = $end;
		while ( $pos < $stop && ctype_space( $html[ $pos ] ) ) {
			$pos++;
		}
	}
	return $out;
}

/** Remove cards $idx (indexes into sssihms_up_items) from container $n. Same checks as apply. */
function sssihms_up_remove( $type, $page_id, $n, $hash, $idx ) {
	$page = get_post( $page_id );
	if ( ! $page || 'page' !== $page->post_type ) {
		return new WP_Error( 'page', 'That page no longer exists.' );
	}
	$html = $page->post_content;
	if ( ! hash_equals( $hash, md5( $html ) ) ) {
		return new WP_Error( 'stale', 'Someone changed this page after you opened the list. Nothing was removed — reload and try again.' );
	}
	$items = sssihms_up_items( $html, $type, $n );
	if ( null === $items ) {
		return new WP_Error( 'section', 'That section is no longer on the page.' );
	}
	$idx = array_values( array_unique( array_intersect( array_map( 'intval', $idx ), array_keys( $items ) ) ) );
	if ( ! $idx ) {
		return new WP_Error( 'none', 'Tick at least one item to remove.' );
	}
	if ( count( $idx ) >= count( $items ) ) {
		return new WP_Error( 'all', 'At least one item must stay. To remove a whole section, ask the web team.' );
	}
	rsort( $idx );
	foreach ( $idx as $i ) {
		$html = substr( $html, 0, $items[ $i ]['start'] ) . substr( $html, $items[ $i ]['end'] );
	}
	return sssihms_up_save( $page_id, $html );
}

/** Save new page content as a revision, then purge caches. Returns the revision ID or WP_Error. */
function sssihms_up_save( $page_id, $new ) {
	// Editors on a multisite lack unfiltered_html, so kses would strip the page's inline
	// styles and <style> blocks on save. The only change is the escaped card added or a
	// whole existing card removed.
	$kses = has_filter( 'content_save_pre', 'wp_filter_post_kses' );
	kses_remove_filters();
	// 135 pages still name page-template-fullwidth.php, which the current theme lacks.
	// wp_insert_post would save the content, then bail with "Invalid page template"
	// before the revision and save hooks run. An empty page_template skips that check
	// and leaves the template meta as it is.
	$r = wp_update_post( array( 'ID' => $page_id, 'post_content' => wp_slash( $new ), 'page_template' => '' ), true );
	if ( $kses ) {
		kses_init_filters();
	}
	if ( is_wp_error( $r ) ) {
		return $r;
	}
	if ( function_exists( 'w3tc_flush_post' ) ) {
		w3tc_flush_post( $page_id );
	}
	if ( class_exists( 'ET_Core_PageResource' ) ) {
		ET_Core_PageResource::remove_static_resources( $page_id, 'all' );
	}
	$revs = wp_get_post_revisions( $page_id, array( 'numberposts' => 1 ) );
	return $revs ? (int) key( $revs ) : 0;
}

/** Upload one form file into the media library, attached to the page. */
function sssihms_up_upload( $field, $page_id, $kind, $alt = '' ) {
	$f = $_FILES[ $field ] ?? null;
	if ( ! $f || UPLOAD_ERR_NO_FILE === $f['error'] ) {
		return null;
	}
	if ( UPLOAD_ERR_OK !== $f['error'] ) {
		return new WP_Error( 'upload', $f['name'] . ': upload failed (code ' . (int) $f['error'] . ') — the file may be too large.' );
	}
	$check = wp_check_filetype_and_ext( $f['tmp_name'], $f['name'] );
	$ok    = 'pdf' === $kind ? ( 'application/pdf' === $check['type'] ) : in_array( $check['type'], array( 'image/jpeg', 'image/png', 'image/webp' ), true );
	if ( ! $ok ) {
		return new WP_Error( 'type', $f['name'] . ': must be ' . ( 'pdf' === $kind ? 'a PDF.' : 'a JPG, PNG or WebP image.' ) );
	}
	$id = media_handle_upload( $field, $page_id );
	if ( ! is_wp_error( $id ) && '' !== $alt ) {
		update_post_meta( $id, '_wp_attachment_image_alt', sanitize_text_field( $alt ) );
	}
	return $id;
}

function sssihms_up_log( $entry ) {
	$log = get_option( 'sssihms_up_log', array() );
	array_unshift( $log, $entry );
	update_option( 'sssihms_up_log', array_slice( $log, 0, 50 ), false );
}

/** Handles the POST. Returns array( 'ok' => bool, 'msg' => string ). */
function sssihms_up_handle( $type ) {
	check_admin_referer( 'sssihms_up_' . $type );
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	$f = wp_unslash( $_POST );
	list( $page_id, $n, $hash ) = array_pad( explode( ':', (string) ( $f['target'] ?? '' ) ), 3, '' );
	$page_id = (int) $page_id;
	if ( ! $page_id || ! current_user_can( 'edit_page', $page_id ) ) {
		return array( 'ok' => false, 'msg' => 'Choose where the item goes.' );
	}

	// Required fields first, before anything is uploaded.
	$need = array(
		'newsletter' => array( 'title' ),
		'faculty'    => array( 'name', 'role' ),
		'event'      => array( 'title', 'text' ),
		'photos'     => array(),
	)[ $type ];
	foreach ( $need as $k ) {
		if ( '' === trim( $f[ $k ] ?? '' ) ) {
			return array( 'ok' => false, 'msg' => 'Please fill in every required field.' );
		}
	}
	$has = function ( $k ) {
		return isset( $_FILES[ $k ] ) && UPLOAD_ERR_NO_FILE !== $_FILES[ $k ]['error'];
	};
	if ( in_array( $type, array( 'faculty', 'photos' ), true ) && empty( $f['consent'] ) && ( $has( 'photo' ) || 'photos' === $type ) ) {
		return array( 'ok' => false, 'msg' => 'Please confirm the photo consent box.' );
	}

	$att = array();
	if ( 'newsletter' === $type ) {
		if ( ! $has( 'file' ) || ! $has( 'cover' ) ) {
			return array( 'ok' => false, 'msg' => 'A newsletter needs both the PDF and a cover image.' );
		}
		foreach ( array( 'file' => 'pdf', 'cover' => 'image' ) as $k => $kind ) {
			$att[ $k ] = sssihms_up_upload( $k, $page_id, $kind, 'cover' === $k ? $f['title'] : '' );
			if ( is_wp_error( $att[ $k ] ) ) {
				return array( 'ok' => false, 'msg' => $att[ $k ]->get_error_message() );
			}
		}
	} elseif ( 'faculty' === $type ) {
		$att['photo'] = sssihms_up_upload( 'photo', $page_id, 'image', $f['name'] );
		if ( is_wp_error( $att['photo'] ) ) {
			return array( 'ok' => false, 'msg' => $att['photo']->get_error_message() );
		}
	} elseif ( 'photos' === $type ) {
		$att['photos'] = array();
		$f['captions'] = array();
		for ( $i = 1; $i <= 6; $i++ ) {
			if ( ! $has( 'photo_' . $i ) ) {
				continue;
			}
			$cap = trim( $f[ 'caption_' . $i ] ?? '' );
			if ( '' === $cap ) {
				return array( 'ok' => false, 'msg' => 'Every photo needs a caption (photo ' . $i . ').' );
			}
			$id = sssihms_up_upload( 'photo_' . $i, $page_id, 'image', $cap );
			if ( is_wp_error( $id ) ) {
				return array( 'ok' => false, 'msg' => $id->get_error_message() );
			}
			$att['photos'][] = $id;
			$f['captions'][] = $cap;
		}
		if ( ! $att['photos'] ) {
			return array( 'ok' => false, 'msg' => 'Choose at least one photo.' );
		}
	}

	$rev = sssihms_up_apply( $type, $page_id, (int) $n, $hash, sssihms_up_render( $type, $f, $att ) );
	if ( is_wp_error( $rev ) ) {
		return array( 'ok' => false, 'msg' => $rev->get_error_message() . ( $att ? ' (Uploaded files are kept in the Media Library.)' : '' ) );
	}
	$what = $f['title'] ?? ( $f['name'] ?? count( $att['photos'] ) . ' photo(s)' );
	sssihms_up_log( array(
		'time'   => current_time( 'mysql' ),
		'user'   => wp_get_current_user()->user_login,
		'type'   => $type,
		'action' => 'added',
		'what'   => $what,
		'page' => $page_id,
		'rev'  => $rev,
	) );
	return array(
		'ok'  => true,
		'msg' => 'Added “' . $what . '” to <a href="' . esc_url( get_permalink( $page_id ) ) . '" target="_blank">'
			. esc_html( get_the_title( $page_id ) ) . '</a>. It is live now.',
	);
}

function sssihms_up_field( $label, $name, $opts = array() ) {
	$req  = ! empty( $opts['required'] );
	$type = $opts['type'] ?? 'text';
	echo '<tr><th scope="row"><label for="' . esc_attr( $name ) . '">' . esc_html( $label ) . ( $req ? ' *' : '' ) . '</label></th><td>';
	if ( 'textarea' === $type ) {
		echo '<textarea class="large-text" rows="4" id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '"' . ( $req ? ' required' : '' ) . '></textarea>';
	} else {
		$accept = isset( $opts['accept'] ) ? ' accept="' . esc_attr( $opts['accept'] ) . '"' : '';
		$cls    = 'file' === $type ? '' : ' class="regular-text"';
		echo '<input type="' . esc_attr( $type ) . '"' . $cls . ' id="' . esc_attr( $name ) . '" name="' . esc_attr( $name ) . '"' . $accept . ( $req ? ' required' : '' ) . '>';
	}
	if ( ! empty( $opts['help'] ) ) {
		echo '<p class="description">' . esc_html( $opts['help'] ) . '</p>';
	}
	echo '</td></tr>';
}

/** Handles the Remove POST. Returns array( 'ok' => bool, 'msg' => string ). */
function sssihms_up_handle_remove() {
	check_admin_referer( 'sssihms_up_remove' );
	$f = wp_unslash( $_POST );
	list( $type, $key ) = array_pad( explode( '|', (string) ( $f['sel'] ?? '' ), 2 ), 2, '' );
	list( $page_id, $n, $hash ) = array_pad( explode( ':', $key ), 3, '' );
	$page_id = (int) $page_id;
	if ( ! isset( sssihms_up_types()[ $type ] ) || ! $page_id || ! current_user_can( 'edit_page', $page_id ) ) {
		return array( 'ok' => false, 'msg' => 'Choose a section first.' );
	}
	if ( empty( $f['confirm'] ) ) {
		return array( 'ok' => false, 'msg' => 'Please tick the confirmation box.' );
	}
	$idx   = (array) ( $f['remove'] ?? array() );
	$items = sssihms_up_items( get_post_field( 'post_content', $page_id ), $type, (int) $n );
	$names = array();
	foreach ( $idx as $i ) {
		if ( isset( $items[ (int) $i ] ) ) {
			$names[] = $items[ (int) $i ]['label'] ?: 'item ' . ( (int) $i + 1 );
		}
	}
	$rev = sssihms_up_remove( $type, $page_id, (int) $n, $hash, $idx );
	if ( is_wp_error( $rev ) ) {
		return array( 'ok' => false, 'msg' => $rev->get_error_message() );
	}
	$what = implode( ', ', $names );
	sssihms_up_log( array(
		'time'   => current_time( 'mysql' ),
		'user'   => wp_get_current_user()->user_login,
		'type'   => $type,
		'action' => 'removed',
		'what'   => $what,
		'page'   => $page_id,
		'rev'    => $rev,
	) );
	return array(
		'ok'  => true,
		'msg' => 'Removed “' . esc_html( $what ) . '” from <a href="' . esc_url( get_permalink( $page_id ) ) . '" target="_blank">'
			. esc_html( get_the_title( $page_id ) ) . '</a>. The files are still in the Media Library.',
	);
}

/** The Remove tab: pick a section, then tick the items to take off the page. */
function sssihms_up_remove_tab( $base ) {
	$types = sssihms_up_types();
	$sel   = isset( $_REQUEST['sel'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['sel'] ) ) : '';
	list( $stype, $key ) = array_pad( explode( '|', $sel, 2 ), 2, '' );
	$page_id = (int) $key;

	// Step 1: choose the section (a GET form, so the list below always reflects the live page).
	echo '<form method="get" action="' . esc_url( admin_url( 'admin.php' ) ) . '"><input type="hidden" name="page" value="sssihms-updates"><input type="hidden" name="type" value="remove">';
	echo '<table class="form-table" role="presentation"><tr><th scope="row"><label for="sel">Section</label></th><td><select id="sel" name="sel" required style="max-width:100%"><option value="">— choose a page section —</option>';
	foreach ( $types as $t => $cfg ) {
		echo '<optgroup label="' . esc_attr( $cfg['label'] ) . '">';
		foreach ( sssihms_up_targets( $t ) as $o ) {
			if ( ! current_user_can( 'edit_page', (int) $o['key'] ) ) {
				continue;
			}
			// Match on page + section only; the hash in the key changes with every save.
			$v    = $t . '|' . $o['key'];
			$same = $stype === $t && implode( ':', array_slice( explode( ':', $key ), 0, 2 ) ) === implode( ':', array_slice( explode( ':', $o['key'] ), 0, 2 ) );
			echo '<option value="' . esc_attr( $v ) . '"' . selected( $same, true, false ) . '>' . esc_html( $o['label'] ) . '</option>';
		}
		echo '</optgroup>';
	}
	echo '</select> <button class="button">Show items</button></td></tr></table></form>';

	if ( ! isset( $types[ $stype ] ) || ! $page_id || ! current_user_can( 'edit_page', $page_id ) ) {
		return;
	}
	list( , $n ) = array_pad( explode( ':', $key ), 2, 0 );
	$html  = get_post_field( 'post_content', $page_id );
	$items = sssihms_up_items( $html, $stype, (int) $n );
	if ( ! $items ) {
		echo '<p>That section is no longer on the page. Choose it again from the list.</p>';
		return;
	}
	$live = $stype . '|' . $page_id . ':' . (int) $n . ':' . md5( $html );

	// Step 2: tick and confirm.
	echo '<form method="post" action="' . esc_url( add_query_arg( array( 'type' => 'remove', 'sel' => $live ), $base ) ) . '">';
	wp_nonce_field( 'sssihms_up_remove' );
	echo '<input type="hidden" name="sel" value="' . esc_attr( $live ) . '">';
	echo '<h2>Tick the items to remove</h2><table class="widefat striped" style="max-width:900px"><tbody>';
	foreach ( $items as $i => $it ) {
		echo '<tr><td style="width:30px"><input type="checkbox" id="rm' . $i . '" name="remove[]" value="' . $i . '"></td><td style="width:70px">'
			. ( $it['img'] ? '<img src="' . esc_url( $it['img'] ) . '" alt="" style="width:60px;height:60px;object-fit:cover;display:block">' : '' )
			. '</td><td><label for="rm' . $i . '">' . esc_html( $it['label'] ?: 'Item ' . ( $i + 1 ) ) . '</label></td></tr>';
	}
	echo '</tbody></table>';
	echo '<p><label><input type="checkbox" name="confirm" value="1" required> Remove the ticked items from the live page. (Photos and PDFs stay in the Media Library; the page’s <em>Revisions</em> screen can bring the items back.)</label></p>';
	submit_button( 'Remove from page', 'delete' );
	echo '</form>';
}

function sssihms_up_page() {
	$types = sssihms_up_types();
	$tabs  = array_merge( wp_list_pluck( $types, 'label' ), array( 'remove' => 'Remove item' ) );
	$type  = isset( $_GET['type'], $tabs[ $_GET['type'] ] ) ? $_GET['type'] : 'newsletter';
	$base  = admin_url( 'admin.php?page=sssihms-updates' );

	echo '<div class="wrap"><h1>Site Updates</h1>';
	echo '<p>Add or remove an item in a section that already exists on the website. The page is not otherwise changed, and every change can be undone from the page’s <em>Revisions</em> screen.</p>';

	if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {
		$r = 'remove' === $type ? sssihms_up_handle_remove() : sssihms_up_handle( $type );
		echo '<div class="notice notice-' . ( $r['ok'] ? 'success' : 'error' ) . '"><p>' . wp_kses( $r['msg'], array( 'a' => array( 'href' => true, 'target' => true ) ) ) . '</p></div>';
	}

	echo '<nav class="nav-tab-wrapper">';
	foreach ( $tabs as $k => $label ) {
		echo '<a class="nav-tab' . ( $k === $type ? ' nav-tab-active' : '' ) . '" href="' . esc_url( add_query_arg( 'type', $k, $base ) ) . '">' . esc_html( $label ) . '</a>';
	}
	echo '</nav>';

	if ( 'remove' === $type ) {
		sssihms_up_remove_tab( $base );
		sssihms_up_log_table( $types );
		echo '</div>';
		return;
	}

	$targets = array_filter( sssihms_up_targets( $type ), function ( $t ) {
		return current_user_can( 'edit_page', (int) $t['key'] );
	} );
	echo '<form method="post" enctype="multipart/form-data" action="' . esc_url( add_query_arg( 'type', $type, $base ) ) . '">';
	wp_nonce_field( 'sssihms_up_' . $type );
	echo '<table class="form-table" role="presentation"><tr><th scope="row"><label for="target">Where *</label></th><td><select id="target" name="target" required style="max-width:100%"><option value="">— choose a page section —</option>';
	foreach ( $targets as $t ) {
		echo '<option value="' . esc_attr( $t['key'] ) . '">' . esc_html( $t['label'] ) . '</option>';
	}
	echo '</select><p class="description">The number in brackets is how many items the section has now. ';
	echo 'start' === $types[ $type ]['pos'] ? 'The new item goes first.' : 'The new item goes last.';
	echo '</p></td></tr>';

	$photo_consent = 'I confirm no patient can be identified in these photos, or written consent is on file.';
	switch ( $type ) {
		case 'newsletter':
			sssihms_up_field( 'Title', 'title', array( 'required' => true, 'help' => 'As it should appear under the cover, e.g. “AntharDhwani XVI – July 2026”.' ) );
			sssihms_up_field( 'PDF', 'file', array( 'type' => 'file', 'accept' => 'application/pdf', 'required' => true, 'help' => 'Use the low-resolution version; large PDFs are slow on phones.' ) );
			sssihms_up_field( 'Cover image', 'cover', array( 'type' => 'file', 'accept' => 'image/jpeg,image/png,image/webp', 'required' => true, 'help' => 'A JPG or PNG of the front cover, portrait.' ) );
			break;
		case 'faculty':
			sssihms_up_field( 'Name', 'name', array( 'required' => true, 'help' => 'e.g. “Dr. A. Kumar”.' ) );
			sssihms_up_field( 'Designation', 'role', array( 'required' => true, 'help' => 'e.g. “Consultant” or “MD, DM (Cardiology)”.' ) );
			sssihms_up_field( 'Details', 'detail', array( 'type' => 'textarea', 'help' => 'Optional: qualifications, areas of interest, or current affiliation.' ) );
			sssihms_up_field( 'Photo', 'photo', array( 'type' => 'file', 'accept' => 'image/jpeg,image/png,image/webp', 'help' => 'Optional. A portrait with the face in the upper half. Without a photo the card shows initials.' ) );
			echo '<tr><th scope="row">Consent</th><td><label><input type="checkbox" name="consent" value="1"> The person has agreed to their photo being on the website.</label></td></tr>';
			break;
		case 'event':
			sssihms_up_field( 'Event title', 'title', array( 'required' => true ) );
			sssihms_up_field( 'Tag', 'tag', array( 'help' => 'Optional short label shown as a pill, e.g. “CME”, “Workshop”, “Annual”.' ) );
			sssihms_up_field( 'Description', 'text', array( 'type' => 'textarea', 'required' => true, 'help' => 'Include the date and venue, e.g. “held in Dhanvantari Hall on 19 October 2026”.' ) );
			sssihms_up_field( 'Link', 'link', array( 'type' => 'url', 'help' => 'Optional: a page or brochure with more detail.' ) );
			sssihms_up_field( 'Link text', 'link_text', array( 'help' => 'Optional, e.g. “Programme”. Defaults to “Read more”.' ) );
			break;
		case 'photos':
			for ( $i = 1; $i <= 6; $i++ ) {
				echo '<tr><th scope="row">Photo ' . $i . ( 1 === $i ? ' *' : '' ) . '</th><td><input type="file" name="photo_' . $i . '" accept="image/jpeg,image/png,image/webp"' . ( 1 === $i ? ' required' : '' ) . '> ';
				echo '<input type="text" class="regular-text" name="caption_' . $i . '" placeholder="Caption (required with a photo)"></td></tr>';
			}
			echo '<tr><th scope="row">Consent *</th><td><label><input type="checkbox" name="consent" value="1" required> ' . esc_html( $photo_consent ) . '</label></td></tr>';
			break;
	}
	echo '</table>';
	submit_button( 'Add to page' );
	echo '</form>';
	sssihms_up_log_table( $types );
	echo '</div>';
}

function sssihms_up_log_table( $types ) {
	$log = get_option( 'sssihms_up_log', array() );
	if ( $log ) {
		echo '<h2>Recent changes</h2><table class="widefat striped"><thead><tr><th>When</th><th>Who</th><th>What</th><th>Page</th><th>Undo</th></tr></thead><tbody>';
		foreach ( array_slice( $log, 0, 15 ) as $e ) {
			$verb = ( $e['action'] ?? 'added' ) === 'removed' ? 'Removed ' : 'Added ';
			echo '<tr><td>' . esc_html( $e['time'] ) . '</td><td>' . esc_html( $e['user'] ) . '</td><td>' . esc_html( $verb . strtolower( $types[ $e['type'] ]['label'] ) . ': ' . $e['what'] )
				. '</td><td><a href="' . esc_url( get_permalink( $e['page'] ) ) . '" target="_blank">' . esc_html( get_the_title( $e['page'] ) ) . '</a></td><td>'
				. ( $e['rev'] ? '<a href="' . esc_url( admin_url( 'revision.php?revision=' . (int) $e['rev'] ) ) . '">Revisions</a>' : '' ) . '</td></tr>';
		}
		echo '</tbody></table>';
	}
}

add_action( 'admin_menu', function () {
	if ( sssihms_up_is_target() ) {
		add_menu_page( 'Site Updates', 'Site Updates', 'edit_pages', 'sssihms-updates', 'sssihms_up_page', 'dashicons-upload', 3 );
	}
} );
