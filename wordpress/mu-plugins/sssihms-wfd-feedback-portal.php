<?php
/**
 * Plugin Name: SSSIHMS Whitefield — Patient Feedback Portal
 * Description: OTP-verified patient feedback with text and voice, numbered tickets, deadlines, reminders, escalation and a monthly report. Shortcode [sssihms_feedback_portal]. Blog 4 only.
 *
 * Phase 1 of "Digital Patient Feedback Portal — SOP and Implementation Plan" (draft 0.1,
 * 26-Oct-2026). Section numbers in the comments refer to that document.
 *
 * One intake (section 9): every channel creates tickets through sssihms_fb_intake() — the web
 * form (mobile verified by OTP, or staff-assisted entry and paper forms keyed in by the
 * Feedback Cell) and, later, WhatsApp or any other system through the signed REST endpoint
 * POST /wp-json/sssihms-fb/v1/intake (secret SSSIHMS_FB_INTAKE_SECRET in wp-config.php).
 *
 * SMS (Annexure A) goes through sssihms_fb_sms(). The hospital's integration either answers
 * the `sssihms_fb_sms_send` filter or defines the SSSIHMS_EXOTEL_* constants in wp-config.php
 * for the built-in Exotel call. Until one of them is in place no SMS is sent, each attempt is
 * logged on its ticket, and an OTP can be completed only by logged-in Feedback Cell staff, who
 * see the code on screen, so every flow can be tested before go-live.
 *
 * Data stays on this server (section 7): three tables (tickets, history, OTPs; OTPs and IPs
 * are stored only as keyed hashes) and voice files in wp-content/sssihms-feedback-private/,
 * which Apache refuses to serve. Staff play recordings through admin-post.php after a
 * permission check. Every view, play, change and export is written to the history table,
 * which is never edited.
 *
 * Uses sssihms_fa_css(), sssihms_fa_write_xlsx() and sssihms_fa_send_download() from
 * sssihms-wfd-fellowship-application.php.
 */

defined( 'ABSPATH' ) || exit;

const SSSIHMS_FB_DB       = 1;
const SSSIHMS_FB_FALLBACK = 'helpdeskblr@sssihms.org.in'; // Gets Cell emails until Cell staff accounts exist.
const SSSIHMS_FB_HELP     = '080-4710 4600';

// Capabilities. Roles are set up in sssihms_fb_install().
const SSSIHMS_FB_ACCESS = 'sssihms_fb_access'; // Any portal role: the Feedback Tickets menu.
const SSSIHMS_FB_CELL   = 'sssihms_fb_cell';   // Feedback Cell: sees and runs every ticket.
const SSSIHMS_FB_EXPORT = 'sssihms_fb_export'; // Coordinator: Excel export of tickets, settings, erasure.
const SSSIHMS_FB_OWNER  = 'sssihms_fb_owner';  // Department owner: tickets assigned to them.
const SSSIHMS_FB_ESC1   = 'sssihms_fb_esc1';   // Escalation level 1 (Hospital Administration).
const SSSIHMS_FB_ESC2   = 'sssihms_fb_esc2';   // Escalation level 2 (Director).

function sssihms_fb_is_target() {
	return is_multisite() && get_current_blog_id() === 4;
}

function sssihms_fb_t( $name ) {
	global $wpdb;
	return $wpdb->prefix . 'sssihms_fb_' . $name;
}

/* ---------- Reference lists (sections 5.1, 6, Annexures A and B) ---------- */

/** Annexure B: key => array( label, default priority ). "Other" gets Normal until triage. */
function sssihms_fb_categories() {
	return array(
		'appreciation' => array( 'Appreciation', 'appreciation' ),
		'clinical'     => array( 'Doctor / clinical care', 'normal' ),
		'nursing'      => array( 'Nursing care', 'normal' ),
		'behaviour'    => array( 'Staff behaviour', 'high' ),
		'food'         => array( 'Food and dietary', 'normal' ),
		'cleanliness'  => array( 'Cleanliness and housekeeping', 'normal' ),
		'waiting'      => array( 'Waiting time and appointments', 'normal' ),
		'information'  => array( 'Information and communication', 'normal' ),
		'facilities'   => array( 'Facilities (water, toilets, lifts, seating, parking)', 'normal' ),
		'safety'       => array( 'Safety and security', 'high' ),
		'privacy'      => array( 'Privacy or dignity', 'critical' ),
		'suggestion'   => array( 'Suggestion', 'suggestion' ),
		'other'        => array( 'Other', 'normal' ),
	);
}

/**
 * Section 5.1. assign: array( n, 'h' working hours | 'd' working days ); resolve: working days;
 * esc: the highest level a missed deadline reaches. Appreciation has no limit in the SOP;
 * 2 working days is used so that it still shows up as overdue.
 */
function sssihms_fb_priorities() {
	return array(
		'critical'     => array( 'label' => 'Critical', 'assign' => array( 2, 'h' ), 'resolve' => 3, 'esc' => 2 ),
		'high'         => array( 'label' => 'High', 'assign' => array( 1, 'd' ), 'resolve' => 3, 'esc' => 2 ),
		'normal'       => array( 'label' => 'Normal', 'assign' => array( 1, 'd' ), 'resolve' => 7, 'esc' => 1 ),
		'suggestion'   => array( 'label' => 'Suggestion', 'assign' => array( 2, 'd' ), 'resolve' => 15, 'esc' => 0 ),
		'appreciation' => array( 'label' => 'Appreciation', 'assign' => array( 2, 'd' ), 'resolve' => 2, 'esc' => 0 ),
	);
}

/** Section 5.2. "resolved" means the Cell has replied and the patient has not yet answered. */
function sssihms_fb_statuses() {
	return array(
		'new'      => 'New',
		'assigned' => 'Assigned',
		'action'   => 'Action taken',
		'resolved' => 'Resolved — awaiting patient',
		'reopened' => 'Reopened',
		'closed'   => 'Closed',
	);
}

const SSSIHMS_FB_OPEN = array( 'new', 'assigned', 'action', 'reopened' );

function sssihms_fb_channels() {
	return array( 'web' => 'Web form (QR)', 'assisted' => 'Assisted entry', 'paper' => 'Paper form', 'whatsapp' => 'WhatsApp', 'api' => 'Other system' );
}

/** Closure reasons offered to the Cell, including the out-of-scope routes in section 1. */
function sssihms_fb_close_reasons() {
	return array(
		'appreciation' => 'Appreciation forwarded to the staff member and HOD',
		'incident'     => 'Routed to incident reporting (patient safety)',
		'posh'         => 'Routed to the Internal Committee (POSH Act)',
		'mrd'          => 'Routed to the Medical Records Department',
		'emergency'    => 'Handled as an emergency on the spot',
		'noreply'      => 'Patient could not be reached',
		'other'        => 'Other (explain in the note)',
	);
}

/** Annexure A, word for word. Each {#var#} is filled in order. */
function sssihms_fb_sms_templates() {
	return array(
		'otp'      => '{#var#} is your OTP for SSSIHMS Whitefield patient feedback. Valid for 10 minutes. Do not share it with anyone. - SSSIHMS',
		'ack'      => 'Sairam. Your feedback is received, ticket {#var#}. Patient Welfare Services will respond within {#var#} working days. - SSSIHMS',
		'assigned' => 'Sairam. Your feedback {#var#} is being looked into by the {#var#} team. - SSSIHMS',
		'resolved' => 'Sairam. Your feedback {#var#} has been addressed. Please tell us if you are satisfied: {#var#} - SSSIHMS',
	);
}

function sssihms_fb_settings() {
	return wp_parse_args(
		(array) get_option( 'sssihms_fb_settings', array() ),
		array(
			'hours'        => '09:00-17:00',
			'holidays'     => '',
			// Section 6. Ward, OPD and lift codes are added by PWS as the posters go up.
			'locations'    => "entrance|Main entrance and enquiry desk\nopd-reg|OPD registration\nadmission|Admission counter\ndischarge|Discharge counter\nicu-wait|ICU attendant waiting area\not-wait|OT attendant waiting area\npharmacy|Pharmacy\nlab|Laboratory sample collection\nradiology|Radiology waiting area\ndining|Patient and attendant dining area",
			'report_to'    => '',
			'retention'    => 0,
			'dlt_otp'      => '',
			'dlt_ack'      => '',
			'dlt_assigned' => '',
			'dlt_resolved' => '',
		)
	);
}

/** code => label, from the settings lines "code|Label". */
function sssihms_fb_locations() {
	$out = array();
	foreach ( preg_split( '/\R/', sssihms_fb_settings()['locations'] ) as $line ) {
		$parts = array_map( 'trim', explode( '|', $line, 2 ) );
		if ( preg_match( '/^[a-z0-9-]{1,40}$/', $parts[0] ) ) {
			$out[ $parts[0] ] = $parts[1] ?? $parts[0];
		}
	}
	return $out;
}

/* ---------- Install: tables and roles ---------- */

add_action( 'init', 'sssihms_fb_install', 5 );
function sssihms_fb_install() {
	if ( ! sssihms_fb_is_target() || SSSIHMS_FB_DB === (int) get_option( 'sssihms_fb_db' ) ) {
		return;
	}
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	$c = $wpdb->get_charset_collate();
	dbDelta(
		'CREATE TABLE ' . sssihms_fb_t( 'tickets' ) . " (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  ticket_no varchar(20) NOT NULL,
  created_at datetime NOT NULL,
  channel varchar(12) NOT NULL,
  ext_ref varchar(80) NOT NULL DEFAULT '',
  src varchar(40) NOT NULL DEFAULT '',
  lang varchar(5) NOT NULL DEFAULT 'en',
  category varchar(20) NOT NULL,
  priority varchar(20) NOT NULL,
  status varchar(12) NOT NULL DEFAULT 'new',
  owner_id bigint(20) unsigned NOT NULL DEFAULT 0,
  esc_level tinyint(3) unsigned NOT NULL DEFAULT 0,
  escalations smallint(5) unsigned NOT NULL DEFAULT 0,
  phone varchar(10) NOT NULL DEFAULT '',
  phone_verified tinyint(1) NOT NULL DEFAULT 0,
  email varchar(190) NOT NULL DEFAULT '',
  patient_name varchar(120) NOT NULL DEFAULT '',
  patient_id varchar(40) NOT NULL DEFAULT '',
  attendant varchar(120) NOT NULL DEFAULT '',
  body text NOT NULL,
  audio varchar(80) NOT NULL DEFAULT '',
  audio_mime varchar(40) NOT NULL DEFAULT '',
  audio_secs smallint(5) unsigned NOT NULL DEFAULT 0,
  summary varchar(255) NOT NULL DEFAULT '',
  staff_id bigint(20) unsigned NOT NULL DEFAULT 0,
  consent tinyint(1) NOT NULL DEFAULT 0,
  token varchar(16) NOT NULL,
  assign_due datetime NOT NULL,
  resolve_due datetime NOT NULL,
  reminded varchar(60) NOT NULL DEFAULT '',
  assigned_at datetime NULL,
  resolved_at datetime NULL,
  closed_at datetime NULL,
  close_reason varchar(20) NOT NULL DEFAULT '',
  satisfied tinyint(1) NULL,
  reopened smallint(5) unsigned NOT NULL DEFAULT 0,
  extended smallint(5) unsigned NOT NULL DEFAULT 0,
  merged_into bigint(20) unsigned NOT NULL DEFAULT 0,
  hold tinyint(1) NOT NULL DEFAULT 0,
  is_test tinyint(1) NOT NULL DEFAULT 0,
  audio_deleted_at datetime NULL,
  deidentified_at datetime NULL,
  PRIMARY KEY  (id),
  UNIQUE KEY ticket_no (ticket_no),
  UNIQUE KEY token (token),
  KEY status (status),
  KEY owner_id (owner_id),
  KEY created_at (created_at),
  KEY ext_ref (ext_ref)
) $c;"
	);
	dbDelta(
		'CREATE TABLE ' . sssihms_fb_t( 'log' ) . " (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  ticket_id bigint(20) unsigned NOT NULL,
  at datetime NOT NULL,
  user_id bigint(20) unsigned NOT NULL DEFAULT 0,
  action varchar(30) NOT NULL,
  detail text NOT NULL,
  PRIMARY KEY  (id),
  KEY ticket_id (ticket_id)
) $c;"
	);
	dbDelta(
		'CREATE TABLE ' . sssihms_fb_t( 'otp' ) . " (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  phone_hash char(64) NOT NULL,
  ip_hash char(64) NOT NULL,
  code_hash char(64) NOT NULL,
  created_at datetime NOT NULL,
  expires_at datetime NOT NULL,
  sent tinyint(1) NOT NULL DEFAULT 0,
  tries tinyint(3) unsigned NOT NULL DEFAULT 0,
  locked_until datetime NULL,
  verified_at datetime NULL,
  PRIMARY KEY  (id),
  KEY phone_hash (phone_hash),
  KEY ip_hash (ip_hash),
  KEY created_at (created_at)
) $c;"
	);

	$base = array( 'read' => true, SSSIHMS_FB_ACCESS => true );
	add_role( 'sssihms_fb_coord', 'Feedback Cell coordinator', $base + array( SSSIHMS_FB_CELL => true, SSSIHMS_FB_EXPORT => true, 'sssihms_pws' => true ) );
	add_role( 'sssihms_fb_owner', 'Feedback department owner', $base + array( SSSIHMS_FB_OWNER => true ) );
	add_role( 'sssihms_fb_esc1', 'Feedback escalation level 1', $base + array( SSSIHMS_FB_ESC1 => true ) );
	add_role( 'sssihms_fb_esc2', 'Feedback escalation level 2 (Director)', $base + array( SSSIHMS_FB_ESC2 => true ) );
	$pws = get_role( 'sssihms_pws' ); // Patient Welfare Services staff form the Feedback Cell.
	if ( $pws ) {
		$pws->add_cap( SSSIHMS_FB_ACCESS );
		$pws->add_cap( SSSIHMS_FB_CELL );
	}
	$admin = get_role( 'administrator' );
	foreach ( array( SSSIHMS_FB_ACCESS, SSSIHMS_FB_CELL, SSSIHMS_FB_EXPORT, SSSIHMS_FB_OWNER, SSSIHMS_FB_ESC1, SSSIHMS_FB_ESC2 ) as $cap ) {
		$admin->add_cap( $cap );
	}
	if ( ! get_option( 'sssihms_fb_report_sent' ) ) { // No report for the months before the portal existed.
		update_option( 'sssihms_fb_report_sent', wp_date( 'Y-m', strtotime( 'first day of last month' ) ) );
	}
	update_option( 'sssihms_fb_db', SSSIHMS_FB_DB );
}

/* ---------- Small helpers ---------- */

function sssihms_fb_now() {
	return current_time( 'mysql' );
}

/** Local (IST) time string, moved by a strtotime() phrase such as '-1 hour'. */
function sssihms_fb_at( $modify ) {
	return ( new DateTimeImmutable( 'now', wp_timezone() ) )->modify( $modify )->format( 'Y-m-d H:i:s' );
}

function sssihms_fb_dt( $s ) {
	return new DateTimeImmutable( $s, wp_timezone() );
}

function sssihms_fb_show( $s ) {
	return $s ? sssihms_fb_dt( $s )->format( 'd-M-Y H:i' ) : '';
}

function sssihms_fb_hash( $s ) {
	return hash_hmac( 'sha256', $s, wp_salt( 'nonce' ) );
}

/** Indian mobile number as 10 digits, or ''. Accepts +91, 91 or 0 in front, spaces and dashes. */
function sssihms_fb_phone( $raw ) {
	$p = preg_replace( '/[\s().-]/', '', (string) $raw );
	$p = preg_replace( '/^(\+?91|0)(?=\d{10}$)/', '', $p );
	return preg_match( '/^[6-9]\d{9}$/', $p ) ? $p : '';
}

function sssihms_fb_mask( $p ) {
	return '+91 ' . substr( $p, 0, 2 ) . 'XXXXX' . substr( $p, -3 );
}

function sssihms_fb_ip_hash() {
	return sssihms_fb_hash( 'ip|' . ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
}

function sssihms_fb_get( $id ) {
	global $wpdb;
	return $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . sssihms_fb_t( 'tickets' ) . ' WHERE id = %d', $id ) );
}

function sssihms_fb_update( $t, array $data ) {
	global $wpdb;
	$wpdb->update( sssihms_fb_t( 'tickets' ), $data, array( 'id' => $t->id ) );
	foreach ( $data as $k => $v ) {
		$t->$k = $v;
	}
}

function sssihms_fb_log( $ticket_id, $action, $detail = '' ) {
	global $wpdb;
	$wpdb->insert(
		sssihms_fb_t( 'log' ),
		array( 'ticket_id' => $ticket_id, 'at' => sssihms_fb_now(), 'user_id' => get_current_user_id(), 'action' => $action, 'detail' => $detail )
	);
}

function sssihms_fb_dept( $user_id ) {
	if ( ! $user_id ) {
		return '';
	}
	$u = get_userdata( $user_id );
	return $u ? ( get_user_meta( $user_id, 'sssihms_fb_dept', true ) ?: $u->display_name ) : 'User #' . $user_id;
}

