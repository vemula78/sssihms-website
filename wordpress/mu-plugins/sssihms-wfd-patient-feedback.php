<?php
/**
 * Plugin Name: SSSIHMS Whitefield — Patient Feedback
 * Description: Patient feedback form for Patient Welfare Services. Shortcode [sssihms_patient_feedback]. Blog 4 only.
 *
 * Same questions as the earlier Google Form "SSSIHMS-WFD Patient Feedback". A phone number
 * (10 digits) or an email address is required so the team can reply. Each submission is kept
 * on the server (private post type sssihms_pf), listed in wp-admin → Patient Feedback with a
 * status and Excel export, and emailed to the Help Desk mailbox. The address is never shown
 * on the page. No acknowledgement email is sent, so the form cannot be used to mail strangers.
 *
 * Spam guards: honeypot field, minimum time on the page (set by the form script), at most
 * five submissions an hour per connection, and no more than one web link in the text.
 *
 * Uses sssihms_fa_css(), sssihms_fa_write_xlsx() and sssihms_fa_send_download() from
 * sssihms-wfd-fellowship-application.php.
 */

defined( 'ABSPATH' ) || exit;

const SSSIHMS_PF_TO  = 'helpdeskblr@sssihms.org.in';
const SSSIHMS_PF_CAP = 'sssihms_pws'; // Administrators, editors and the "Patient Welfare Services" role.

function sssihms_pf_is_target() {
	return is_multisite() && get_current_blog_id() === 4;
}

/** Questions in form order: key => array( label, type, required, options ). */
function sssihms_pf_fields() {
	return array(
		'type'       => array( 'Feedback type', 'checks', true, array( 'Information about Service', 'Staff Behaviour', 'Food', 'Any Other' ) ),
		'comments'   => array( 'Comments', 'textarea', true, null ),
		'suggest'    => array( 'Suggestions for improvement', 'textarea', false, null ),
		'patient_id' => array( 'Patient ID', 'text', true, null ),
		'patient'    => array( 'Patient name', 'text', true, null ),
		'attendant'  => array( 'Attendant name', 'text', false, null ),
		'phone'      => array( 'Contact number (10 digits)', 'tel', false, null ),
		'email'      => array( 'Email', 'email', false, null ),
	);
}

function sssihms_pf_statuses() {
	return array( 'new' => 'New', 'contacted' => 'Contacted', 'closed' => 'Closed' );
}

$GLOBALS['sssihms_pf_errors'] = array();
$GLOBALS['sssihms_pf_values'] = array();