/* ---------- Working time (section 5.1: Monday to Saturday, less hospital holidays) ---------- */

function sssihms_fb_workday( DateTimeImmutable $d ) {
	static $holidays = null;
	if ( null === $holidays ) {
		preg_match_all( '/\d{4}-\d{2}-\d{2}/', sssihms_fb_settings()['holidays'], $m );
		$holidays = $m[0];
	}
	return '7' !== $d->format( 'N' ) && ! in_array( $d->format( 'Y-m-d' ), $holidays, true );
}

/** Working-hours window in minutes after midnight, from the "HH:MM-HH:MM" setting. */
function sssihms_fb_hours() {
	if ( preg_match( '/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/', trim( sssihms_fb_settings()['hours'] ), $m ) && $m[3] * 60 + $m[4] > $m[1] * 60 + $m[2] ) {
		return array( $m[1] * 60 + $m[2], $m[3] * 60 + $m[4] );
	}
	return array( 540, 1020 );
}

/** $n working days after $from, at the same time of day. */
function sssihms_fb_add_days( $from, $n ) {
	$d = sssihms_fb_dt( $from );
	while ( $n > 0 ) {
		$d = $d->modify( '+1 day' );
		if ( sssihms_fb_workday( $d ) ) {
			--$n;
		}
	}
	return $d->format( 'Y-m-d H:i:s' );
}

/** $h working hours after $from, counting only the working-hours window of working days. */
function sssihms_fb_add_hours( $from, $h ) {
	list( $start, $end ) = sssihms_fb_hours();
	$d    = sssihms_fb_dt( $from );
	$left = $h * 60;
	for ( $i = 0; $i < 400; $i++ ) {
		$min = (int) $d->format( 'G' ) * 60 + (int) $d->format( 'i' );
		if ( ! sssihms_fb_workday( $d ) || $min >= $end ) {
			$d = $d->modify( '+1 day' )->setTime( intdiv( $start, 60 ), $start % 60 );
			continue;
		}
		if ( $min < $start ) {
			$d   = $d->setTime( intdiv( $start, 60 ), $start % 60 );
			$min = $start;
		}
		if ( $left <= $end - $min ) {
			return $d->modify( "+$left minutes" )->format( 'Y-m-d H:i:s' );
		}
		$left -= $end - $min;
		$d     = $d->modify( '+1 day' )->setTime( intdiv( $start, 60 ), $start % 60 );
	}
	return $d->format( 'Y-m-d H:i:s' );
}

/** Elapsed working days between two times (Sundays and holidays not counted), for the report. */
function sssihms_fb_workdays_between( $a, $b ) {
	$d    = sssihms_fb_dt( $a );
	$end  = sssihms_fb_dt( $b );
	$secs = 0;
	while ( $d < $end ) {
		$next = $d->modify( 'tomorrow' );
		$stop = $next < $end ? $next : $end;
		if ( sssihms_fb_workday( $d ) ) {
			$secs += $stop->getTimestamp() - $d->getTimestamp();
		}
		$d = $stop;
	}
	return $secs / DAY_IN_SECONDS;
}

function sssihms_fb_dues( $created, $priority ) {
	$p = sssihms_fb_priorities()[ $priority ];
	return array(
		'assign_due'  => 'h' === $p['assign'][1] ? sssihms_fb_add_hours( $created, $p['assign'][0] ) : sssihms_fb_add_days( $created, $p['assign'][0] ),
		'resolve_due' => sssihms_fb_add_days( $created, $p['resolve'] ),
	);
}

/** The deadline the ticket is working towards now, or '' when none applies. */
function sssihms_fb_due( $t ) {
	if ( 'new' === $t->status ) {
		return $t->assign_due;
	}
	return in_array( $t->status, SSSIHMS_FB_OPEN, true ) ? $t->resolve_due : '';
}

function sssihms_fb_overdue( $t ) {
	$due = sssihms_fb_due( $t );
	return $due && sssihms_fb_now() > $due;
}

/* ---------- Who sees what (section 7) ---------- */

function sssihms_fb_can_see( $t ) {
	if ( current_user_can( SSSIHMS_FB_CELL ) ) {
		return true;
	}
	return ( current_user_can( SSSIHMS_FB_OWNER ) && (int) $t->owner_id === get_current_user_id() )
		|| ( current_user_can( SSSIHMS_FB_ESC1 ) && $t->esc_level >= 1 )
		|| ( current_user_can( SSSIHMS_FB_ESC2 ) && $t->esc_level >= 2 );
}

/** SQL condition matching sssihms_fb_can_see(). */
function sssihms_fb_scope_sql() {
	if ( current_user_can( SSSIHMS_FB_CELL ) ) {
		return '1=1';
	}
	$or = array();
	if ( current_user_can( SSSIHMS_FB_OWNER ) ) {
		$or[] = 'owner_id = ' . (int) get_current_user_id();
	}
	if ( current_user_can( SSSIHMS_FB_ESC1 ) ) {
		$or[] = 'esc_level >= 1';
	}
	if ( current_user_can( SSSIHMS_FB_ESC2 ) ) {
		$or[] = 'esc_level >= 2';
	}
	return $or ? '(' . implode( ' OR ', $or ) . ')' : '1=0';
}

/** Contact details are for the Cell and the escalation officers; owners act on the content. */
function sssihms_fb_can_contact() {
	return current_user_can( SSSIHMS_FB_CELL ) || current_user_can( SSSIHMS_FB_ESC1 ) || current_user_can( SSSIHMS_FB_ESC2 );
}

/* ---------- Email to staff (never the patient's details) ---------- */

function sssihms_fb_role_emails( array $roles ) {
	return wp_list_pluck( get_users( array( 'role__in' => $roles, 'fields' => array( 'user_email' ) ) ), 'user_email' );
}

function sssihms_fb_cell_emails() {
	return sssihms_fb_role_emails( array( 'sssihms_pws', 'sssihms_fb_coord' ) ) ?: array( SSSIHMS_FB_FALLBACK );
}

/** Level 2 goes to the Director with level 1 copied (section 5.1). Falls back to the Cell. */
function sssihms_fb_esc_emails( $level ) {
	$to = sssihms_fb_role_emails( 2 === $level ? array( 'sssihms_fb_esc1', 'sssihms_fb_esc2' ) : array( 'sssihms_fb_esc1' ) );
	return $to ?: sssihms_fb_cell_emails();
}

function sssihms_fb_owner_email( $t ) {
	$u = $t->owner_id ? get_userdata( $t->owner_id ) : null;
	return $u ? array( $u->user_email ) : sssihms_fb_cell_emails();
}

function sssihms_fb_mail( array $to, $subject, $line, $t ) {
	if ( $t->is_test ) { // Test tickets mail only the person who sent them.
		global $wpdb;
		$u  = get_userdata( (int) $wpdb->get_var( $wpdb->prepare( 'SELECT user_id FROM ' . sssihms_fb_t( 'log' ) . " WHERE ticket_id = %d AND action = 'created'", $t->id ) ) );
		$to = $u ? array( $u->user_email ) : array();
	}
	$to = array_values( array_unique( array_filter( $to ) ) );
	if ( ! $to ) {
		return;
	}
	$cats = sssihms_fb_categories();
	$locs = sssihms_fb_locations();
	$rows = array(
		'Ticket'   => $t->ticket_no . ( $t->is_test ? ' (TEST)' : '' ),
		'Category' => $cats[ $t->category ][0] ?? $t->category,
		'Priority' => sssihms_fb_priorities()[ $t->priority ]['label'],
		'Status'   => sssihms_fb_statuses()[ $t->status ],
		'Location' => $t->src ? ( $locs[ $t->src ] ?? $t->src ) : '',
		'Owner'    => sssihms_fb_dept( $t->owner_id ),
		'Due'      => sssihms_fb_show( sssihms_fb_due( $t ) ),
	);
	$html = '<p style="font-family:Arial,sans-serif;font-size:14px">' . esc_html( $line ) . '</p><table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
	foreach ( array_filter( $rows ) as $k => $v ) {
		$html .= '<tr><th align="left" style="background:#f4efe6">' . esc_html( $k ) . '</th><td>' . esc_html( $v ) . '</td></tr>';
	}
	$html .= '</table><p style="font-family:Arial,sans-serif;font-size:14px"><a href="' . esc_url( admin_url( 'admin.php?page=sssihms-fb&ticket=' . $t->id ) ) . '">Open the ticket</a> (login needed).</p>'
		. '<p style="font-family:Arial,sans-serif;font-size:12px;color:#666">The patient\'s details are not included in this email. SSSIHMS Whitefield Patient Feedback Portal.</p>';
	wp_mail( $to, ( $t->is_test ? '[TEST] ' : '' ) . $subject . ' [' . $t->ticket_no . ']', $html, array( 'Content-Type: text/html; charset=UTF-8' ) );
}

/* ---------- SMS (Annexure A) ---------- */

function sssihms_fb_sms_connected() {
	return has_filter( 'sssihms_fb_sms_send' ) || sssihms_fb_exotel_configured();
}

function sssihms_fb_exotel_configured() {
	foreach ( array( 'SID', 'KEY', 'TOKEN', 'SENDER', 'DLT_ENTITY' ) as $c ) {
		if ( ! defined( 'SSSIHMS_EXOTEL_' . $c ) ) {
			return false;
		}
	}
	return true;
}

/**
 * Sends template $key to $phone with $vars filled into its {#var#} slots in order. Returns true
 * only when the provider accepted the message. $ticket_id 0 (the OTP) is not logged.
 *
 * Integration point: add_filter( 'sssihms_fb_sms_send', fn( $result, $to, $text, $key,
 * $dlt_template_id ) => true|false, 10, 5 ). $to is 91 followed by the 10 digits.
 */
function sssihms_fb_sms( $ticket_id, $phone, $key, array $vars ) {
	$text = sssihms_fb_sms_templates()[ $key ];
	foreach ( $vars as $v ) {
		$pos = strpos( $text, '{#var#}' );
		if ( false !== $pos ) {
			$text = substr_replace( $text, (string) $v, $pos, 7 );
		}
	}
	$dlt    = (string) sssihms_fb_settings()[ 'dlt_' . $key ];
	$result = apply_filters( 'sssihms_fb_sms_send', null, '91' . $phone, $text, $key, $dlt );
	if ( null === $result && sssihms_fb_exotel_configured() ) {
		$result = sssihms_fb_exotel( '91' . $phone, $text, $key, $dlt );
	}
	if ( $ticket_id ) {
		sssihms_fb_log( $ticket_id, 'sms', $key . ': ' . ( true === $result ? 'sent' : ( null === $result ? 'not sent, no SMS provider connected yet' : 'failed' ) ) );
	}
	return true === $result;
}

/**
 * Exotel SMS API, used when the SSSIHMS_EXOTEL_* constants are in wp-config.php
 * (SID, KEY, TOKEN, SENDER, DLT_ENTITY; optional HOST, default api.exotel.com — use
 * api.in.exotel.com for an account on the Mumbai cluster). Not yet run against Exotel:
 * check it on the first live test.
 */
function sssihms_fb_exotel( $to, $text, $key, $dlt ) {
	$host = defined( 'SSSIHMS_EXOTEL_HOST' ) ? SSSIHMS_EXOTEL_HOST : 'api.exotel.com';
	$res  = wp_remote_post(
		'https://' . $host . '/v1/Accounts/' . rawurlencode( SSSIHMS_EXOTEL_SID ) . '/Sms/send.json',
		array(
			'timeout' => 10,
			'headers' => array( 'Authorization' => 'Basic ' . base64_encode( SSSIHMS_EXOTEL_KEY . ':' . SSSIHMS_EXOTEL_TOKEN ) ),
			'body'    => array(
				'From'          => SSSIHMS_EXOTEL_SENDER,
				'To'            => $to,
				'Body'          => $text,
				'DltEntityId'   => SSSIHMS_EXOTEL_DLT_ENTITY,
				'DltTemplateId' => $dlt,
				'SmsType'       => 'transactional',
			),
		)
	);
	$code = (int) wp_remote_retrieve_response_code( $res );
	if ( 200 !== $code ) {
		error_log( 'sssihms-fb: Exotel SMS "' . $key . '" failed, HTTP ' . $code . ( is_wp_error( $res ) ? ' ' . $res->get_error_message() : '' ) );
		return false;
	}
	return true;
}

/* ---------- Voice recordings (private folder) ---------- */

function sssihms_fb_audio_dir() {
	$dir = WP_CONTENT_DIR . '/sssihms-feedback-private';
	if ( ! is_dir( $dir ) ) {
		wp_mkdir_p( $dir );
		file_put_contents( $dir . '/.htaccess', "# Patient feedback voice recordings - deny all web access\n<IfModule mod_authz_core.c>\n\tRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n\tOrder allow,deny\n\tDeny from all\n</IfModule>\n" );
		file_put_contents( $dir . '/index.php', "<?php\n// Silence is golden.\n" );
	}
	return $dir;
}

function sssihms_fb_audio_types() {
	return array(
		'audio/webm'  => 'webm',
		'video/webm'  => 'webm',
		'audio/ogg'   => 'ogg',
		'audio/mp4'   => 'm4a',
		'video/mp4'   => 'm4a',
		'audio/x-m4a' => 'm4a',
		'audio/aac'   => 'aac',
		'audio/mpeg'  => 'mp3',
		'audio/wav'   => 'wav',
		'audio/x-wav' => 'wav',
	);
}

/** Moves a recording into the private folder. Returns array( file, mime ) or a message string. */
function sssihms_fb_audio_save( $tmp, $uploaded ) {
	if ( ! is_file( $tmp ) || filesize( $tmp ) < 200 ) {
		return 'The voice recording was empty. Please record it again.';
	}
	if ( filesize( $tmp ) > 8 * MB_IN_BYTES ) {
		return 'The voice recording is too large. Please keep it under 3 minutes.';
	}
	$mime  = ( new finfo( FILEINFO_MIME_TYPE ) )->file( $tmp );
	$types = sssihms_fb_audio_types();
	if ( ! isset( $types[ $mime ] ) ) {
		return 'The voice recording could not be read. Please type your feedback instead.';
	}
	$name = wp_date( 'Ym' ) . '-' . wp_generate_password( 24, false ) . '.' . $types[ $mime ];
	$dest = sssihms_fb_audio_dir() . '/' . $name;
	if ( ! ( $uploaded ? move_uploaded_file( $tmp, $dest ) : rename( $tmp, $dest ) ) ) {
		return 'The voice recording could not be saved. Please type your feedback instead.';
	}
	chmod( $dest, 0640 );
	return array( $name, str_replace( 'video/', 'audio/', $mime ) );
}

/* ---------- Intake: the one way a ticket is created (section 9) ---------- */

/**
 * $d: channel, phone, phone_verified, email, patient_name, patient_id, attendant, category,
 * body, audio, audio_mime, audio_secs, src, lang, consent, staff_id, ext_ref, is_test.
 * Returns array( id, ticket_no, days, sms ) or WP_Error.
 */
function sssihms_fb_intake( array $d ) {
	global $wpdb;
	$T        = sssihms_fb_t( 'tickets' );
	$now      = sssihms_fb_now();
	$priority = sssihms_fb_categories()[ $d['category'] ][1];
	$row      = array_merge(
		array_intersect_key( $d, array_flip( array( 'channel', 'phone', 'phone_verified', 'email', 'patient_name', 'patient_id', 'attendant', 'category', 'body', 'audio', 'audio_mime', 'audio_secs', 'src', 'lang', 'consent', 'staff_id', 'ext_ref', 'is_test' ) ) ),
		sssihms_fb_dues( $now, $priority ),
		array(
			'created_at' => $now,
			'priority'   => $priority,
			'status'     => 'new',
			'token'      => wp_generate_password( 16, false ),
			'esc_level'  => 'critical' === $priority ? 2 : 0, // Critical goes to the Director at once.
		)
	);
	$day = 'FB-' . sssihms_fb_dt( $now )->format( 'ymd' ) . '-';
	$n   = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $T WHERE ticket_no LIKE %s", $wpdb->esc_like( $day ) . '%' ) );
	$ok  = false;
	$wpdb->suppress_errors( true );
	for ( $i = 1; $i <= 5 && ! $ok; $i++ ) { // Retry if two tickets take the same number at once.
		$row['ticket_no'] = $day . sprintf( '%04d', $n + $i );
		$ok               = (bool) $wpdb->insert( $T, $row );
	}
	$wpdb->suppress_errors( false );
	if ( ! $ok ) {
		error_log( 'sssihms-fb: ticket could not be stored: ' . $wpdb->last_error );
		return new WP_Error( 'store', 'Sorry, your feedback could not be saved because of a problem on our side. Please try again, or call the Help Desk on ' . SSSIHMS_FB_HELP . '.' );
	}
	$t = sssihms_fb_get( $wpdb->insert_id );
	sssihms_fb_log( $t->id, 'created', sssihms_fb_channels()[ $t->channel ] . ( $t->staff_id ? ', entered by ' . sssihms_fb_dept( $t->staff_id ) : '' ) . ( $t->phone_verified ? ', mobile verified' : '' ) . ( $t->audio ? ', with voice recording' : '' ) );

	$days = sssihms_fb_priorities()[ $priority ]['resolve'];
	$sms  = $t->phone ? sssihms_fb_sms( $t->id, $t->phone, 'ack', array( $t->ticket_no, $days ) ) : false;
	if ( $t->email ) {
		wp_mail( $t->email, 'Your feedback ticket ' . $t->ticket_no . ' - SSSIHMS Whitefield', "Sairam.\n\nYour feedback is received, ticket " . $t->ticket_no . ". Patient Welfare Services will respond within $days working days.\n\nSri Sathya Sai Institute of Higher Medical Sciences, Whitefield\nHelp Desk: " . SSSIHMS_FB_HELP . "\n" );
		sssihms_fb_log( $t->id, 'email', 'acknowledgement emailed to the patient' );
	}
	sssihms_fb_mail( sssihms_fb_cell_emails(), 'New patient feedback', 'New feedback for triage.', $t );
	if ( 'critical' === $priority ) {
		sssihms_fb_mail( sssihms_fb_esc_emails( 2 ), 'CRITICAL patient feedback', 'A Critical ticket has been received. It is with escalation level 2 from the start (SOP 5.1).', $t );
		sssihms_fb_log( $t->id, 'escalated', 'level 2 at once (Critical)' );
	}
	return array( 'id' => (int) $t->id, 'ticket_no' => $t->ticket_no, 'days' => $days, 'sms' => $sms );
}

/** Same number, same category and the same words within 10 minutes: return that ticket instead. */
function sssihms_fb_duplicate( $phone, $category, $body ) {
	global $wpdb;
	if ( ! $phone || '' === $body ) {
		return null;
	}
	return $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . sssihms_fb_t( 'tickets' ) . ' WHERE phone = %s AND category = %s AND body = %s AND created_at > %s ORDER BY id DESC LIMIT 1', $phone, $category, $body, sssihms_fb_at( '-10 minutes' ) ) );
}

/* ---------- Public REST endpoints: OTP, submission, intake ---------- */

add_action( 'rest_api_init', 'sssihms_fb_routes' );
function sssihms_fb_routes() {
	if ( ! sssihms_fb_is_target() ) {
		return;
	}
	$open = '__return_true'; // Public on purpose; each callback applies its own limits.
	register_rest_route( 'sssihms-fb/v1', '/otp', array( 'methods' => 'POST', 'callback' => 'sssihms_fb_rest_otp', 'permission_callback' => $open ) );
	register_rest_route( 'sssihms-fb/v1', '/otp/verify', array( 'methods' => 'POST', 'callback' => 'sssihms_fb_rest_verify', 'permission_callback' => $open ) );
	register_rest_route( 'sssihms-fb/v1', '/otp/status', array( 'methods' => 'GET', 'callback' => 'sssihms_fb_rest_status', 'permission_callback' => $open ) );
	register_rest_route( 'sssihms-fb/v1', '/submit', array( 'methods' => 'POST', 'callback' => 'sssihms_fb_rest_submit', 'permission_callback' => $open ) );
	register_rest_route( 'sssihms-fb/v1', '/intake', array( 'methods' => 'POST', 'callback' => 'sssihms_fb_rest_intake', 'permission_callback' => 'sssihms_fb_intake_auth' ) );
}

function sssihms_fb_err( $message, $status, $extra = array() ) {
	return new WP_REST_Response( array( 'message' => $message ) + $extra, $status );
}

/** Test codes on screen: only for logged-in Cell staff, and only while no SMS provider is connected. */
function sssihms_fb_test_otp_allowed() {
	return ! sssihms_fb_sms_connected() && current_user_can( SSSIHMS_FB_CELL );
}