add_action( 'template_redirect', 'sssihms_pf_handle' );
function sssihms_pf_handle() {
	if ( ! sssihms_pf_is_target() || 'POST' !== $_SERVER['REQUEST_METHOD'] || empty( $_POST['sssihms_pf'] ) ) {
		return;
	}
	nocache_headers();
	if ( ! empty( $_POST['website'] ) ) { // Honeypot.
		wp_safe_redirect( add_query_arg( 'feedback', 'PF-0', get_permalink() ) . '#patient-feedback' );
		exit;
	}
	$errors = array();
	$v      = array();
	$rl_key = 'sssihms_pf_' . md5( wp_salt() . ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
	$count  = (int) get_transient( $rl_key );
	if ( $count >= 5 ) {
		$errors[] = 'Too many submissions from your connection. Please try again in an hour.';
	}
	if ( (int) ( $_POST['pf_t'] ?? 0 ) < 3 ) {
		$errors[] = 'Please take a moment to check your answers, then submit again.';
	}

	foreach ( sssihms_pf_fields() as $key => $f ) {
		list( $label, $type, $req, $opts ) = $f;
		$raw = wp_unslash( $_POST[ 'pf_' . $key ] ?? '' );
		if ( 'checks' === $type ) {
			$val = implode( ', ', array_values( array_intersect( $opts, array_map( 'sanitize_text_field', (array) $raw ) ) ) );
		} elseif ( 'textarea' === $type ) {
			$val = mb_substr( trim( sanitize_textarea_field( $raw ) ), 0, 2000 );
		} elseif ( 'email' === $type ) {
			$val = sanitize_email( $raw );
		} else {
			$val = mb_substr( trim( sanitize_text_field( $raw ) ), 0, 120 );
		}
		$v[ $key ] = $val;
		if ( $req && '' === $val ) {
			$errors[] = 'checks' === $type ? 'Choose at least one feedback type.' : $label . ' is required.';
		}
	}
	$v['phone'] = preg_replace( '/[\s-]/', '', $v['phone'] );
	if ( '' !== $v['phone'] && ! preg_match( '/^\d{10}$/', $v['phone'] ) ) {
		$errors[] = 'Enter the contact number as 10 digits.';
	}
	if ( '' !== $v['email'] && ! is_email( $v['email'] ) ) {
		$errors[] = 'Enter a valid email address.';
	}
	if ( '' === $v['phone'] && '' === $v['email'] ) {
		$errors[] = 'Give a contact number or an email address, so that we can reply to you.';
	}
	if ( preg_match_all( '#https?://|www\.#i', $v['comments'] . ' ' . $v['suggest'] ) > 1 ) {
		$errors[] = 'Please remove the web links from your comments.';
	}

	if ( $errors ) {
		$GLOBALS['sssihms_pf_errors'] = $errors;
		$GLOBALS['sssihms_pf_values'] = $v;
		return;
	}

	set_transient( $rl_key, $count + 1, HOUR_IN_SECONDS );
	$ref  = 'PF' . current_time( 'ymd' ) . '-' . strtoupper( wp_generate_password( 4, false ) );
	$rows = array( 'Reference' => $ref, 'Submitted' => current_time( 'd-M-Y H:i' ) . ' IST' );
	foreach ( sssihms_pf_fields() as $key => $f ) {
		$rows[ $f[0] ] = $v[ $key ];
	}
	$post_id = wp_insert_post(
		array(
			'post_type'   => 'sssihms_pf',
			'post_status' => 'private',
			'post_title'  => $ref,
			'meta_input'  => array( '_pf_rows' => $rows, '_pf_status' => 'new' ),
		)
	);
	if ( ! $post_id ) {
		error_log( 'sssihms-pf: feedback ' . $ref . ' could not be stored; email only.' );
	}

	$html = '<p>New patient feedback received through whitefield.sssihms.org/patient-feedback/.</p><table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
	foreach ( $rows as $label => $val ) {
		if ( '' !== $val ) {
			$html .= '<tr><th align="left" style="background:#f4efe6">' . esc_html( $label ) . '</th><td>' . nl2br( esc_html( $val ) ) . '</td></tr>';
		}
	}
	$html   .= '</table><p>All feedback is listed in wp-admin → Patient Feedback.</p>';
	$headers = array( 'Content-Type: text/html; charset=UTF-8' );
	if ( '' !== $v['email'] ) {
		$headers[] = 'Reply-To: ' . str_replace( array( '<', '>', '"', ',' ), '', $v['patient'] ) . ' <' . $v['email'] . '>';
	}
	$sent = wp_mail( SSSIHMS_PF_TO, 'Patient feedback — ' . $v['type'] . ' [' . $ref . ']', $html, $headers );
	if ( $post_id ) {
		update_post_meta( $post_id, '_pf_emailed', $sent ? 1 : 0 );
	}
	if ( ! $sent && ! $post_id ) {
		$GLOBALS['sssihms_pf_errors'] = array( 'Sorry — your feedback could not be sent because of a problem on our side. Please try again later, or call the Help Desk on 080-4710 4600.' );
		$GLOBALS['sssihms_pf_values'] = $v;
		return;
	}
	wp_safe_redirect( add_query_arg( 'feedback', $ref, get_permalink() ) . '#patient-feedback' );
	exit;
}

add_shortcode( 'sssihms_patient_feedback', 'sssihms_pf_render' );
function sssihms_pf_render() {
	if ( ! sssihms_pf_is_target() ) {
		return '';
	}
	$out = '<div id="patient-feedback" class="fa-wrap">' . sssihms_fa_css() . sssihms_pf_css();
	$ref = isset( $_GET['feedback'] ) ? sanitize_text_field( wp_unslash( $_GET['feedback'] ) ) : '';
	if ( preg_match( '/^PF\d{6}-[A-Z0-9]{4}$/', $ref ) || 'PF-0' === $ref ) {
		return $out . '<div class="fa-ok" role="status"><h3>Thank you for your feedback</h3><p>It has reached the Patient Welfare Services team.'
			. ( 'PF-0' === $ref ? '' : ' Your reference is <strong>' . esc_html( $ref ) . '</strong>.' )
			. ' We will contact you if we need more details.</p></div></div>';
	}
	if ( $GLOBALS['sssihms_pf_errors'] ) {
		$out .= '<div class="fa-err" role="alert" tabindex="-1" id="pf-errors"><strong>Please correct the following and submit again.</strong><ul>';
		foreach ( $GLOBALS['sssihms_pf_errors'] as $e ) {
			$out .= '<li>' . esc_html( $e ) . '</li>';
		}
		$out .= '</ul></div><script>document.getElementById("pf-errors").focus();</script>';
	}

	$v     = $GLOBALS['sssihms_pf_values'];
	$req   = '<span class="fa-req" aria-hidden="true">*</span>';
	$all   = sssihms_pf_fields();
	$field = function ( $k ) use ( $all, $v, $req ) {
		list( $label, $type, $required, $opts ) = $all[ $k ];
		$id   = 'pf-' . $k;
		$nm   = 'pf_' . $k;
		$cur  = $v[ $k ] ?? '';
		$star = $required ? ' ' . $req : '';
		if ( 'checks' === $type ) {
			$sel = array_map( 'trim', explode( ',', $cur ) );
			$h   = '<fieldset class="fa-field"><legend>' . esc_html( $label ) . $star . '</legend>';
			foreach ( $opts as $o ) {
				$h .= '<label class="fa-opt"><input type="checkbox" name="' . $nm . '[]" value="' . esc_attr( $o ) . '"' . ( in_array( $o, $sel, true ) ? ' checked' : '' ) . '> ' . esc_html( $o ) . '</label>';
			}
			return $h . '</fieldset>';
		}
		$h = '<div class="fa-field' . ( 'textarea' === $type ? ' pf-wide' : '' ) . '"><label for="' . $id . '">' . esc_html( $label ) . $star . '</label>';
		if ( 'textarea' === $type ) {
			return $h . '<textarea id="' . $id . '" name="' . $nm . '" rows="4" maxlength="2000"' . ( $required ? ' required' : '' ) . '>' . esc_textarea( $cur ) . '</textarea></div>';
		}
		$extra = array(
			'tel'   => ' inputmode="numeric" maxlength="10" pattern="[0-9]{10}" autocomplete="tel" title="10 digits"',
			'email' => ' autocomplete="email"',
			'text'  => ' maxlength="120"',
		);
		return $h . '<input type="' . $type . '" id="' . $id . '" name="' . $nm . '" value="' . esc_attr( $cur ) . '"' . $extra[ $type ] . ( $required ? ' required' : '' ) . '></div>';
	};

	$out .= '<form method="post" action="#patient-feedback" class="fa-form" id="pf-form" novalidate>'
		. '<input type="hidden" name="sssihms_pf" value="1"><input type="hidden" name="pf_t" id="pf-t" value="0">'
		. '<div class="fa-hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>'
		. '<p class="fa-note">Fields marked ' . $req . ' are required. Give a contact number or an email address (at least one) so that we can reply to you. Your details are used only to respond to this feedback.</p>'
		. '<h3>Your feedback</h3>' . $field( 'type' ) . $field( 'comments' ) . $field( 'suggest' )
		. '<h3>Patient details</h3><div class="fa-grid">' . $field( 'patient_id' ) . $field( 'patient' ) . $field( 'attendant' ) . '</div>'
		. '<h3>How can we reach you?</h3><div class="fa-grid">' . $field( 'phone' ) . $field( 'email' ) . '</div>'
		. '<p><button type="submit" class="btn btn-primary">Submit feedback</button></p>'
		. '<p class="fa-note">This form is not for appointments or emergencies. For an OPD appointment, call the Help Desk on <a href="tel:+918047104600">080-4710 4600</a>. In an emergency, come straight to the hospital.</p>'
		. '</form></div>'
		// Browser checks for the user's benefit; the server repeats every check.
		. '<script>(function(){var f=document.getElementById("pf-form");if(!f)return;var t0=Date.now();'
		. 'f.addEventListener("submit",function(e){document.getElementById("pf-t").value=Math.round((Date.now()-t0)/1000);'
		. 'var p=f.querySelector("#pf-phone"),m=f.querySelector("#pf-email"),c=f.querySelectorAll("input[name=\'pf_type[]\']:checked").length;'
		. 'p.value=p.value.replace(/[\s-]/g,"");p.setCustomValidity(!p.value&&!m.value.trim()?"Give a contact number or an email address.":(p.value&&!/^\d{10}$/.test(p.value)?"Enter 10 digits.":""));'
		. 'var b=f.querySelector("input[name=\'pf_type[]\']");b.setCustomValidity(c?"":"Choose at least one feedback type.");'
		. 'if(!f.checkValidity()){e.preventDefault();f.reportValidity();}});'
		. 'f.addEventListener("input",function(e){if(e.target.setCustomValidity)e.target.setCustomValidity("");});'
		. 'f.addEventListener("change",function(e){if(e.target.name==="pf_type[]")f.querySelector("input[name=\'pf_type[]\']").setCustomValidity("");});})();</script>';
	return $out;
}

function sssihms_pf_css() {
	return '<style>
.pf-wide{grid-column:1/-1}
.fa-field textarea{width:100%;font:inherit;font-size:16px;padding:10px 12px;border:1px solid #b9ad9a;border-radius:6px;background:#fff;color:#2a1f14;resize:vertical}
</style>';
}

/* ---------- Stored feedback: admin list, status, Excel export ---------- */

add_action( 'init', 'sssihms_pf_register' );
function sssihms_pf_register() {
	if ( ! sssihms_pf_is_target() ) {
		return;
	}
	register_post_type( 'sssihms_pf', array( 'public' => false, 'show_ui' => false, 'label' => 'Patient feedback' ) );
	if ( '1' !== get_option( 'sssihms_pf_roles' ) ) {
		add_role( 'sssihms_pws', 'Patient Welfare Services', array( 'read' => true, SSSIHMS_PF_CAP => true ) );
		foreach ( array( 'administrator', 'editor' ) as $r ) {
			$role = get_role( $r );
			if ( $role ) {
				$role->add_cap( SSSIHMS_PF_CAP );
			}
		}
		update_option( 'sssihms_pf_roles', '1' );
	}
}

function sssihms_pf_all() {
	return get_posts( array( 'post_type' => 'sssihms_pf', 'post_status' => 'private', 'numberposts' => -1, 'orderby' => 'date', 'order' => 'DESC' ) );
}

add_action( 'admin_menu', 'sssihms_pf_admin_menu' );
function sssihms_pf_admin_menu() {
	if ( sssihms_pf_is_target() ) {
		add_menu_page( 'Patient Feedback', 'Patient Feedback', SSSIHMS_PF_CAP, 'sssihms-pf', 'sssihms_pf_admin_page', 'dashicons-format-chat', 28 );
	}
}

function sssihms_pf_admin_check( $action ) {
	if ( ! sssihms_pf_is_target() || ! current_user_can( SSSIHMS_PF_CAP ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	check_admin_referer( $action );
}

function sssihms_pf_admin_page() {
	$all    = sssihms_pf_all();
	$states = sssihms_pf_statuses();
	echo '<div class="wrap"><h1>Patient Feedback</h1>';
	if ( isset( $_GET['pf_msg'] ) ) {
		echo '<div class="notice notice-success"><p>' . esc_html( sanitize_text_field( wp_unslash( $_GET['pf_msg'] ) ) ) . '</p></div>';
	}
	echo '<p>Feedback from the website form at <a href="' . esc_url( home_url( '/patient-feedback/' ) ) . '" target="_blank">/patient-feedback/</a>. Each one is also emailed to ' . esc_html( SSSIHMS_PF_TO ) . '.</p>';
	if ( $all ) {
		echo '<p><a class="button button-primary" href="' . esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=sssihms_pf_xlsx' ), 'sssihms_pf_xlsx' ) ) . '">Download Excel (.xlsx)</a></p>';
	}
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">' . wp_nonce_field( 'sssihms_pf_status', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="sssihms_pf_status">';
	echo '<table class="widefat striped"><thead><tr><th>Reference</th><th>Submitted</th><th>Type</th><th>Patient ID</th><th>Patient</th><th>Contact</th><th style="width:38%">Comments</th><th>Status</th></tr></thead><tbody>';
	foreach ( $all as $p ) {
		$r   = (array) get_post_meta( $p->ID, '_pf_rows', true );
		$st  = get_post_meta( $p->ID, '_pf_status', true ) ?: 'new';
		$sel = '<select name="status[' . $p->ID . ']">';
		foreach ( $states as $k => $label ) {
			$sel .= '<option value="' . $k . '"' . selected( $st, $k, false ) . '>' . esc_html( $label ) . '</option>';
		}
		$sel    .= '</select>';
		$contact = implode( '<br>', array_map( 'esc_html', array_filter( array( $r['Contact number (10 digits)'] ?? '', $r['Email'] ?? '' ) ) ) );
		$text    = '<strong>Comments:</strong> ' . nl2br( esc_html( $r['Comments'] ?? '' ) )
			. ( ! empty( $r['Suggestions for improvement'] ) ? '<br><strong>Suggestions:</strong> ' . nl2br( esc_html( $r['Suggestions for improvement'] ) ) : '' )
			. ( ! empty( $r['Attendant name'] ) ? '<br><strong>Attendant:</strong> ' . esc_html( $r['Attendant name'] ) : '' );
		echo '<tr><td>' . esc_html( $p->post_title ) . '</td><td>' . esc_html( $r['Submitted'] ?? '' ) . '</td><td>' . esc_html( $r['Feedback type'] ?? '' ) . '</td><td>' . esc_html( $r['Patient ID'] ?? '' ) . '</td><td>' . esc_html( $r['Patient name'] ?? '' ) . '</td><td>' . $contact . '</td><td>' . $text . '</td><td>' . $sel . '</td></tr>';
	}
	if ( ! $all ) {
		echo '<tr><td colspan="8">No feedback yet.</td></tr>';
	}
	echo '</tbody></table>';
	if ( $all ) {
		echo '<p><button class="button button-primary">Save status changes</button></p>';
	}
	echo '</form></div>';
}

add_action( 'admin_post_sssihms_pf_status', 'sssihms_pf_status' );
function sssihms_pf_status() {
	sssihms_pf_admin_check( 'sssihms_pf_status' );
	$n = 0;
	foreach ( (array) ( $_POST['status'] ?? array() ) as $id => $st ) {
		$p  = get_post( absint( $id ) );
		$st = sanitize_key( $st );
		if ( $p && 'sssihms_pf' === $p->post_type && isset( sssihms_pf_statuses()[ $st ] ) && get_post_meta( $p->ID, '_pf_status', true ) !== $st ) {
			update_post_meta( $p->ID, '_pf_status', $st );
			++$n;
		}
	}
	wp_safe_redirect( add_query_arg( 'pf_msg', rawurlencode( "$n status change(s) saved." ), admin_url( 'admin.php?page=sssihms-pf' ) ) );
	exit;
}

add_action( 'admin_post_sssihms_pf_xlsx', 'sssihms_pf_xlsx' );
function sssihms_pf_xlsx() {
	sssihms_pf_admin_check( 'sssihms_pf_xlsx' );
	$head = array( 'Reference', 'Submitted', 'Status' );
	foreach ( sssihms_pf_fields() as $f ) {
		$head[] = $f[0];
	}
	$head[] = 'Emailed to Help Desk';
	$rows   = array( $head );
	foreach ( array_reverse( sssihms_pf_all() ) as $p ) {
		$r   = (array) get_post_meta( $p->ID, '_pf_rows', true );
		$row = array();
		foreach ( array_slice( $head, 0, -1 ) as $h ) {
			$row[] = 'Status' === $h ? sssihms_pf_statuses()[ get_post_meta( $p->ID, '_pf_status', true ) ?: 'new' ] : (string) ( $r[ $h ] ?? '' );
		}
		$row[]  = get_post_meta( $p->ID, '_pf_emailed', true ) ? 'Yes' : 'No';
		$rows[] = $row;
	}
	$tmp = wp_tempnam( 'patient-feedback' );
	sssihms_fa_write_xlsx( $tmp, 'Patient feedback', $rows );
	sssihms_fa_send_download( $tmp, 'Patient-feedback_' . current_time( 'Y-m-d' ) . '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
}