/** Section 4: 6-digit code, 10 minutes, at most 3 an hour per number, lock after 5 wrong tries. */
function sssihms_fb_rest_otp( WP_REST_Request $r ) {
	global $wpdb;
	$O     = sssihms_fb_t( 'otp' );
	$phone = sssihms_fb_phone( $r->get_param( 'phone' ) );
	if ( ! $phone ) {
		return sssihms_fb_err( 'Enter a 10-digit mobile number.', 400 );
	}
	$ph = sssihms_fb_hash( 'p|' . $phone );
	$ip = sssihms_fb_ip_hash();
	if ( (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $O WHERE ip_hash = %s AND created_at > %s", $ip, sssihms_fb_at( '-1 hour' ) ) ) >= 10 ) {
		return sssihms_fb_err( 'Too many OTP requests from your connection. Please try again in an hour.', 429 );
	}
	if ( $wpdb->get_var( $wpdb->prepare( "SELECT MAX(locked_until) FROM $O WHERE phone_hash = %s", $ph ) ) > sssihms_fb_now() ) {
		return sssihms_fb_err( 'Too many wrong OTPs for this number. Please try again after 30 minutes.', 429 );
	}
	if ( (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $O WHERE phone_hash = %s AND created_at > %s", $ph, sssihms_fb_at( '-1 hour' ) ) ) >= 3 ) {
		return sssihms_fb_err( 'We can send at most 3 OTPs to a number in an hour. Please try again later.', 429 );
	}
	$code = sprintf( '%06d', random_int( 0, 999999 ) );
	$wpdb->insert(
		$O,
		array( 'phone_hash' => $ph, 'ip_hash' => $ip, 'code_hash' => sssihms_fb_hash( 'c|' . $phone . '|' . $code ), 'created_at' => sssihms_fb_now(), 'expires_at' => sssihms_fb_at( '+10 minutes' ) )
	);
	$id   = $wpdb->insert_id;
	$sent = sssihms_fb_sms( 0, $phone, 'otp', array( $code ) );
	$wpdb->update( $O, array( 'sent' => $sent ? 1 : 0 ), array( 'id' => $id ) );
	$out = array( 'masked' => sssihms_fb_mask( $phone ) );
	if ( ! $sent ) {
		if ( ! sssihms_fb_test_otp_allowed() ) {
			return sssihms_fb_err( 'The OTP could not be sent just now. Please try again in a few minutes, or ask at the Help Desk.', 503 );
		}
		$out['test_code'] = $code;
	}
	return rest_ensure_response( $out );
}

function sssihms_fb_rest_verify( WP_REST_Request $r ) {
	global $wpdb;
	$O     = sssihms_fb_t( 'otp' );
	$phone = sssihms_fb_phone( $r->get_param( 'phone' ) );
	$code  = preg_replace( '/\D/', '', (string) $r->get_param( 'code' ) );
	if ( ! $phone || 6 !== strlen( $code ) ) {
		return sssihms_fb_err( 'Enter the 6-digit OTP.', 400 );
	}
	$ph = sssihms_fb_hash( 'p|' . $phone );
	if ( $wpdb->get_var( $wpdb->prepare( "SELECT MAX(locked_until) FROM $O WHERE phone_hash = %s", $ph ) ) > sssihms_fb_now() ) {
		return sssihms_fb_err( 'Too many wrong OTPs for this number. Please try again after 30 minutes.', 429 );
	}
	$row = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $O WHERE phone_hash = %s AND verified_at IS NULL AND expires_at > %s ORDER BY id DESC LIMIT 1", $ph, sssihms_fb_now() ) );
	if ( ! $row ) {
		return sssihms_fb_err( 'This OTP has expired. Please ask for a new one.', 400 );
	}
	if ( hash_equals( $row->code_hash, sssihms_fb_hash( 'c|' . $phone . '|' . $code ) ) ) {
		$wpdb->update( $O, array( 'verified_at' => sssihms_fb_now() ), array( 'id' => $row->id ) );
		sssihms_fb_cookie_set( $phone );
		return rest_ensure_response( array( 'masked' => sssihms_fb_mask( $phone ) ) );
	}
	$wpdb->query( $wpdb->prepare( "UPDATE $O SET tries = tries + 1 WHERE id = %d", $row->id ) );
	$wrong = (int) $wpdb->get_var( $wpdb->prepare( "SELECT SUM(tries) FROM $O WHERE phone_hash = %s AND created_at > %s", $ph, sssihms_fb_at( '-1 hour' ) ) );
	if ( $wrong >= 5 ) {
		$wpdb->update( $O, array( 'locked_until' => sssihms_fb_at( '+30 minutes' ) ), array( 'id' => $row->id ) );
		return sssihms_fb_err( 'Too many wrong OTPs for this number. Please try again after 30 minutes.', 429 );
	}
	return sssihms_fb_err( sprintf( 'That OTP is not correct. You have %d more %s.', 5 - $wrong, 1 === 5 - $wrong ? 'try' : 'tries' ), 400 );
}

/** A verified number may send more feedback for 24 hours without a new OTP (section 4). */
function sssihms_fb_cookie_set( $phone ) {
	$exp = time() + DAY_IN_SECONDS;
	setcookie( 'sssihms_fb_v', $phone . '|' . $exp . '|' . sssihms_fb_hash( 'v|' . $phone . '|' . $exp ), array( 'expires' => $exp, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax' ) );
}

function sssihms_fb_cookie_phone() {
	$p = explode( '|', (string) wp_unslash( $_COOKIE['sssihms_fb_v'] ?? '' ) );
	if ( 3 !== count( $p ) || (int) $p[1] < time() || ! sssihms_fb_phone( $p[0] ) ) {
		return '';
	}
	return hash_equals( sssihms_fb_hash( 'v|' . $p[0] . '|' . $p[1] ), $p[2] ) ? $p[0] : '';
}

function sssihms_fb_rest_status() {
	$phone = sssihms_fb_cookie_phone();
	return rest_ensure_response( $phone ? array( 'verified' => true, 'masked' => sssihms_fb_mask( $phone ) ) : array( 'verified' => false ) );
}

function sssihms_fb_rest_submit( WP_REST_Request $r ) {
	$p = $r->get_body_params();
	if ( ! empty( $p['website'] ) ) { // Honeypot: look successful, store nothing.
		return rest_ensure_response( array( 'ticket' => 'FB-000000-0000', 'days' => 7, 'sms' => false ) );
	}
	$rl = 'sssihms_fb_sub_' . sssihms_fb_ip_hash();
	if ( (int) get_transient( $rl ) >= 10 ) {
		return sssihms_fb_err( 'Too many submissions from your connection. Please try again in an hour.', 429 );
	}
	$errors = array();
	if ( (int) ( $p['t'] ?? 0 ) < 5 ) {
		$errors[] = 'Please take a moment to check your answers, then submit again.';
	}
	$str = function ( $k, $max ) use ( $p ) {
		return mb_substr( trim( sanitize_text_field( $p[ $k ] ?? '' ) ), 0, $max );
	};
	$assisted = ! empty( $p['assisted'] ) && current_user_can( SSSIHMS_FB_CELL );
	if ( $assisted ) {
		$phone = sssihms_fb_phone( $p['a_phone'] ?? '' );
		if ( '' !== trim( (string) ( $p['a_phone'] ?? '' ) ) && ! $phone ) {
			$errors[] = 'Enter the mobile number as 10 digits, or leave it blank.';
		}
	} else {
		$phone = sssihms_fb_cookie_phone();
		if ( ! $phone ) {
			$errors[] = 'Please verify your mobile number with the OTP first.';
		}
	}
	$d = array(
		'channel'        => $assisted ? ( 'paper' === ( $p['a_channel'] ?? '' ) ? 'paper' : 'assisted' ) : 'web',
		'phone'          => $phone,
		'phone_verified' => $assisted ? 0 : 1,
		'email'          => sanitize_email( $p['email'] ?? '' ),
		'patient_name'   => $str( 'patient', 120 ),
		'patient_id'     => strtoupper( $str( 'patient_id', 40 ) ),
		'attendant'      => $str( 'attendant', 120 ),
		'category'       => sanitize_key( $p['category'] ?? '' ),
		'body'           => mb_substr( trim( sanitize_textarea_field( $p['text'] ?? '' ) ), 0, 2000 ),
		'src'            => preg_match( '/^[a-z0-9-]{1,40}$/', (string) ( $p['src'] ?? '' ) ) ? $p['src'] : '',
		'lang'           => isset( sssihms_fb_strings()[ $p['lang'] ?? '' ] ) ? $p['lang'] : 'en',
		'consent'        => empty( $p['consent'] ) ? 0 : 1,
		'staff_id'       => $assisted ? get_current_user_id() : 0,
		'is_test'        => ! empty( $p['test'] ) && current_user_can( SSSIHMS_FB_CELL ) ? 1 : 0,
	);
	if ( ! isset( sssihms_fb_categories()[ $d['category'] ] ) ) {
		$errors[] = 'Choose what your feedback is about.';
	}
	if ( '' === $d['patient_name'] ) {
		$errors[] = 'Patient name is required.';
	}
	if ( '' !== trim( (string) ( $p['email'] ?? '' ) ) && ! is_email( $d['email'] ) ) {
		$errors[] = 'Enter a valid email address, or leave it blank.';
	}
	if ( ! $d['consent'] ) {
		$errors[] = $assisted ? 'Confirm that the notice was read out to the patient.' : 'Please tick the box to agree to how your details are used.';
	}
	if ( preg_match_all( '#https?://|www\.#i', $d['body'] ) > 1 ) {
		$errors[] = 'Please remove the web links from your feedback.';
	}
	$file = $r->get_file_params()['audio'] ?? null;
	$has  = $file && UPLOAD_ERR_NO_FILE !== $file['error'];
	if ( $has && UPLOAD_ERR_OK !== $file['error'] ) {
		$errors[] = 'The voice recording did not upload. Please record it again, or type your feedback.';
	}
	if ( '' === $d['body'] && ! $has ) {
		$errors[] = 'Please write your feedback or record your voice.';
	}
	if ( $errors ) {
		return sssihms_fb_err( $errors[0], 400, array( 'errors' => $errors ) );
	}
	$dup = $has ? null : sssihms_fb_duplicate( $phone, $d['category'], $d['body'] );
	if ( $dup ) {
		return rest_ensure_response( array( 'ticket' => $dup->ticket_no, 'days' => sssihms_fb_priorities()[ $dup->priority ]['resolve'], 'sms' => false ) );
	}
	if ( $has ) {
		$saved = sssihms_fb_audio_save( $file['tmp_name'], true );
		if ( is_string( $saved ) ) {
			return sssihms_fb_err( $saved, 400, array( 'errors' => array( $saved ) ) );
		}
		list( $d['audio'], $d['audio_mime'] ) = $saved;
		$d['audio_secs']                      = min( 600, absint( $p['audio_secs'] ?? 0 ) );
	}
	$res = sssihms_fb_intake( $d );
	if ( is_wp_error( $res ) ) {
		return sssihms_fb_err( $res->get_error_message(), 500, array( 'errors' => array( $res->get_error_message() ) ) );
	}
	set_transient( $rl, (int) get_transient( $rl ) + 1, HOUR_IN_SECONDS );
	return rest_ensure_response( array( 'ticket' => $res['ticket_no'], 'days' => $res['days'], 'sms' => $res['sms'] ) );
}

/**
 * Signed intake for other channels (WhatsApp in phase 3). Headers: X-SSSIHMS-Timestamp (Unix
 * seconds, within 5 minutes) and X-SSSIHMS-Signature = hex HMAC-SHA256 of "<timestamp>.<raw
 * body>" with SSSIHMS_FB_INTAKE_SECRET (at least 32 characters). Off until the secret is set.
 */
function sssihms_fb_intake_auth( WP_REST_Request $r ) {
	if ( ! defined( 'SSSIHMS_FB_INTAKE_SECRET' ) || strlen( SSSIHMS_FB_INTAKE_SECRET ) < 32 ) {
		return false;
	}
	$ts = (int) $r->get_header( 'x_sssihms_timestamp' );
	return abs( time() - $ts ) <= 300 && hash_equals( hash_hmac( 'sha256', $ts . '.' . $r->get_body(), SSSIHMS_FB_INTAKE_SECRET ), strtolower( (string) $r->get_header( 'x_sssihms_signature' ) ) );
}

/**
 * JSON body: channel ("whatsapp" or "api"), ext_ref (the sender's message id; a repeat returns
 * the same ticket), phone, phone_verified (true when the channel proves the number, as
 * WhatsApp does), category (Annexure B key, default "other"), text, patient_name, patient_id,
 * src, email, audio_base64 + audio_mime (optional voice note, up to 8 MB).
 */
function sssihms_fb_rest_intake( WP_REST_Request $r ) {
	global $wpdb;
	$j   = (array) $r->get_json_params();
	$ref = mb_substr( sanitize_text_field( $j['ext_ref'] ?? '' ), 0, 80 );
	if ( $ref ) {
		$old = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . sssihms_fb_t( 'tickets' ) . ' WHERE ext_ref = %s', $ref ) );
		if ( $old ) {
			return rest_ensure_response( array( 'ticket' => $old->ticket_no, 'status' => $old->status, 'duplicate' => true ) );
		}
	}
	$cat = sanitize_key( $j['category'] ?? 'other' );
	$d   = array(
		'channel'        => 'whatsapp' === ( $j['channel'] ?? '' ) ? 'whatsapp' : 'api',
		'ext_ref'        => $ref,
		'phone'          => sssihms_fb_phone( $j['phone'] ?? '' ),
		'phone_verified' => empty( $j['phone_verified'] ) ? 0 : 1,
		'email'          => is_email( $j['email'] ?? '' ) ? sanitize_email( $j['email'] ) : '',
		'patient_name'   => mb_substr( sanitize_text_field( $j['patient_name'] ?? '' ), 0, 120 ),
		'patient_id'     => strtoupper( mb_substr( sanitize_text_field( $j['patient_id'] ?? '' ), 0, 40 ) ),
		'category'       => isset( sssihms_fb_categories()[ $cat ] ) ? $cat : 'other',
		'body'           => mb_substr( trim( sanitize_textarea_field( $j['text'] ?? '' ) ), 0, 2000 ),
		'src'            => preg_match( '/^[a-z0-9-]{1,40}$/', (string) ( $j['src'] ?? '' ) ) ? $j['src'] : '',
		'consent'        => 1, // The channel shows the notice before the first message.
	);
	if ( ! $d['phone'] ) {
		return sssihms_fb_err( 'phone: 10-digit Indian mobile number required', 400 );
	}
	if ( ! empty( $j['audio_base64'] ) ) {
		$tmp = wp_tempnam( 'fb-audio' );
		file_put_contents( $tmp, base64_decode( (string) $j['audio_base64'], true ) ?: '' );
		$saved = sssihms_fb_audio_save( $tmp, false );
		if ( is_string( $saved ) ) {
			wp_delete_file( $tmp );
			return sssihms_fb_err( 'audio: ' . $saved, 400 );
		}
		list( $d['audio'], $d['audio_mime'] ) = $saved;
	}
	if ( '' === $d['body'] && empty( $d['audio'] ) ) {
		return sssihms_fb_err( 'text or audio_base64 required', 400 );
	}
	$res = sssihms_fb_intake( $d );
	return is_wp_error( $res ) ? sssihms_fb_err( $res->get_error_message(), 500 ) : rest_ensure_response( array( 'ticket' => $res['ticket_no'], 'days' => $res['days'], 'status' => 'new' ) );
}

/* ---------- The form (section 4) ---------- */

/**
 * Patient-facing text. Section 4 asks for English, Kannada, Hindi and Telugu (decision D5);
 * the other languages are added here as staff provide checked translations, and the
 * language menu appears once there is more than one.
 */
function sssihms_fb_strings() {
	return array(
		'en' => array(
			'lang'         => 'English',
			'intro'        => 'Tell us about your experience at the hospital: a concern, a suggestion or thanks. You can write it, record your voice, or both. You will get a ticket number, and Patient Welfare Services will respond.',
			'emergency'    => 'This form is not for emergencies. For a medical emergency, please tell the nearest nurse or staff member now.',
			'step1'        => '1. Verify your mobile number',
			'step1_note'   => 'We send a one-time password (OTP) by SMS, so that we can reply to you.',
			'phone'        => 'Mobile number (10 digits)',
			'send'         => 'Send OTP',
			'sending'      => 'Sending…',
			'resend'       => 'Send a new OTP',
			'code'         => 'Enter the 6-digit OTP',
			'verify'       => 'Verify',
			'sent'         => 'We have sent a 6-digit OTP by SMS to %s. It is valid for 10 minutes.',
			'test_code'    => 'Test mode (no SMS connected yet): the OTP is %s.',
			'bad_phone'    => 'Enter a 10-digit mobile number.',
			'bad_code'     => 'Enter the 6-digit OTP.',
			'verified'     => 'Mobile number verified: %s',
			'change'       => 'Use a different number',
			'step2'        => '2. Your feedback',
			'category'     => 'What is your feedback about?',
			'patient'      => 'Patient name',
			'patient_id'   => 'Patient ID (if you know it)',
			'attendant'    => 'Your name, if you are an attendant',
			'location'     => 'Where in the hospital?',
			'location_any' => 'Choose a place (optional)',
			'text'         => 'Your feedback',
			'text_help'    => 'Write it here, record your voice below, or both. Please do not add medical details beyond what your feedback needs.',
			'audio'        => 'Record your voice (up to 3 minutes)',
			'rec'          => 'Record',
			'stop'         => 'Stop',
			'again'        => 'Record again',
			'remove'       => 'Remove recording',
			'recording'    => 'Recording',
			'mic_no'       => 'Voice recording does not work in this browser. Please type your feedback instead.',
			'mic_denied'   => 'The microphone could not be used. Allow microphone access for this site, or type your feedback instead.',
			'email'        => 'Email (optional, for updates by email as well)',
			'notice_h'     => 'How we use your details',
			'notice'       => array(
				'We collect your mobile number, the patient\'s name and ID, your feedback and any voice recording, and your email if you give it.',
				'We use them only to respond to your feedback and to improve our services.',
				'Patient Welfare Services and the staff who must act on your feedback can see them. They stay on the hospital\'s own server. Our SMS provider receives only your mobile number and the message.',
				'Voice recordings are deleted 90 days after your feedback is closed. Other details are kept for 2 years; after that your name, contact details and Patient ID are removed.',
				'To see, correct or delete your feedback, or to withdraw your consent, contact Patient Welfare Services at the hospital or call ' . SSSIHMS_FB_HELP . '.',
				'If the patient is a child, a parent or guardian should fill this form.',
			),
			'consent'      => 'I have read how my details will be used, and I agree.',
			'submit'       => 'Submit feedback',
			'submitting'   => 'Submitting…',
			'fix'          => 'Please correct the following:',
			'need_verify'  => 'Please verify your mobile number with the OTP first.',
			'need_cat'     => 'Choose what your feedback is about.',
			'need_patient' => 'Patient name is required.',
			'need_text'    => 'Please write your feedback or record your voice.',
			'need_consent' => 'Please tick the box to agree to how your details are used.',
			'stop_first'   => 'Please stop the recording first.',
			'bad_email'    => 'Enter a valid email address, or leave it blank.',
			'net'          => 'We could not reach the server. Please check your connection and try again.',
			'thanks_h'     => 'Thank you. Your feedback is received.',
			'thanks'       => 'Your ticket number is %1$s. Patient Welfare Services will respond within %2$s working days.',
			'thanks_sms'   => 'We have also sent the ticket number to your mobile by SMS.',
			'thanks_keep'  => 'Please note the ticket number for reference.',
			'another'      => 'Send more feedback',
			'help'         => 'Need help with this form? Ask at the Help Desk, or call ' . SSSIHMS_FB_HELP . '.',
			'nojs'         => 'This form needs JavaScript. Please turn it on, or ask at the Help Desk to give your feedback.',
		),
	);
}

add_shortcode( 'sssihms_feedback_portal', 'sssihms_fb_render' );
function sssihms_fb_render( $atts ) {
	if ( ! sssihms_fb_is_target() ) {
		return '';
	}
	$atts  = shortcode_atts( array( 'test' => '' ), $atts );
	$all   = sssihms_fb_strings();
	$q     = is_string( $_GET['lang'] ?? null ) ? sanitize_key( $_GET['lang'] ) : '';
	$lang  = isset( $all[ $q ] ) ? $q : 'en';
	$s     = $all[ $lang ];
	$staff = current_user_can( SSSIHMS_FB_CELL );
	$test  = $staff && $atts['test'];
	$req   = ' <span class="fa-req" aria-hidden="true">*</span>';
	$cfg   = array(
		'rest'  => esc_url_raw( rest_url( 'sssihms-fb/v1/' ) ),
		'nonce' => is_user_logged_in() ? wp_create_nonce( 'wp_rest' ) : '',
		'max'   => 180,
		's'     => $s,
	);
	wp_enqueue_script( 'sssihms-fb', WPMU_PLUGIN_URL . '/sssihms-wfd-assets/feedback-portal.js', array(), filemtime( WPMU_PLUGIN_DIR . '/sssihms-wfd-assets/feedback-portal.js' ), true );

	$out = '<div id="fbp" class="fa-wrap fbp" data-cfg="' . esc_attr( wp_json_encode( $cfg ) ) . '">' . sssihms_fa_css() . sssihms_fb_css()
		. '<noscript><p class="fa-err">' . esc_html( $s['nojs'] ) . '</p></noscript>';
	if ( count( $all ) > 1 ) {
		$out .= '<p class="fbp-lang">';
		foreach ( $all as $k => $l ) {
			$out .= $k === $lang ? '<strong>' . esc_html( $l['lang'] ) . '</strong> ' : '<a href="' . esc_url( add_query_arg( 'lang', $k ) ) . '" hreflang="' . esc_attr( $k ) . '">' . esc_html( $l['lang'] ) . '</a> ';
		}
		$out .= '</p>';
	}
	if ( $test ) {
		$out .= '<p class="fa-err"><strong>Test page.</strong> Tickets sent from here are marked TEST and left out of reports.' . ( sssihms_fb_sms_connected() ? '' : ' No SMS provider is connected, so the OTP is shown on screen (to Cell staff only).' ) . '</p>';
	}
	$out .= '<p>' . esc_html( $s['intro'] ) . '</p><p class="fbp-emerg"><strong>' . esc_html( $s['emergency'] ) . '</strong></p>'
		. '<form id="fbp-form" class="fa-form" novalidate hidden>'
		. '<div class="fa-hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>'
		. '<input type="hidden" name="lang" value="' . esc_attr( $lang ) . '">' . ( $test ? '<input type="hidden" name="test" value="1">' : '' );
	if ( $staff ) { // Section 4, assisted submission: staff login instead of the OTP.
		$out .= '<fieldset class="fbp-staff"><legend>Staff: assisted entry</legend>'
			. '<label class="fa-opt"><input type="checkbox" name="assisted" value="1" id="fbp-assisted"> I am entering this for a patient (no OTP; my name is recorded on the ticket)</label>'
			. '<div id="fbp-assisted-more" hidden><div class="fa-grid"><div class="fa-field"><label for="fbp-achannel">Source</label><select id="fbp-achannel" name="a_channel"><option value="assisted">Patient at the counter</option><option value="paper">Paper feedback form</option></select></div>'
			. '<div class="fa-field"><label for="fbp-aphone">Patient\'s or relative\'s mobile, if any</label><input type="tel" id="fbp-aphone" name="a_phone" inputmode="numeric" maxlength="14"></div></div></div></fieldset>';
	}
	$out .= '<section id="fbp-otp"><h3>' . esc_html( $s['step1'] ) . '</h3><p class="fa-note">' . esc_html( $s['step1_note'] ) . '</p>'
		. '<div id="fbp-ask"><div class="fa-field fbp-narrow"><label for="fbp-phone">' . esc_html( $s['phone'] ) . $req . '</label><input type="tel" id="fbp-phone" inputmode="numeric" maxlength="14" autocomplete="tel-national"></div>'
		. '<p><button type="button" id="fbp-send" class="btn btn-primary">' . esc_html( $s['send'] ) . '</button></p></div>'
		. '<div id="fbp-codebox" hidden><div class="fa-field fbp-narrow"><label for="fbp-code">' . esc_html( $s['code'] ) . $req . '</label><input type="text" id="fbp-code" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>'
		. '<p><button type="button" id="fbp-verify" class="btn btn-primary">' . esc_html( $s['verify'] ) . '</button> <button type="button" id="fbp-resend" class="fbp-link">' . esc_html( $s['resend'] ) . '</button></p></div>'
		. '<p id="fbp-otp-msg" class="fa-note" role="status" aria-live="polite"></p></section>'
		. '<p id="fbp-ok" class="fbp-verified" hidden><span></span> <button type="button" id="fbp-change" class="fbp-link">' . esc_html( $s['change'] ) . '</button></p>'
		. '<fieldset id="fbp-main" class="fbp-main" disabled><h3>' . esc_html( $s['step2'] ) . '</h3>'
		. '<fieldset class="fa-field"><legend>' . esc_html( $s['category'] ) . $req . '</legend><div class="fbp-cats">';
	foreach ( sssihms_fb_categories() as $k => $c ) {
		$out .= '<label class="fa-opt"><input type="radio" name="category" value="' . esc_attr( $k ) . '"> ' . esc_html( $c[0] ) . '</label>';
	}
	$out .= '</div></fieldset><div class="fa-grid">'
		. '<div class="fa-field"><label for="fbp-patient">' . esc_html( $s['patient'] ) . $req . '</label><input type="text" id="fbp-patient" name="patient" maxlength="120" autocomplete="name"></div>'
		. '<div class="fa-field"><label for="fbp-pid">' . esc_html( $s['patient_id'] ) . '</label><input type="text" id="fbp-pid" name="patient_id" maxlength="40" class="fa-caps" autocapitalize="characters"></div>'
		. '<div class="fa-field"><label for="fbp-att">' . esc_html( $s['attendant'] ) . '</label><input type="text" id="fbp-att" name="attendant" maxlength="120"></div>'
		. '<div class="fa-field"><label for="fbp-src">' . esc_html( $s['location'] ) . '</label><select id="fbp-src" name="src"><option value="">' . esc_html( $s['location_any'] ) . '</option>';
	foreach ( sssihms_fb_locations() as $k => $l ) {
		$out .= '<option value="' . esc_attr( $k ) . '">' . esc_html( $l ) . '</option>';
	}
	$out .= '</select></div></div>'
		. '<div class="fa-field"><label for="fbp-text">' . esc_html( $s['text'] ) . '</label><small id="fbp-text-help">' . esc_html( $s['text_help'] ) . '</small><textarea id="fbp-text" name="text" rows="5" maxlength="2000" aria-describedby="fbp-text-help"></textarea></div>'
		. '<div class="fa-field fbp-audio"><span class="fbp-label">' . esc_html( $s['audio'] ) . '</span>'
		. '<div id="fbp-audio-ui"><button type="button" id="fbp-rec" class="btn btn-primary">● ' . esc_html( $s['rec'] ) . '</button> <button type="button" id="fbp-stop" class="btn btn-primary" hidden>■ ' . esc_html( $s['stop'] ) . '</button> <span id="fbp-clock" class="fbp-clock" aria-live="off"></span>'
		. '<audio id="fbp-play" controls hidden></audio><p><button type="button" id="fbp-again" class="fbp-link" hidden>' . esc_html( $s['again'] ) . '</button> <button type="button" id="fbp-remove" class="fbp-link" hidden>' . esc_html( $s['remove'] ) . '</button></p></div>'
		. '<p id="fbp-audio-msg" class="fa-note" role="status"></p></div>'
		. '<div class="fa-grid"><div class="fa-field"><label for="fbp-email">' . esc_html( $s['email'] ) . '</label><input type="email" id="fbp-email" name="email" autocomplete="email"></div></div>'
		. '<div class="fbp-notice"><h4>' . esc_html( $s['notice_h'] ) . '</h4><ul>';
	foreach ( $s['notice'] as $line ) {
		$out .= '<li>' . esc_html( $line ) . '</li>';
	}
	$out .= '</ul></div><label class="fa-opt fa-consent"><input type="checkbox" name="consent" value="1" id="fbp-consent"> <span id="fbp-consent-text">' . esc_html( $s['consent'] ) . '</span></label>'
		. '<div id="fbp-errors" class="fa-err" role="alert" tabindex="-1" hidden></div>'
		. '<p><button type="submit" id="fbp-submit" class="btn btn-primary">' . esc_html( $s['submit'] ) . '</button></p></fieldset></form>'
		. '<div id="fbp-done" class="fa-ok" role="status" tabindex="-1" hidden></div>'
		. '<p class="fa-note">' . esc_html( $s['help'] ) . '</p></div>';
	return $out;
}

function sssihms_fb_css() {
	return '<style>
.fbp .fbp-narrow{max-width:320px}
.fbp select,.fbp .fa-field textarea{width:100%;font:inherit;font-size:16px;padding:10px 12px;border:1px solid #b9ad9a;border-radius:6px;background:#fff;color:#2a1f14}
.fbp .fa-field textarea{resize:vertical}
.fbp .fbp-main{border:0;padding:0;margin:0;min-width:0}
.fbp .fbp-main[disabled]{opacity:.45}
.fbp .fbp-cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:0 22px}
.fbp .fbp-label{display:block;font-weight:600;font-size:15px;color:var(--pd);margin-bottom:6px}
.fbp .fbp-audio audio{display:block;width:100%;max-width:420px;margin-top:10px}
.fbp .fbp-clock{font-variant-numeric:tabular-nums;font-weight:600;color:#b3261e;margin-left:8px}
.fbp .fbp-link{background:none;border:0;padding:0;color:var(--primary);text-decoration:underline;font:inherit;font-size:15px;cursor:pointer}
.fbp .fbp-verified{border:1px solid #2e7d32;background:#edf7ee;border-radius:6px;padding:10px 14px;color:#1b5e20;font-weight:600}
.fbp .fbp-notice{background:#faf6ef;border:1px solid var(--border);border-radius:6px;padding:12px 18px;margin:10px 0 0}
.fbp .fbp-notice h4{font-size:16px;margin:0 0 6px;color:var(--pd);padding:0}
.fbp .fbp-notice ul{margin:0 0 0 18px;padding:0;font-size:15px}
.fbp .fbp-staff{border:1px dashed #b9ad9a;border-radius:6px;padding:10px 16px;margin:0 0 18px}
.fbp .fbp-staff legend{font-weight:600;padding:0 6px}
.fbp .fbp-emerg{color:#5f1410}
.fbp .fbp-bad{color:#b3261e}
.fbp [hidden]{display:none!important}
</style>';
}

/* ---------- Patient's answer to the "resolved" SMS (section 4, follow-up) ---------- */

add_action( 'template_redirect', 'sssihms_fb_answer_page', 1 );
function sssihms_fb_answer_page() {
	if ( ! sssihms_fb_is_target() || empty( $_GET['fbr'] ) ) {
		return;
	}
	global $wpdb;
	if ( ! defined( 'DONOTCACHEPAGE' ) ) {
		define( 'DONOTCACHEPAGE', true );
	}
	nocache_headers();
	header( 'X-Robots-Tag: noindex' );
	$tok = preg_replace( '/[^A-Za-z0-9]/', '', (string) wp_unslash( $_GET['fbr'] ) );
	$t   = 16 === strlen( $tok ) ? $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . sssihms_fb_t( 'tickets' ) . ' WHERE token = %s', $tok ) ) : null;
	$say = '';
	// A POST, so that link previews and scanners cannot answer for the patient.
	if ( $t && 'resolved' === $t->status && 'POST' === $_SERVER['REQUEST_METHOD'] && isset( $_POST['fb_choice'] ) ) {
		if ( 'yes' === $_POST['fb_choice'] ) {
			sssihms_fb_update( $t, array( 'status' => 'closed', 'closed_at' => sssihms_fb_now(), 'satisfied' => 1 ) );
			sssihms_fb_log( $t->id, 'patient', 'Satisfied; ticket closed' );
			$say = 'Thank you. We are glad your concern was addressed.';
		} else {
			$level = min( 2, $t->esc_level + 1 );
			sssihms_fb_update(
				$t,
				array(
					'status'      => 'reopened',
					'satisfied'   => 0,
					'resolved_at' => null,
					'reopened'    => $t->reopened + 1,
					'esc_level'   => $level,
					'escalations' => $t->escalations + 1,
					'resolve_due' => sssihms_fb_add_days( sssihms_fb_now(), sssihms_fb_priorities()[ $t->priority ]['resolve'] ),
					'reminded'    => '',
				)
			);
			sssihms_fb_log( $t->id, 'patient', 'Not satisfied; ticket reopened and moved to escalation level ' . $level );
			sssihms_fb_mail( array_merge( sssihms_fb_owner_email( $t ), sssihms_fb_esc_emails( $level ), sssihms_fb_cell_emails() ), 'Patient not satisfied: ticket reopened', 'The patient tapped "Not satisfied". The ticket is reopened and has moved up to escalation level ' . $level . '.', $t );
			$say = 'Thank you for telling us. Your feedback has been reopened, and a senior officer will look into it.';
		}
	}
	if ( ! $t ) {
		$body = '<p>This link is not valid. If you need help, please call the Help Desk on ' . SSSIHMS_FB_HELP . '.</p>';
	} elseif ( $say ) {
		$body = '<p>' . esc_html( $say ) . '</p>';
	} elseif ( 'resolved' === $t->status ) {
		$body = '<p>We have addressed your feedback. Are you satisfied with how it was handled?</p><form method="post"><button name="fb_choice" value="yes" class="y">Satisfied</button><button name="fb_choice" value="no" class="n">Not satisfied</button></form>';
	} elseif ( 'closed' === $t->status ) {
		$body = '<p>This feedback is closed. Thank you for helping us improve.</p>';
	} else {
		$body = '<p>Your feedback is being looked into. We will send you an SMS when it has been addressed.</p>';
	}
	$no = $t ? ' ' . esc_html( $t->ticket_no ) : '';
	echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Your feedback' . $no . ' — SSSIHMS Whitefield</title>'
		. '<style>body{margin:0;background:#fcf9f4;color:#2a1f14;font:17px/1.6 Lato,Arial,sans-serif}main{max-width:520px;margin:0 auto;padding:32px 18px}h1{font:700 26px/1.3 "Playfair Display",Georgia,serif;color:#5a2d0c;margin:0 0 6px}.sub{color:#6b5d4c;font-size:15px;margin:0 0 22px}'
		. 'form{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px}button{flex:1 1 200px;font:700 18px Lato,Arial,sans-serif;padding:16px;border-radius:8px;border:0;cursor:pointer;color:#fff}.y{background:#2e7d32}.n{background:#b3261e}</style></head>'
		. '<body><main><h1>Your feedback' . $no . '</h1><p class="sub">Patient Welfare Services, Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield</p>' . $body . '</main></body></html>';
	exit;
}

/* ---------- Scheduler: reminders, escalation, auto-close, report, retention (section 5.4) ---------- */

add_filter( 'cron_schedules', function ( $s ) {
	$s['sssihms_fb_5min'] = array( 'interval' => 300, 'display' => 'Every 5 minutes' );
	return $s;
} );

add_action( 'init', function () {
	if ( sssihms_fb_is_target() && ! wp_next_scheduled( 'sssihms_fb_tick' ) ) {
		wp_schedule_event( time() + 60, 'sssihms_fb_5min', 'sssihms_fb_tick' );
	}
} );

add_action( 'sssihms_fb_tick', 'sssihms_fb_tick' );
function sssihms_fb_tick() {
	if ( ! sssihms_fb_is_target() ) {
		return;
	}
	global $wpdb;
	$now = sssihms_fb_now();
	$P   = sssihms_fb_priorities();
	foreach ( $wpdb->get_results( 'SELECT * FROM ' . sssihms_fb_t( 'tickets' ) . " WHERE status IN ('new','assigned','action','reopened','resolved')" ) as $t ) {
		if ( 'resolved' === $t->status ) { // No answer from the patient in 3 working days.
			if ( $now >= sssihms_fb_add_days( $t->resolved_at, 3 ) ) {
				sssihms_fb_update( $t, array( 'status' => 'closed', 'closed_at' => $now ) );
				sssihms_fb_log( $t->id, 'auto-closed', 'no answer from the patient in 3 working days' );
			}
			continue;
		}
		$done = array_filter( explode( ',', $t->reminded ) );
		$new  = 'new' === $t->status;
		$st   = $new ? 'a' : 'r';
		$from = $new ? $t->created_at : ( $t->assigned_at ?: $t->created_at );
		$due  = $new ? $t->assign_due : $t->resolve_due;
		$to   = $new || 'action' === $t->status || ! $t->owner_id ? sssihms_fb_cell_emails() : sssihms_fb_owner_email( $t );
		$a    = strtotime( $from );
		$b    = strtotime( $due );
		foreach ( array( 50, 90 ) as $pct ) {
			if ( ! in_array( $st . $pct, $done, true ) && strtotime( $now ) >= $a + ( $b - $a ) * $pct / 100 ) {
				$done[] = $st . $pct;
				if ( $now < $due ) {
					sssihms_fb_mail( $to, 'Reminder: ' . $pct . '% of the time limit used', 'This ticket has used ' . $pct . '% of its time to be ' . ( $new ? 'assigned' : 'resolved' ) . '. It is due ' . sssihms_fb_show( $due ) . '.', $t );
				}
			}
		}
		$level = $t->esc_level;
		if ( $now > $due && $P[ $t->priority ]['esc'] >= 1 && $level < 1 ) {
			$level = 1;
		}
		// High: level 2 if still open 2 working days after the resolution limit.
		if ( 'high' === $t->priority && ! $new && $level < 2 && $now > sssihms_fb_add_days( $t->resolve_due, 2 ) ) {
			$level = 2;
		}
		if ( $level > $t->esc_level ) {
			sssihms_fb_update( $t, array( 'esc_level' => $level, 'escalations' => $t->escalations + 1 ) );
			sssihms_fb_log( $t->id, 'escalated', 'level ' . $level . ': the ' . ( $new ? 'assignment' : 'resolution' ) . ' deadline passed' );
			sssihms_fb_mail( sssihms_fb_esc_emails( $level ), 'Escalated to level ' . $level, 'This ticket passed its ' . ( $new ? 'assignment' : 'resolution' ) . ' deadline (' . sssihms_fb_show( $due ) . ') and is escalated to you. The owner stays on the ticket; you can reassign it or extend the deadline.', $t );
		} elseif ( $now > $due && 'critical' === $t->priority && ! in_array( $st . 'x', $done, true ) ) {
			$done[] = $st . 'x'; // Critical is already at level 2: tell them once that a deadline passed.
			sssihms_fb_mail( sssihms_fb_esc_emails( 2 ), 'Critical ticket overdue', 'This Critical ticket passed its ' . ( $new ? 'assignment' : 'resolution' ) . ' deadline (' . sssihms_fb_show( $due ) . ').', $t );
			sssihms_fb_log( $t->id, 'overdue', 'level 2 told that the deadline passed' );
		}
		if ( implode( ',', $done ) !== $t->reminded ) {
			sssihms_fb_update( $t, array( 'reminded' => implode( ',', $done ) ) );
		}
	}
	sssihms_fb_monthly_mail();
	sssihms_fb_retention();
}

/**
 * Section 7, decision D6. Off until the hospital confirms the periods in settings. Recordings go
 * 90 days after closure unless the ticket is on hold (under inquiry); after 2 years the name,
 * contact details and Patient ID are removed and the rest is kept for statistics.
 */
function sssihms_fb_retention() {
	if ( ! sssihms_fb_settings()['retention'] ) {
		return;
	}
	global $wpdb;
	$T = sssihms_fb_t( 'tickets' );
	foreach ( $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $T WHERE status = 'closed' AND audio <> '' AND hold = 0 AND closed_at < %s LIMIT 50", sssihms_fb_at( '-90 days' ) ) ) as $t ) {
		wp_delete_file( sssihms_fb_audio_dir() . '/' . $t->audio );
		sssihms_fb_update( $t, array( 'audio' => '', 'audio_deleted_at' => sssihms_fb_now() ) );
		sssihms_fb_log( $t->id, 'retention', 'voice recording deleted, 90 days after closure' );
	}
	foreach ( $wpdb->get_results( $wpdb->prepare( "SELECT * FROM $T WHERE status = 'closed' AND hold = 0 AND deidentified_at IS NULL AND closed_at < %s LIMIT 50", sssihms_fb_at( '-2 years' ) ) ) as $t ) {
		sssihms_fb_update( $t, array( 'patient_name' => '', 'patient_id' => '', 'attendant' => '', 'phone' => '', 'email' => '', 'deidentified_at' => sssihms_fb_now() ) );
		sssihms_fb_log( $t->id, 'retention', 'name, contact details and Patient ID removed, 2 years after closure' );
	}
}

/* ---------- Monthly report (section 8) ---------- */

/** All measures for tickets received in month $ym (YYYY-MM). Test and merged tickets are left out. */
function sssihms_fb_report( $ym ) {
	global $wpdb;
	$start = $ym . '-01 00:00:00';
	$end   = sssihms_fb_dt( $start )->modify( '+1 month' )->format( 'Y-m-d H:i:s' );
	$rows  = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . sssihms_fb_t( 'tickets' ) . ' WHERE created_at >= %s AND created_at < %s AND is_test = 0 AND merged_into = 0', $start, $end ) );
	$cats  = sssihms_fb_categories();
	$locs  = sssihms_fb_locations();
	$chans = sssihms_fb_channels();
	$P     = sssihms_fb_priorities();
	$r     = array(
		'n'         => count( $rows ),
		'category'  => array(),
		'location'  => array(),
		'channel'   => array(),
		'dept'      => array(),
		'assigned'  => array( 0, 0 ),
		'resolved'  => array( 0, 0 ),
		'critical'  => array( 0, 0 ),
		'median'    => array(),
		'esc_dept'  => array(),
		'escalated' => 0,
		'reopened'  => array( 0, 0 ),
		'satisfied' => array( 0, 0 ),
		'repeat'    => array(),
		'thanks'    => array(),
		'extended'  => 0,
		'open'      => 0,
	);
	$days = array();
	$pair = array();
	$now  = sssihms_fb_now();
	foreach ( $rows as $t ) {
		$cat  = $cats[ $t->category ][0] ?? $t->category;
		$loc  = $t->src ? ( $locs[ $t->src ] ?? $t->src ) : 'Not given';
		$dept = $t->owner_id ? sssihms_fb_dept( $t->owner_id ) : 'Not assigned';
		$r['category'][ $cat ] = ( $r['category'][ $cat ] ?? 0 ) + 1;
		$r['location'][ $loc ] = ( $r['location'][ $loc ] ?? 0 ) + 1;
		$r['channel'][ $chans[ $t->channel ] ] = ( $r['channel'][ $chans[ $t->channel ] ] ?? 0 ) + 1;
		$r['dept'][ $dept ]    = ( $r['dept'][ $dept ] ?? 0 ) + 1;
		// Assigned on time: out of all tickets whose assignment deadline has come, or that are assigned.
		if ( $t->assigned_at || $now > $t->assign_due ) {
			++$r['assigned'][1];
			$r['assigned'][0] += $t->assigned_at && $t->assigned_at <= $t->assign_due ? 1 : 0;
		}
		// Resolved on time: out of tickets with a resolution sent to the patient (a reopen clears it).
		$res = $t->resolved_at;
		if ( $res ) {
			++$r['resolved'][1];
			$r['resolved'][0] += $res <= $t->resolve_due ? 1 : 0;
			if ( 'critical' === $t->priority ) {
				++$r['critical'][1];
				$r['critical'][0] += $res <= $t->resolve_due ? 1 : 0;
			}
			$days[ $t->priority ][] = sssihms_fb_workdays_between( $t->created_at, $res );
		}
		if ( $t->escalations ) {
			++$r['escalated'];
			$r['esc_dept'][ $dept ] = ( $r['esc_dept'][ $dept ] ?? 0 ) + 1;
		}
		if ( 'closed' === $t->status ) {
			++$r['reopened'][1];
			$r['reopened'][0] += $t->reopened ? 1 : 0;
		}
		if ( null !== $t->satisfied ) {
			++$r['satisfied'][1];
			$r['satisfied'][0] += (int) $t->satisfied;
		}
		if ( 'appreciation' === $t->category ) {
			$r['thanks'][ $dept ] = ( $r['thanks'][ $dept ] ?? 0 ) + 1;
		}
		$r['extended'] += $t->extended ? 1 : 0;
		$r['open']     += 'closed' === $t->status ? 0 : 1;
		$pair[ $cat . ' at ' . $loc ] = ( $pair[ $cat . ' at ' . $loc ] ?? 0 ) + 1;
	}
	foreach ( $P as $k => $p ) {
		if ( ! empty( $days[ $k ] ) ) {
			sort( $days[ $k ] );
			$c                       = count( $days[ $k ] );
			$m                       = $c % 2 ? $days[ $k ][ intdiv( $c, 2 ) ] : ( $days[ $k ][ $c / 2 - 1 ] + $days[ $k ][ $c / 2 ] ) / 2;
			$r['median'][ $p['label'] ] = array( round( $m, 1 ), $p['resolve'], $c );
		}
	}
	$r['repeat'] = array_filter( $pair, function ( $n ) {
		return $n >= 3;
	} );
	foreach ( array( 'category', 'location', 'channel', 'dept', 'esc_dept', 'thanks', 'repeat' ) as $k ) {
		arsort( $r[ $k ] );
	}
	$O         = sssihms_fb_t( 'otp' );
	$r['otp']  = array(
		(int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $O WHERE sent = 1 AND verified_at IS NULL AND created_at >= %s AND created_at < %s", $start, $end ) ),
		(int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $O WHERE sent = 1 AND created_at >= %s AND created_at < %s", $start, $end ) ),
	);
	return $r;
}

function sssihms_fb_pct( array $pair ) {
	return $pair[1] ? round( 100 * $pair[0] / $pair[1] ) . '% (' . $pair[0] . ' of ' . $pair[1] . ')' : 'None yet';
}

/** The headline measures as rows of array( measure, value, target ). */
function sssihms_fb_report_rows( array $r ) {
	return array(
		array( 'Submissions', (string) $r['n'], 'No target; watch the trend' ),
		array( 'Still open', (string) $r['open'], '' ),
		array( 'Assigned on time', sssihms_fb_pct( $r['assigned'] ), '95%' ),
		array( 'Resolved on time', sssihms_fb_pct( $r['resolved'] ), '90%' ),
		array( 'Critical resolved on time', sssihms_fb_pct( $r['critical'] ), '100%' ),
		array( 'Escalated (missed deadline or patient not satisfied)', $r['n'] ? $r['escalated'] . ' (' . round( 100 * $r['escalated'] / $r['n'] ) . '%)' : '0', 'Falling quarter on quarter' ),
		array( 'Deadlines extended', (string) $r['extended'], 'Shown for review' ),
		array( 'Reopened (of closed tickets)', sssihms_fb_pct( $r['reopened'] ), 'Below 10%' ),
		array( 'Satisfied with the resolution', sssihms_fb_pct( $r['satisfied'] ), '80%' ),
		array( 'OTPs sent but never verified', sssihms_fb_pct( $r['otp'] ), 'Watched; high means a delivery problem' ),
	);
}

/** Sends last month's report once, on or after the 1st (section 8 asks for it by the 5th). */
function sssihms_fb_monthly_mail() {
	$ym = wp_date( 'Y-m', strtotime( 'first day of last month' ) );
	if ( get_option( 'sssihms_fb_report_sent' ) >= $ym ) {
		return;
	}
	update_option( 'sssihms_fb_report_sent', $ym );
	$r    = sssihms_fb_report( $ym );
	$to   = array_merge( sssihms_fb_role_emails( array( 'sssihms_fb_coord', 'sssihms_fb_esc2' ) ), array_filter( array_map( 'trim', explode( ',', sssihms_fb_settings()['report_to'] ) ), 'is_email' ) );
	$html = '<p style="font-family:Arial,sans-serif;font-size:14px">Patient feedback report for ' . esc_html( sssihms_fb_dt( $ym . '-01' )->format( 'M-Y' ) ) . ' (tickets received in the month; test tickets left out).</p><table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px"><tr style="background:#f4efe6"><th align="left">Measure</th><th align="left">Value</th><th align="left">Target</th></tr>';
	foreach ( sssihms_fb_report_rows( $r ) as $row ) {
		$html .= '<tr><td>' . esc_html( $row[0] ) . '</td><td>' . esc_html( $row[1] ) . '</td><td>' . esc_html( $row[2] ) . '</td></tr>';
	}
	$html .= '</table><p style="font-family:Arial,sans-serif;font-size:14px"><a href="' . esc_url( admin_url( 'admin.php?page=sssihms-fb-report&month=' . $ym ) ) . '">Full report, with breakdowns and Excel download</a> (login needed).</p>';
	if ( $to ) {
		wp_mail( array_unique( $to ), 'Patient feedback report — ' . sssihms_fb_dt( $ym . '-01' )->format( 'M-Y' ), $html, array( 'Content-Type: text/html; charset=UTF-8' ) );
	}
}

/* ---------- Staff screens ---------- */

add_action( 'admin_menu', 'sssihms_fb_admin_menu' );
function sssihms_fb_admin_menu() {
	if ( ! sssihms_fb_is_target() ) {
		return;
	}
	add_menu_page( 'Feedback Tickets', 'Feedback Tickets', SSSIHMS_FB_ACCESS, 'sssihms-fb', 'sssihms_fb_admin_page', 'dashicons-tickets-alt', 27 );
	add_submenu_page( 'sssihms-fb', 'Feedback Tickets', 'Tickets', SSSIHMS_FB_ACCESS, 'sssihms-fb', 'sssihms_fb_admin_page' );
	if ( current_user_can( SSSIHMS_FB_CELL ) || current_user_can( SSSIHMS_FB_ESC1 ) || current_user_can( SSSIHMS_FB_ESC2 ) ) {
		add_submenu_page( 'sssihms-fb', 'Feedback report', 'Monthly report', SSSIHMS_FB_ACCESS, 'sssihms-fb-report', 'sssihms_fb_report_page' );
	}
	add_submenu_page( 'sssihms-fb', 'Feedback portal settings', 'Settings', SSSIHMS_FB_EXPORT, 'sssihms-fb-settings', 'sssihms_fb_settings_page' );
}

function sssihms_fb_admin_css() {
	return '<style>
.fb-badge{display:inline-block;padding:1px 8px;border-radius:10px;font-size:12px;font-weight:600;background:#eee;margin-right:4px}
.fb-critical{background:#b3261e;color:#fff}.fb-high{background:#f0b429}.fb-over{background:#fdecea;color:#8a1c14;border:1px solid #b3261e}.fb-test{background:#dde7f5}
.fb-grid{display:grid;grid-template-columns:minmax(0,3fr) minmax(280px,2fr);gap:24px}
.fb-box{background:#fff;border:1px solid #dcdcde;padding:4px 18px 14px;margin-bottom:18px}
.fb-box th{text-align:left;width:150px;vertical-align:top;padding:4px 8px 4px 0}.fb-box td{padding:4px 0}
.fb-act textarea,.fb-act input[type=text],.fb-act select{width:100%}
.fb-body{white-space:pre-wrap;background:#faf6ef;padding:10px 12px;border-radius:4px}
@media(max-width:1100px){.fb-grid{grid-template-columns:minmax(0,1fr)}}
</style>';
}

function sssihms_fb_badges( $t ) {
	$b = '';
	if ( in_array( $t->priority, array( 'critical', 'high' ), true ) ) {
		$b .= '<span class="fb-badge fb-' . $t->priority . '">' . esc_html( sssihms_fb_priorities()[ $t->priority ]['label'] ) . '</span>';
	}
	if ( sssihms_fb_overdue( $t ) ) {
		$b .= '<span class="fb-badge fb-over">Overdue</span>';
	}
	if ( $t->esc_level ) {
		$b .= '<span class="fb-badge">Level ' . (int) $t->esc_level . '</span>';
	}
	if ( $t->is_test ) {
		$b .= '<span class="fb-badge fb-test">TEST</span>';
	}
	return $b;
}

function sssihms_fb_admin_page() {
	if ( ! sssihms_fb_is_target() ) {
		return;
	}
	echo '<div class="wrap">' . sssihms_fb_admin_css();
	foreach ( array( 'fb_msg' => 'success', 'fb_err' => 'error' ) as $k => $cls ) {
		if ( isset( $_GET[ $k ] ) ) {
			echo '<div class="notice notice-' . $cls . '"><p>' . esc_html( sanitize_text_field( wp_unslash( $_GET[ $k ] ) ) ) . '</p></div>';
		}
	}
	$t = isset( $_GET['ticket'] ) ? sssihms_fb_get( absint( $_GET['ticket'] ) ) : null;
	if ( isset( $_GET['ticket'] ) && ( ! $t || ! sssihms_fb_can_see( $t ) ) ) {
		echo '<h1>Feedback ticket</h1><p>This ticket does not exist, or it is not assigned to you.</p></div>';
		return;
	}
	if ( $t ) {
		sssihms_fb_log( $t->id, 'viewed' );
		sssihms_fb_ticket_view( $t );
	} else {
		sssihms_fb_ticket_list();
	}
	echo '</div>';
}

function sssihms_fb_queues() {
	$q = array();
	if ( current_user_can( SSSIHMS_FB_CELL ) ) {
		$q['todo'] = array( 'Needs the Cell', "(status IN ('new','action') OR (status = 'reopened' AND owner_id = 0))" );
	}
	if ( current_user_can( SSSIHMS_FB_OWNER ) ) {
		$q['mine'] = array( 'Mine', 'owner_id = ' . (int) get_current_user_id() . " AND status IN ('assigned','reopened')" );
	}
	if ( current_user_can( SSSIHMS_FB_ESC1 ) || current_user_can( SSSIHMS_FB_ESC2 ) ) {
		$q['esc'] = array( 'Escalated', "esc_level >= 1 AND status <> 'closed'" );
	}
	$now        = esc_sql( sssihms_fb_now() );
	$q['over']  = array( 'Overdue', "((status = 'new' AND assign_due < '$now') OR (status IN ('assigned','action','reopened') AND resolve_due < '$now'))" );
	$q['open']  = array( 'All open', "status <> 'closed'" );
	$q['await'] = array( 'Awaiting patient', "status = 'resolved'" );
	$q['closed'] = array( 'Closed', "status = 'closed'" );
	return $q;
}

function sssihms_fb_ticket_list() {
	global $wpdb;
	$queues = sssihms_fb_queues();
	$cur    = sanitize_key( $_GET['q'] ?? '' );
	$cur    = isset( $queues[ $cur ] ) ? $cur : array_key_first( $queues );
	$scope  = sssihms_fb_scope_sql();
	$find   = sanitize_text_field( wp_unslash( $_GET['s'] ?? '' ) );
	echo '<h1 class="wp-heading-inline">Feedback Tickets</h1>';
	if ( current_user_can( SSSIHMS_FB_CELL ) ) {
		$live = get_page_by_path( 'patient-feedback' );
		$form = $live && has_shortcode( $live->post_content, 'sssihms_feedback_portal' ) ? get_permalink( $live ) : home_url( '/feedback-portal-test/' );
		echo ' <a class="page-title-action" href="' . esc_url( $form ) . '" target="_blank">Assisted entry (opens the form)</a>';
	}
	if ( current_user_can( SSSIHMS_FB_EXPORT ) ) {
		echo ' <a class="page-title-action" href="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=sssihms_fb_xlsx' ), 'sssihms_fb_xlsx' ) ) . '">Download all tickets (.xlsx)</a>';
	}
	echo '<ul class="subsubsub">';
	$links = array();
	foreach ( $queues as $k => $q ) {
		$n       = (int) $wpdb->get_var( 'SELECT COUNT(*) FROM ' . sssihms_fb_t( 'tickets' ) . " WHERE $scope AND merged_into = 0 AND {$q[1]}" );
		$links[] = '<li><a href="' . esc_url( admin_url( 'admin.php?page=sssihms-fb&q=' . $k ) ) . '"' . ( $k === $cur && ! $find ? ' class="current"' : '' ) . '>' . esc_html( $q[0] ) . ' <span class="count">(' . $n . ')</span></a>';
	}
	echo implode( ' |</li>', $links ) . '</li></ul>';
	echo '<form method="get" style="float:right;margin:8px 0"><input type="hidden" name="page" value="sssihms-fb"><input type="search" name="s" value="' . esc_attr( $find ) . '" placeholder="Ticket number"> <button class="button">Find</button></form>';
	$where = $find ? $wpdb->prepare( 'ticket_no LIKE %s', '%' . $wpdb->esc_like( strtoupper( $find ) ) . '%' ) : $queues[ $cur ][1] . ' AND merged_into = 0';
	$rows  = $wpdb->get_results( 'SELECT * FROM ' . sssihms_fb_t( 'tickets' ) . " WHERE $scope AND $where ORDER BY id DESC LIMIT 300" );
	$cats  = sssihms_fb_categories();
	$locs  = sssihms_fb_locations();
	echo '<table class="widefat striped" style="clear:both"><thead><tr><th>Ticket</th><th>Received</th><th>Category</th><th>Status</th><th>Owner</th><th>Due</th><th>Location</th><th>Channel</th></tr></thead><tbody>';
	foreach ( $rows as $t ) {
		echo '<tr><td><a href="' . esc_url( admin_url( 'admin.php?page=sssihms-fb&ticket=' . $t->id ) ) . '"><strong>' . esc_html( $t->ticket_no ) . '</strong></a><br>' . sssihms_fb_badges( $t ) . ( $t->audio ? ' 🎙' : '' ) . '</td>'
			. '<td>' . esc_html( sssihms_fb_show( $t->created_at ) ) . '</td><td>' . esc_html( $cats[ $t->category ][0] ?? $t->category ) . ( $t->summary ? '<br><small>' . esc_html( $t->summary ) . '</small>' : '' ) . '</td>'
			. '<td>' . esc_html( sssihms_fb_statuses()[ $t->status ] ) . '</td><td>' . esc_html( sssihms_fb_dept( $t->owner_id ) ) . '</td><td>' . esc_html( sssihms_fb_show( sssihms_fb_due( $t ) ) ) . '</td>'
			. '<td>' . esc_html( $t->src ? ( $locs[ $t->src ] ?? $t->src ) : '' ) . '</td><td>' . esc_html( sssihms_fb_channels()[ $t->channel ] ) . '</td></tr>';
	}
	if ( ! $rows ) {
		echo '<tr><td colspan="8">No tickets here.</td></tr>';
	}
	echo '</tbody></table><p class="description">Showing up to 300 tickets, newest first. Times are IST. Deadlines count working days, Monday to Saturday, less the holidays in Settings.</p>';
}

/** Owners who can be assigned: users with the "Feedback department owner" role. */
function sssihms_fb_owners() {
	$out = array();
	foreach ( get_users( array( 'role__in' => array( 'sssihms_fb_owner' ), 'orderby' => 'display_name' ) ) as $u ) {
		$out[ $u->ID ] = sssihms_fb_dept( $u->ID ) . ( get_user_meta( $u->ID, 'sssihms_fb_dept', true ) ? ' — ' . $u->display_name : '' );
	}
	return $out;
}

function sssihms_fb_form( $t, $do, $title, $inner, $button, $help = '' ) {
	return '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '" class="fb-box fb-act"><h3>' . esc_html( $title ) . '</h3>'
		. ( $help ? '<p class="description">' . esc_html( $help ) . '</p>' : '' )
		. wp_nonce_field( 'sssihms_fb_act_' . $t->id, '_wpnonce', true, false )
		. '<input type="hidden" name="action" value="sssihms_fb_act"><input type="hidden" name="id" value="' . (int) $t->id . '"><input type="hidden" name="do" value="' . esc_attr( $do ) . '">'
		. $inner . '<p><button class="button button-primary">' . esc_html( $button ) . '</button></p></form>';
}

function sssihms_fb_select( $name, array $opts, $cur = '', $blank = '' ) {
	$h = '<select name="' . esc_attr( $name ) . '">' . ( $blank ? '<option value="">' . esc_html( $blank ) . '</option>' : '' );
	foreach ( $opts as $k => $v ) {
		$h .= '<option value="' . esc_attr( $k ) . '"' . selected( (string) $cur, (string) $k, false ) . '>' . esc_html( $v ) . '</option>';
	}
	return $h . '</select>';
}

function sssihms_fb_ticket_view( $t ) {
	global $wpdb;
	$cats   = sssihms_fb_categories();
	$P      = sssihms_fb_priorities();
	$locs   = sssihms_fb_locations();
	$cell   = current_user_can( SSSIHMS_FB_CELL );
	$esc    = current_user_can( SSSIHMS_FB_ESC1 ) || current_user_can( SSSIHMS_FB_ESC2 );
	$mine   = (int) $t->owner_id === get_current_user_id();
	$closed = 'closed' === $t->status;
	$ta     = function ( $name, $rows = 3 ) {
		return '<textarea name="' . esc_attr( $name ) . '" rows="' . (int) $rows . '" required></textarea>';
	};
	echo '<p><a href="' . esc_url( admin_url( 'admin.php?page=sssihms-fb' ) ) . '">← All tickets</a></p><h1>' . esc_html( $t->ticket_no ) . ' ' . sssihms_fb_badges( $t ) . '</h1><div class="fb-grid"><div>';

	$info = array(
		'Status'   => sssihms_fb_statuses()[ $t->status ] . ( $t->close_reason ? ': ' . sssihms_fb_close_reasons()[ $t->close_reason ] : '' ) . ( $t->merged_into ? ' (merged into ' . ( sssihms_fb_get( $t->merged_into )?->ticket_no ?? '?' ) . ')' : '' ),
		'Received' => sssihms_fb_show( $t->created_at ) . ' · ' . sssihms_fb_channels()[ $t->channel ] . ( $t->staff_id ? ', entered by ' . sssihms_fb_dept( $t->staff_id ) : '' ),
		'Category' => $cats[ $t->category ][0] ?? $t->category,
		'Priority' => $P[ $t->priority ]['label'],
		'Location' => $t->src ? ( $locs[ $t->src ] ?? $t->src ) : 'Not given',
		'Owner'    => $t->owner_id ? sssihms_fb_dept( $t->owner_id ) : 'Not assigned',
		'Assign by' => sssihms_fb_show( $t->assign_due ) . ( $t->assigned_at ? ' (assigned ' . sssihms_fb_show( $t->assigned_at ) . ')' : '' ),
		'Resolve by' => sssihms_fb_show( $t->resolve_due ) . ( $t->extended ? ' (extended)' : '' ) . ( $t->resolved_at ? ' (resolved ' . sssihms_fb_show( $t->resolved_at ) . ')' : '' ),
		'Patient answer' => null === $t->satisfied ? '' : ( $t->satisfied ? 'Satisfied' : 'Not satisfied' ) . ( $t->reopened ? ' · reopened ' . (int) $t->reopened . '×' : '' ),
		'Retention' => ( $t->hold ? 'On hold (under inquiry)' : '' ) . ( $t->audio_deleted_at ? ' Recording deleted ' . sssihms_fb_show( $t->audio_deleted_at ) : '' ) . ( $t->deidentified_at ? ' Personal details removed ' . sssihms_fb_show( $t->deidentified_at ) : '' ),
	);
	echo '<div class="fb-box"><h3>Ticket</h3><table>';
	foreach ( array_filter( $info ) as $k => $v ) {
		echo '<tr><th>' . esc_html( $k ) . '</th><td>' . esc_html( $v ) . '</td></tr>';
	}
	echo '</table></div>';

	$who = array(
		'Patient'    => $t->patient_name,
		'Patient ID' => $t->patient_id,
		'Attendant'  => $t->attendant,
	);
	if ( sssihms_fb_can_contact() ) {
		$who['Mobile'] = $t->phone ? $t->phone . ( $t->phone_verified ? ' (verified by OTP)' : ' (not verified)' ) : '';
		$who['Email']  = $t->email;
		$who['Consent'] = $t->consent ? ( $t->staff_id ? 'Notice read out by staff' : 'Given on the form' ) : 'Not recorded';
	}
	echo '<div class="fb-box"><h3>Patient</h3><table>';
	foreach ( array_filter( $who ) as $k => $v ) {
		echo '<tr><th>' . esc_html( $k ) . '</th><td>' . esc_html( $v ) . '</td></tr>';
	}
	echo '</table></div><div class="fb-box"><h3>Feedback</h3>';
	if ( $t->summary ) {
		echo '<p><strong>Summary:</strong> ' . esc_html( $t->summary ) . '</p>';
	}
	echo $t->body ? '<div class="fb-body">' . esc_html( $t->body ) . '</div>' : '<p><em>No written text.</em></p>';
	if ( $t->audio ) {
		echo '<p><strong>Voice recording</strong>' . ( $t->audio_secs ? ' (' . gmdate( 'i:s', $t->audio_secs ) . ')' : '' ) . '</p><audio controls preload="none" style="width:100%" src="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=sssihms_fb_audio&id=' . $t->id ), 'sssihms_fb_audio_' . $t->id ) ) . '"></audio>';
	}
	echo '</div><div class="fb-box"><h3>History</h3><table class="widefat striped"><tbody>';
	foreach ( $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM ' . sssihms_fb_t( 'log' ) . ' WHERE ticket_id = %d ORDER BY id DESC', $t->id ) ) as $l ) {
		if ( 'viewed' === $l->action && ! $cell ) {
			continue;
		}
		$u = $l->user_id ? get_userdata( $l->user_id ) : null;
		echo '<tr><td style="white-space:nowrap">' . esc_html( sssihms_fb_show( $l->at ) ) . '</td><td>' . esc_html( $u ? $u->display_name : ( 'patient' === $l->action ? 'Patient' : 'System' ) ) . '</td><td><strong>' . esc_html( $l->action ) . '</strong> ' . nl2br( esc_html( $l->detail ) ) . '</td></tr>';
	}
	echo '</tbody></table></div></div><div>';

	// Actions, by role and status (section 5.3).
	if ( $cell && ! $closed ) {
		echo sssihms_fb_form( $t, 'triage', 'Triage', '<p><label>Category<br>' . sssihms_fb_select( 'category', wp_list_pluck( $cats, 0 ), $t->category ) . '</label></p><p><label>Priority<br>' . sssihms_fb_select( 'priority', wp_list_pluck( $P, 'label' ), $t->priority ) . '</label></p><p><label>One-line summary (for owners; needed for voice-only feedback)<br><input type="text" name="summary" maxlength="255" value="' . esc_attr( $t->summary ) . '"></label></p>', 'Save triage', 'Changing the priority recalculates both deadlines from the time the ticket was received.' );
	}
	if ( ( $cell || $esc ) && in_array( $t->status, SSSIHMS_FB_OPEN, true ) ) {
		$owners = sssihms_fb_owners();
		echo sssihms_fb_form( $t, 'assign', $t->owner_id ? 'Reassign' : 'Assign to a department owner', $owners ? '<p>' . sssihms_fb_select( 'owner', $owners, $t->owner_id, 'Choose an owner' ) . '</p>' : '<p>No user has the "Feedback department owner" role yet. Add owners under Users.</p>', $t->owner_id ? 'Reassign' : 'Assign', 'The owner gets an email with a link to this ticket; the email carries no patient details. On the first assignment the patient gets the "Assigned" SMS.' );
	}
	if ( $mine && in_array( $t->status, array( 'assigned', 'reopened' ), true ) ) {
		echo sssihms_fb_form( $t, 'action', 'Resolution note', '<p><label>What was found<br>' . $ta( 'found' ) . '</label></p><p><label>What was done<br>' . $ta( 'done' ) . '</label></p><p><label>What prevents a repeat<br>' . $ta( 'prevent' ) . '</label></p>', 'Send to the Feedback Cell', 'The Cell then replies to the patient and marks the ticket resolved.' );
		echo sssihms_fb_form( $t, 'return', 'Not ours: send back', '<p><label>Reason<br>' . $ta( 'reason', 2 ) . '</label></p>', 'Send back to the Cell', 'Please send back wrongly routed tickets within 1 working day.' );
	}
	if ( $cell && in_array( $t->status, SSSIHMS_FB_OPEN, true ) ) {
		echo sssihms_fb_form( $t, 'resolve', 'Reply to the patient and mark resolved', '<p><label>How the patient was told<br>' . sssihms_fb_select( 'method', array( 'phone' => 'Phone call', 'sms' => 'SMS only', 'email' => 'Email', 'person' => 'In person' ) ) . '</label></p><p><label>What the patient was told<br>' . $ta( 'note' ) . '</label></p>', 'Mark resolved', 'Phone the patient for Critical and High tickets. The patient then gets the "Resolved" SMS with a Satisfied / Not satisfied link; with no answer the ticket closes after 3 working days.' );
	}
	if ( $esc && in_array( $t->status, SSSIHMS_FB_OPEN, true ) ) {
		echo sssihms_fb_form( $t, 'extend', 'Extend the resolution deadline', '<p><label>New date<br><input type="date" name="date" required min="' . esc_attr( wp_date( 'Y-m-d' ) ) . '"></label></p><p><label>Reason<br>' . $ta( 'reason', 2 ) . '</label></p>', 'Extend', 'Extensions show in the monthly report.' );
	}
	if ( $cell && ! $closed ) {
		echo sssihms_fb_form( $t, 'close', 'Close without the patient\'s answer', '<p><label>Reason<br>' . sssihms_fb_select( 'reason', sssihms_fb_close_reasons() ) . '</label></p><p><label>Note<br>' . $ta( 'note', 2 ) . '</label></p>', 'Close ticket', 'For appreciation passed on, concerns routed out of this process (section 1), or a patient who cannot be reached.' );
		echo sssihms_fb_form( $t, 'merge', 'Merge a duplicate', '<p><label>Keep ticket number<br><input type="text" name="into" placeholder="FB-261028-0001" required></label></p>', 'Merge into that ticket', 'This ticket is closed and points to the one kept.' );
	}
	echo sssihms_fb_form( $t, 'note', 'Add a note', '<p>' . $ta( 'note', 3 ) . '</p>', 'Add note', 'Notes are never deleted; to correct one, add another.' );
	if ( $cell ) {
		echo sssihms_fb_form( $t, 'hold', $t->hold ? 'Release the hold' : 'Hold (under inquiry)', '', $t->hold ? 'Release hold' : 'Put on hold', 'A ticket on hold keeps its recording and personal details past the retention periods.' );
	}
	if ( current_user_can( SSSIHMS_FB_EXPORT ) && ! $t->deidentified_at ) {
		echo sssihms_fb_form( $t, 'erase', 'Erase personal data on the patient\'s request', '<p><label>Type the ticket number to confirm<br><input type="text" name="confirm" required></label></p>', 'Erase personal data', 'Section 7: removes the name, Patient ID, attendant, contact details, written text, summary and recording. The ticket number, category, location and dates stay. The erasure is recorded, not the content. This cannot be undone.' );
	}
	echo '</div></div>';
}

add_action( 'admin_post_sssihms_fb_act', 'sssihms_fb_act' );
function sssihms_fb_act() {
	$id = absint( $_POST['id'] ?? 0 );
	if ( ! sssihms_fb_is_target() ) {
		wp_die( 'Not allowed.', 403 );
	}
	check_admin_referer( 'sssihms_fb_act_' . $id );
	$t = sssihms_fb_get( $id );
	if ( ! $t || ! sssihms_fb_can_see( $t ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	$in   = wp_unslash( $_POST );
	$txt  = function ( $k ) use ( $in ) {
		return mb_substr( trim( sanitize_textarea_field( $in[ $k ] ?? '' ) ), 0, 2000 );
	};
	$cell = current_user_can( SSSIHMS_FB_CELL );
	$esc  = current_user_can( SSSIHMS_FB_ESC1 ) || current_user_can( SSSIHMS_FB_ESC2 );
	$mine = (int) $t->owner_id === get_current_user_id();
	$open = in_array( $t->status, SSSIHMS_FB_OPEN, true );
	$now  = sssihms_fb_now();
	$P    = sssihms_fb_priorities();
	$msg  = '';
	$err  = '';
	switch ( sanitize_key( $in['do'] ?? '' ) ) {
		case 'triage':
			if ( ! $cell || 'closed' === $t->status ) {
				break;
			}
			$cat = sanitize_key( $in['category'] ?? '' );
			$pri = sanitize_key( $in['priority'] ?? '' );
			$sum = mb_substr( sanitize_text_field( $in['summary'] ?? '' ), 0, 255 );
			if ( ! isset( sssihms_fb_categories()[ $cat ], $P[ $pri ] ) ) {
				$err = 'Choose a category and a priority.';
				break;
			}
			$upd   = array();
			$log   = array();
			$raise = false;
			if ( $cat !== $t->category ) {
				$upd['category'] = $cat;
				$log[]           = 'category ' . sssihms_fb_categories()[ $t->category ][0] . ' → ' . sssihms_fb_categories()[ $cat ][0];
			}
			if ( $pri !== $t->priority ) {
				$upd    = array_merge( $upd, array( 'priority' => $pri, 'extended' => 0, 'reminded' => '' ), sssihms_fb_dues( $t->created_at, $pri ) );
				$log[]  = 'priority ' . $P[ $t->priority ]['label'] . ' → ' . $P[ $pri ]['label'];
				$raise  = 'critical' === $pri && $t->esc_level < 2;
			}
			if ( $sum !== $t->summary ) {
				$upd['summary'] = $sum;
				$log[]          = 'summary: ' . $sum;
			}
			if ( $upd ) {
				if ( $raise ) {
					$upd['esc_level'] = 2;
				}
				sssihms_fb_update( $t, $upd );
				sssihms_fb_log( $t->id, 'triage', implode( "\n", $log ) );
				if ( $raise ) {
					sssihms_fb_log( $t->id, 'escalated', 'level 2 at once (Critical)' );
					sssihms_fb_mail( sssihms_fb_esc_emails( 2 ), 'Ticket raised to CRITICAL', 'The Feedback Cell set this ticket to Critical. It is with escalation level 2 from now (SOP 5.1).', $t );
				}
			}
			$msg = $upd ? 'Triage saved.' : 'Nothing changed.';
			break;

		case 'assign':
			$owner = absint( $in['owner'] ?? 0 );
			if ( ! ( $cell || $esc ) || ! $open || ! isset( sssihms_fb_owners()[ $owner ] ) ) {
				$err = 'Choose an owner.';
				break;
			}
			if ( $owner === (int) $t->owner_id ) {
				$msg = 'That owner already has the ticket.';
				break;
			}
			$first = ! $t->assigned_at;
			sssihms_fb_update( $t, array( 'owner_id' => $owner, 'status' => 'reopened' === $t->status ? 'reopened' : 'assigned', 'assigned_at' => $t->assigned_at ?: $now, 'reminded' => implode( ',', array_diff( explode( ',', $t->reminded ), array( 'r50', 'r90' ) ) ) ) );
			sssihms_fb_log( $t->id, 'assigned', 'to ' . sssihms_fb_dept( $owner ) );
			sssihms_fb_mail( sssihms_fb_owner_email( $t ), 'Patient feedback assigned to you', 'This ticket is assigned to you. Please investigate, act and write a resolution note by ' . sssihms_fb_show( $t->resolve_due ) . '. If it is not yours, send it back within 1 working day.', $t );
			if ( $first && $t->phone ) {
				sssihms_fb_sms( $t->id, $t->phone, 'assigned', array( $t->ticket_no, mb_substr( sssihms_fb_dept( $owner ), 0, 30 ) ) );
			}
			$msg = 'Assigned to ' . sssihms_fb_dept( $owner ) . '.';
			break;

		case 'return':
			$reason = $txt( 'reason' );
			if ( ! $mine || ! in_array( $t->status, array( 'assigned', 'reopened' ), true ) || '' === $reason ) {
				$err = 'Give a reason.';
				break;
			}
			sssihms_fb_log( $t->id, 'returned', 'by ' . sssihms_fb_dept( $t->owner_id ) . ': ' . $reason );
			sssihms_fb_update( $t, array( 'owner_id' => 0, 'status' => 'reopened' === $t->status ? 'reopened' : 'new' ) );
			sssihms_fb_mail( sssihms_fb_cell_emails(), 'Ticket sent back by the owner', 'The department owner sent this ticket back as not theirs. Please reassign it.', $t );
			$msg = 'Sent back to the Feedback Cell.';
			break;

		case 'action':
			$found   = $txt( 'found' );
			$done    = $txt( 'done' );
			$prevent = $txt( 'prevent' );
			if ( ! $mine || ! in_array( $t->status, array( 'assigned', 'reopened' ), true ) || '' === $found || '' === $done || '' === $prevent ) {
				$err = 'Fill in all three parts of the resolution note.';
				break;
			}
			sssihms_fb_update( $t, array( 'status' => 'action' ) );
			sssihms_fb_log( $t->id, 'resolution note', "Found: $found\nDone: $done\nPrevents a repeat: $prevent" );
			sssihms_fb_mail( sssihms_fb_cell_emails(), 'Resolution note received', 'The department owner has written the resolution note. Please reply to the patient and mark the ticket resolved.', $t );
			$msg = 'Resolution note sent to the Feedback Cell.';
			break;

		case 'resolve':
			$note   = $txt( 'note' );
			$method = sanitize_key( $in['method'] ?? '' );
			if ( ! $cell || ! $open || '' === $note ) {
				$err = 'Write what the patient was told.';
				break;
			}
			sssihms_fb_update( $t, array( 'status' => 'resolved', 'resolved_at' => $now, 'satisfied' => null ) );
			sssihms_fb_log( $t->id, 'resolved', '(' . $method . ') ' . $note );
			$link = home_url( '/?fbr=' . $t->token );
			if ( $t->phone ) {
				sssihms_fb_sms( $t->id, $t->phone, 'resolved', array( $t->ticket_no, $link ) );
			}
			if ( $t->email ) {
				wp_mail( $t->email, 'Your feedback ' . $t->ticket_no . ' - SSSIHMS Whitefield', "Sairam.\n\nYour feedback " . $t->ticket_no . " has been addressed. Please tell us if you are satisfied:\n$link\n\nSri Sathya Sai Institute of Higher Medical Sciences, Whitefield\n" );
				sssihms_fb_log( $t->id, 'email', 'resolution emailed to the patient' );
			}
			$msg = 'Marked resolved. The patient has been asked whether they are satisfied.';
			break;

		case 'close':
			$reason = sanitize_key( $in['reason'] ?? '' );
			$note   = $txt( 'note' );
			if ( ! $cell || 'closed' === $t->status || ! isset( sssihms_fb_close_reasons()[ $reason ] ) || '' === $note ) {
				$err = 'Choose a reason and write a note.';
				break;
			}
			sssihms_fb_update( $t, array( 'status' => 'closed', 'closed_at' => $now, 'close_reason' => $reason ) );
			sssihms_fb_log( $t->id, 'closed', sssihms_fb_close_reasons()[ $reason ] . ': ' . $note );
			$msg = 'Ticket closed.';
			break;

		case 'merge':
			global $wpdb;
			$keep = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM ' . sssihms_fb_t( 'tickets' ) . ' WHERE ticket_no = %s', strtoupper( trim( sanitize_text_field( $in['into'] ?? '' ) ) ) ) );
			if ( ! $cell || 'closed' === $t->status || ! $keep || (int) $keep->id === (int) $t->id || $keep->merged_into ) {
				$err = 'Enter the number of another ticket that is not itself merged.';
				break;
			}
			sssihms_fb_update( $t, array( 'status' => 'closed', 'closed_at' => $now, 'merged_into' => $keep->id ) );
			sssihms_fb_log( $t->id, 'merged', 'into ' . $keep->ticket_no );
			sssihms_fb_log( $keep->id, 'merged', $t->ticket_no . ' merged into this ticket' );
			$msg = 'Merged into ' . $keep->ticket_no . '.';
			break;

		case 'note':
			$note = $txt( 'note' );
			if ( '' === $note ) {
				$err = 'Write the note.';
				break;
			}
			sssihms_fb_log( $t->id, 'note', $note );
			$msg = 'Note added.';
			break;

		case 'extend':
			$date   = sanitize_text_field( $in['date'] ?? '' );
			$reason = $txt( 'reason' );
			if ( ! $esc || ! $open || ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $date ) || $date < wp_date( 'Y-m-d' ) || '' === $reason ) {
				$err = 'Choose a date from today on and give a reason.';
				break;
			}
			list( , $end ) = sssihms_fb_hours();
			$due           = $date . ' ' . sprintf( '%02d:%02d:00', intdiv( $end, 60 ), $end % 60 );
			sssihms_fb_log( $t->id, 'extended', 'resolve by ' . sssihms_fb_show( $t->resolve_due ) . ' → ' . sssihms_fb_show( $due ) . ': ' . $reason );
			sssihms_fb_update( $t, array( 'resolve_due' => $due, 'extended' => $t->extended + 1, 'reminded' => implode( ',', array_diff( explode( ',', $t->reminded ), array( 'r50', 'r90', 'rx' ) ) ) ) );
			$msg = 'Deadline extended.';
			break;

		case 'hold':
			if ( ! $cell ) {
				break;
			}
			sssihms_fb_update( $t, array( 'hold' => $t->hold ? 0 : 1 ) );
			sssihms_fb_log( $t->id, 'hold', $t->hold ? 'put on hold (under inquiry)' : 'hold released' );
			$msg = $t->hold ? 'Ticket on hold.' : 'Hold released.';
			break;

		case 'erase':
			if ( ! current_user_can( SSSIHMS_FB_EXPORT ) || strtoupper( trim( sanitize_text_field( $in['confirm'] ?? '' ) ) ) !== $t->ticket_no ) {
				$err = 'Type the ticket number exactly to confirm.';
				break;
			}
			if ( $t->audio ) {
				wp_delete_file( sssihms_fb_audio_dir() . '/' . $t->audio );
			}
			sssihms_fb_update( $t, array( 'patient_name' => '', 'patient_id' => '', 'attendant' => '', 'phone' => '', 'email' => '', 'body' => '', 'summary' => '', 'audio' => '', 'deidentified_at' => $now, 'audio_deleted_at' => $t->audio ? $now : $t->audio_deleted_at ) );
			sssihms_fb_log( $t->id, 'erased', 'personal data erased on the patient\'s request' );
			$msg = 'Personal data erased.';
			break;
	}
	$url = admin_url( 'admin.php?page=sssihms-fb&ticket=' . $t->id );
	wp_safe_redirect( add_query_arg( $err ? 'fb_err' : 'fb_msg', rawurlencode( $err ?: ( $msg ?: 'Not allowed for this ticket now.' ) ), $url ) );
	exit;
}

/** Streams a recording to staff who may see the ticket. Supports Range requests, which Safari needs. */
add_action( 'admin_post_sssihms_fb_audio', 'sssihms_fb_audio' );
function sssihms_fb_audio() {
	$id = absint( $_GET['id'] ?? 0 );
	check_admin_referer( 'sssihms_fb_audio_' . $id );
	$t = sssihms_fb_is_target() ? sssihms_fb_get( $id ) : null;
	if ( ! $t || ! $t->audio || ! sssihms_fb_can_see( $t ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	$file = sssihms_fb_audio_dir() . '/' . basename( $t->audio );
	if ( ! is_file( $file ) ) {
		wp_die( 'The recording is missing.', 404 );
	}
	$size  = filesize( $file );
	$start = 0;
	$end   = $size - 1;
	if ( preg_match( '/bytes=(\d*)-(\d*)/', $_SERVER['HTTP_RANGE'] ?? '', $m ) ) {
		$start = '' === $m[1] ? max( 0, $size - (int) $m[2] ) : (int) $m[1];
		$end   = '' === $m[1] || '' === $m[2] ? $end : min( $end, (int) $m[2] );
		status_header( 206 );
		header( "Content-Range: bytes $start-$end/$size" );
	}
	if ( 0 === $start ) {
		sssihms_fb_log( $t->id, 'played', 'voice recording' );
	}
	nocache_headers();
	header( 'Content-Type: ' . $t->audio_mime );
	header( 'Accept-Ranges: bytes' );
	header( 'Content-Length: ' . ( $end - $start + 1 ) );
	$fh = fopen( $file, 'rb' );
	fseek( $fh, $start );
	echo fread( $fh, $end - $start + 1 );
	fclose( $fh );
	exit;
}

/** Coordinator only (section 7): every ticket with the patient's details. Logged. */
add_action( 'admin_post_sssihms_fb_xlsx', 'sssihms_fb_xlsx' );
function sssihms_fb_xlsx() {
	global $wpdb;
	if ( ! sssihms_fb_is_target() || ! current_user_can( SSSIHMS_FB_EXPORT ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	check_admin_referer( 'sssihms_fb_xlsx' );
	$cats = sssihms_fb_categories();
	$locs = sssihms_fb_locations();
	$rows = array( array( 'Ticket', 'Received', 'Channel', 'Location', 'Category', 'Priority', 'Status', 'Owner', 'Escalation level', 'Assign by', 'Assigned', 'Resolve by', 'Resolved', 'Closed', 'Patient answer', 'Patient', 'Patient ID', 'Attendant', 'Mobile', 'Verified', 'Email', 'Feedback', 'Voice recording', 'Summary', 'Test' ) );
	foreach ( $wpdb->get_results( 'SELECT * FROM ' . sssihms_fb_t( 'tickets' ) . ' ORDER BY id' ) as $t ) {
		$rows[] = array(
			$t->ticket_no, sssihms_fb_show( $t->created_at ), sssihms_fb_channels()[ $t->channel ], $t->src ? ( $locs[ $t->src ] ?? $t->src ) : '',
			$cats[ $t->category ][0] ?? $t->category, sssihms_fb_priorities()[ $t->priority ]['label'], sssihms_fb_statuses()[ $t->status ], sssihms_fb_dept( $t->owner_id ),
			(string) $t->esc_level, sssihms_fb_show( $t->assign_due ), sssihms_fb_show( $t->assigned_at ), sssihms_fb_show( $t->resolve_due ), sssihms_fb_show( $t->resolved_at ), sssihms_fb_show( $t->closed_at ),
			null === $t->satisfied ? '' : ( $t->satisfied ? 'Satisfied' : 'Not satisfied' ),
			$t->patient_name, $t->patient_id, $t->attendant, $t->phone, $t->phone ? ( $t->phone_verified ? 'Yes' : 'No' ) : '', $t->email, $t->body,
			$t->audio ? 'Yes (' . gmdate( 'i:s', $t->audio_secs ) . ')' : '', $t->summary, $t->is_test ? 'Yes' : '',
		);
	}
	sssihms_fb_log( 0, 'export', ( count( $rows ) - 1 ) . ' tickets exported to Excel' );
	$tmp = wp_tempnam( 'feedback-tickets' );
	sssihms_fa_write_xlsx( $tmp, 'Feedback tickets', $rows );
	sssihms_fa_send_download( $tmp, 'Feedback-tickets_' . wp_date( 'Y-m-d' ) . '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
}

function sssihms_fb_report_page() {
	if ( ! ( current_user_can( SSSIHMS_FB_CELL ) || current_user_can( SSSIHMS_FB_ESC1 ) || current_user_can( SSSIHMS_FB_ESC2 ) ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	$ym = preg_match( '/^\d{4}-\d{2}$/', $_GET['month'] ?? '' ) ? $_GET['month'] : wp_date( 'Y-m' );
	$r  = sssihms_fb_report( $ym );
	echo '<div class="wrap">' . sssihms_fb_admin_css() . '<h1>Patient feedback report — ' . esc_html( sssihms_fb_dt( $ym . '-01' )->format( 'M-Y' ) ) . '</h1>'
		. '<form method="get"><input type="hidden" name="page" value="sssihms-fb-report"><input type="month" name="month" value="' . esc_attr( $ym ) . '"> <button class="button">Show</button> '
		. '<a class="button" href="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=sssihms_fb_report_xlsx&month=' . $ym ), 'sssihms_fb_report_xlsx' ) ) . '">Download (.xlsx)</a></form>'
		. '<p class="description">Tickets received in the month (section 8 of the SOP). Test tickets and merged duplicates are left out. A month still in progress shows the position so far.</p>';
	foreach ( sssihms_fb_report_sections( $r ) as $title => $rows ) {
		echo '<h2>' . esc_html( $title ) . '</h2><table class="widefat striped" style="max-width:900px"><thead><tr>';
		foreach ( array_shift( $rows ) as $h ) {
			echo '<th>' . esc_html( $h ) . '</th>';
		}
		echo '</tr></thead><tbody>';
		foreach ( $rows as $row ) {
			echo '<tr><td>' . implode( '</td><td>', array_map( 'esc_html', $row ) ) . '</td></tr>';
		}
		if ( ! $rows ) {
			echo '<tr><td colspan="3">None.</td></tr>';
		}
		echo '</tbody></table>';
	}
	echo '</div>';
}

/** Report tables: title => rows, the first row being the header. */
function sssihms_fb_report_sections( array $r ) {
	$count = function ( $title, array $a ) {
		$rows = array( array( $title, 'Tickets' ) );
		foreach ( $a as $k => $n ) {
			$rows[] = array( (string) $k, (string) $n );
		}
		return $rows;
	};
	$median = array( array( 'Priority', 'Median working days to resolve', 'Limit (working days)', 'Resolved tickets' ) );
	foreach ( $r['median'] as $k => $m ) {
		$median[] = array( $k, (string) $m[0], (string) $m[1], (string) $m[2] );
	}
	return array(
		'Headline measures'                       => array_merge( array( array( 'Measure', 'Value', 'Target' ) ), sssihms_fb_report_rows( $r ) ),
		'Time to resolve'                         => $median,
		'By category'                             => $count( 'Category', $r['category'] ),
		'By location (QR code)'                   => $count( 'Location', $r['location'] ),
		'By channel'                              => $count( 'Channel', $r['channel'] ),
		'By department'                           => $count( 'Department owner', $r['dept'] ),
		'Escalations by department'               => $count( 'Department owner', $r['esc_dept'] ),
		'Repeat issues (3 or more in the month; each needs a named action owner)' => $count( 'Category at location', $r['repeat'] ),
		'Appreciation by department'              => $count( 'Department owner', $r['thanks'] ),
	);
}

add_action( 'admin_post_sssihms_fb_report_xlsx', 'sssihms_fb_report_xlsx' );
function sssihms_fb_report_xlsx() {
	if ( ! sssihms_fb_is_target() || ! ( current_user_can( SSSIHMS_FB_CELL ) || current_user_can( SSSIHMS_FB_ESC1 ) || current_user_can( SSSIHMS_FB_ESC2 ) ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	check_admin_referer( 'sssihms_fb_report_xlsx' );
	$ym   = preg_match( '/^\d{4}-\d{2}$/', $_GET['month'] ?? '' ) ? $_GET['month'] : wp_date( 'Y-m' );
	$rows = array( array( 'Section', 'Item', 'Value', 'Target / limit', 'Count' ) );
	foreach ( sssihms_fb_report_sections( sssihms_fb_report( $ym ) ) as $title => $sec ) {
		array_shift( $sec );
		foreach ( $sec as $row ) {
			$rows[] = array_pad( array_merge( array( $title ), $row ), 5, '' );
		}
	}
	$tmp = wp_tempnam( 'feedback-report' );
	sssihms_fa_write_xlsx( $tmp, 'Report ' . $ym, $rows );
	sssihms_fa_send_download( $tmp, 'Patient-feedback-report_' . $ym . '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
}

function sssihms_fb_settings_page() {
	if ( ! current_user_can( SSSIHMS_FB_EXPORT ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	$s = sssihms_fb_settings();
	echo '<div class="wrap"><h1>Feedback portal settings</h1>';
	if ( isset( $_GET['fb_msg'] ) ) {
		echo '<div class="notice notice-success"><p>Settings saved.</p></div>';
	}
	echo '<p>SMS provider: <strong>' . ( sssihms_fb_sms_connected() ? 'connected' : 'not connected yet' ) . '</strong>. Intake API for other channels: <strong>' . ( defined( 'SSSIHMS_FB_INTAKE_SECRET' ) ? 'on' : 'off' ) . '</strong>. Scheduler: next run ' . esc_html( wp_date( 'd-M-Y H:i', wp_next_scheduled( 'sssihms_fb_tick' ) ?: time() ) ) . '.</p>'
		. '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">' . wp_nonce_field( 'sssihms_fb_settings', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="sssihms_fb_settings"><table class="form-table">'
		. '<tr><th>Working hours</th><td><input type="text" name="hours" value="' . esc_attr( $s['hours'] ) . '" placeholder="09:00-17:00"><p class="description">Used for the 2-hour assignment limit on Critical tickets.</p></td></tr>'
		. '<tr><th>Hospital holidays</th><td><textarea name="holidays" rows="6" cols="40">' . esc_textarea( $s['holidays'] ) . '</textarea><p class="description">One date per line as YYYY-MM-DD; text after the date is ignored. Sundays are never working days.</p></td></tr>'
		. '<tr><th>QR locations</th><td><textarea name="locations" rows="12" cols="60">' . esc_textarea( $s['locations'] ) . '</textarea><p class="description">One per line: code|Label. The poster for a location links to ' . esc_html( home_url( '/patient-feedback/?src=' ) ) . '<em>code</em>. Codes use a–z, 0–9 and dashes, for example ward-3a or opd-cardiology.</p></td></tr>'
		. '<tr><th>DLT template IDs</th><td>';
	foreach ( sssihms_fb_sms_templates() as $k => $text ) {
		echo '<p><label><strong>' . esc_html( $k ) . '</strong> <input type="text" name="dlt_' . esc_attr( $k ) . '" value="' . esc_attr( $s[ 'dlt_' . $k ] ) . '" size="24"></label><br><small>' . esc_html( $text ) . '</small></p>';
	}
	echo '</td></tr><tr><th>Monthly report also to</th><td><input type="text" name="report_to" value="' . esc_attr( $s['report_to'] ) . '" size="60"><p class="description">Comma-separated. Coordinators and the level 2 officer always get it.</p></td></tr>'
		. '<tr><th>Retention</th><td><label><input type="checkbox" name="retention" value="1"' . checked( $s['retention'], 1, false ) . '> Delete recordings 90 days after closure, and remove personal details 2 years after closure (decision D6)</label></td></tr>'
		. '</table><p><button class="button button-primary">Save settings</button></p></form></div>';
}

add_action( 'admin_post_sssihms_fb_settings', function () {
	if ( ! sssihms_fb_is_target() || ! current_user_can( SSSIHMS_FB_EXPORT ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	check_admin_referer( 'sssihms_fb_settings' );
	$in  = wp_unslash( $_POST );
	$new = array(
		'hours'     => sanitize_text_field( $in['hours'] ?? '' ),
		'holidays'  => sanitize_textarea_field( $in['holidays'] ?? '' ),
		'locations' => sanitize_textarea_field( $in['locations'] ?? '' ),
		'report_to' => sanitize_text_field( $in['report_to'] ?? '' ),
		'retention' => empty( $in['retention'] ) ? 0 : 1,
	);
	foreach ( array_keys( sssihms_fb_sms_templates() ) as $k ) {
		$new[ 'dlt_' . $k ] = preg_replace( '/\D/', '', $in[ 'dlt_' . $k ] ?? '' );
	}
	$old = sssihms_fb_settings();
	update_option( 'sssihms_fb_settings', $new, false );
	$changed = array_keys( array_diff_assoc( array_map( 'strval', $new ), array_map( 'strval', array_intersect_key( $old, $new ) ) ) );
	if ( $changed ) {
		sssihms_fb_log( 0, 'settings', 'changed: ' . implode( ', ', $changed ) );
	}
	wp_safe_redirect( admin_url( 'admin.php?page=sssihms-fb-settings&fb_msg=1' ) );
	exit;
} );

/* ---------- Department name on owners' user profiles ---------- */

add_action( 'show_user_profile', 'sssihms_fb_profile' );
add_action( 'edit_user_profile', 'sssihms_fb_profile' );
function sssihms_fb_profile( $user ) {
	if ( ! sssihms_fb_is_target() || ! user_can( $user, SSSIHMS_FB_OWNER ) ) {
		return;
	}
	$edit = current_user_can( SSSIHMS_FB_EXPORT ) || current_user_can( 'edit_users' );
	echo '<h2>Patient feedback</h2><table class="form-table"><tr><th><label for="sssihms_fb_dept">Department or team</label></th><td><input type="text" name="sssihms_fb_dept" id="sssihms_fb_dept" maxlength="30" value="' . esc_attr( get_user_meta( $user->ID, 'sssihms_fb_dept', true ) ) . '"' . ( $edit ? '' : ' readonly' ) . '><p class="description">Shown to the patient in the "Assigned" SMS ("being looked into by the … team"), so keep it short: at most 30 characters, for example Dietary or Nursing.</p></td></tr></table>';
}

add_action( 'personal_options_update', 'sssihms_fb_profile_save' );
add_action( 'edit_user_profile_update', 'sssihms_fb_profile_save' );
function sssihms_fb_profile_save( $user_id ) {
	if ( sssihms_fb_is_target() && isset( $_POST['sssihms_fb_dept'] ) && ( current_user_can( SSSIHMS_FB_EXPORT ) || current_user_can( 'edit_users' ) ) ) {
		update_user_meta( $user_id, 'sssihms_fb_dept', mb_substr( sanitize_text_field( wp_unslash( $_POST['sssihms_fb_dept'] ) ), 0, 30 ) );
	}
}
