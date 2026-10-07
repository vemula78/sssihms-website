<?php
/**
 * Plugin Name: SSSIHMS Whitefield — Fellowship Application
 * Description: Online application form for the Fellowship admissions 2026–27, replacing the
 *              Google Form. Shortcode [sssihms_fellowship_application]. Blog 4 only.
 *
 * Same sections and questions as the Google Form "FELLOWSHIP APPLICATION ACADEMIC YEAR
 * 2026-27". Google Forms with file-upload questions make applicants sign in to a Google
 * account; this form does not. Each application is emailed to the Academic Section with the
 * photograph and CV attached, and the applicant gets an acknowledgement.
 *
 * Each application is also kept on the server: the details as a private post
 * (type sssihms_fa_app), and the photograph and CV in SSSIHMS_FA_STORE, which is outside the
 * web root. wp-admin → Fellowship Applications lists them, exports them as an Excel file and
 * a ZIP of the files, and, once a Google Apps Script web app is connected
 * (wordpress/apps-script/fellowship-drive.gs), copies every application to a Google Drive
 * folder and its spreadsheet.
 */

defined( 'ABSPATH' ) || exit;

const SSSIHMS_FA_TO     = 'academicblr@sssihms.org.in';
const SSSIHMS_FA_CLOSES = '2026-10-19 23:59:59'; // Last date to apply, site time (IST).
const SSSIHMS_FA_STORE  = '/srv/www/fellowship-applications'; // Photos and CVs; not web-served.

function sssihms_fa_is_target() {
	return is_multisite() && get_current_blog_id() === 4;
}

function sssihms_fa_courses() {
	return array(
		'ic'   => 'Fellowship in Interventional Cardiology',
		'ctva' => 'Fellowship in Cardio Vascular Anaesthesia',
	);
}

/** Text fields in form order: key => array( label, required, section ). */
function sssihms_fa_fields() {
	return array(
		'name'      => array( 'Name of the applicant', true, 'personal' ),
		'dob'       => array( 'Date of birth', true, 'personal' ),
		'gender'    => array( 'Gender', true, 'personal' ),
		'blood'     => array( 'Blood group', true, 'personal' ),
		'marital'   => array( 'Marital status', true, 'personal' ),
		'father'    => array( "Father's name", true, 'personal' ),
		'mother'    => array( "Mother's name", true, 'personal' ),
		'spouse'    => array( 'Spouse name', false, 'personal' ),
		'state'     => array( 'Current residential state', true, 'personal' ),
		'mobile'    => array( 'Mobile number (10 digits)', true, 'personal' ),
		'alt'       => array( 'Alternate number', false, 'personal' ),
		'nation'    => array( 'Nationality', true, 'personal' ),
		'religion'  => array( 'Religion', true, 'personal' ),
		'mbbs'      => array( 'MBBS — college name & university', true, 'edu' ),
		'mbbs_year' => array( 'MBBS — year of completion', true, 'edu' ),
		'md'        => array( 'MD/DNB — institute name and university/board', true, 'edu' ),
		'md_year'   => array( 'MD/DNB — year of completion', true, 'edu' ),
		'dm'        => array( 'DrNB/DM Cardiology — institute name and university/board', false, 'edu' ),
		'dm_year'   => array( 'DrNB/DM Cardiology — year of completion', false, 'edu' ),
		'reg'       => array( 'NMC / State Medical Council registration number', false, 'edu' ),
	);
}

/** Upload fields: key => array( label, allowed extensions, max bytes ). */
function sssihms_fa_files() {
	return array(
		'photo' => array( 'Latest photograph of the applicant', array( 'jpg', 'jpeg', 'png' ), 2 * MB_IN_BYTES ),
		'cv'    => array( 'Latest CV', array( 'pdf', 'doc', 'docx' ), 5 * MB_IN_BYTES ),
	);
}

function sssihms_fa_is_open() {
	return current_time( 'mysql' ) <= SSSIHMS_FA_CLOSES;
}

/** Validation errors from this request, and the cleaned values to re-fill the form. */
$GLOBALS['sssihms_fa_errors'] = array();
$GLOBALS['sssihms_fa_values'] = array();

add_action( 'template_redirect', 'sssihms_fa_handle' );
function sssihms_fa_handle() {
	if ( ! sssihms_fa_is_target() || 'POST' !== $_SERVER['REQUEST_METHOD'] || empty( $_POST['sssihms_fa'] ) ) {
		return;
	}
	nocache_headers();
	$errors = array();
	$v      = array();

	if ( ! sssihms_fa_is_open() ) {
		$errors[] = 'Applications closed on 19-Oct-2026.';
	}
	// Honeypot: hidden from people, filled in by most spam bots.
	if ( ! empty( $_POST['website'] ) ) {
		wp_safe_redirect( add_query_arg( 'applied', 'FA-0', get_permalink() ) );
		exit;
	}
	// At most 5 submissions per hour from one address. The key is a hash, not the IP.
	$rl_key = 'sssihms_fa_' . md5( wp_salt() . ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
	$count  = (int) get_transient( $rl_key );
	if ( $count >= 5 ) {
		$errors[] = 'Too many submissions from your connection. Please try again in an hour, or email ' . SSSIHMS_FA_TO . '.';
	}

	$email      = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
	$v['email'] = $email;
	if ( ! is_email( $email ) ) {
		$errors[] = 'Enter a valid email address.';
	}

	$courses      = array_intersect( array_keys( sssihms_fa_courses() ), (array) ( $_POST['courses'] ?? array() ) );
	$v['courses'] = $courses;
	if ( ! $courses ) {
		$errors[] = 'Select at least one course.';
	}

	// Text fields are posted as fa_<key>: a bare "name" is a WordPress query var and 404s the page.
	foreach ( sssihms_fa_fields() as $key => $f ) {
		$val = trim( sanitize_text_field( wp_unslash( $_POST[ 'fa_' . $key ] ?? '' ) ) );
		if ( 'dob' !== $key ) {
			$val = mb_strtoupper( mb_substr( $val, 0, 200 ) );
		}
		$v[ $key ] = $val;
		if ( $f[1] && '' === $val ) {
			$errors[] = $f[0] . ' is required.';
		}
	}
	$v['nation_other'] = mb_strtoupper( mb_substr( trim( sanitize_text_field( wp_unslash( $_POST['nation_other'] ?? '' ) ) ), 0, 100 ) );
	if ( 'OTHER' === $v['nation'] ) {
		if ( '' === $v['nation_other'] ) {
			$errors[] = 'Enter your nationality.';
		}
	} elseif ( '' !== $v['nation'] && 'INDIAN' !== $v['nation'] ) {
		$errors[] = 'Choose a nationality.';
	}
	if ( '' !== $v['gender'] && ! in_array( $v['gender'], array( 'MALE', 'FEMALE' ), true ) ) {
		$errors[] = 'Choose a gender.';
	}
	if ( '' !== $v['dob'] ) {
		$d = DateTime::createFromFormat( '!Y-m-d', $v['dob'] );
		if ( ! $d || $d->format( 'Y-m-d' ) !== $v['dob'] || $d->format( 'Y' ) < 1950 || $d > new DateTime( '-20 years' ) ) {
			$errors[] = 'Enter a valid date of birth.';
		}
	}
	$mobile = preg_replace( '/\D/', '', $v['mobile'] );
	if ( '' !== $v['mobile'] && ! preg_match( '/^(91)?[6-9]\d{9}$/', $mobile ) ) {
		$errors[] = 'Enter a 10-digit mobile number.';
	}
	foreach ( array( 'mbbs_year', 'md_year', 'dm_year' ) as $y ) {
		if ( '' !== $v[ $y ] && ( ! preg_match( '/^\d{4}$/', $v[ $y ] ) || $v[ $y ] < 1970 || $v[ $y ] > (int) current_time( 'Y' ) + 1 ) ) {
			$errors[] = sssihms_fa_fields()[ $y ][0] . ' should be a year such as 2024.';
		}
	}
	if ( empty( $_POST['consent'] ) ) {
		$errors[] = 'Please confirm the declaration at the end of the form.';
	}

	// Uploads: check size, extension and real content type; move to a staging folder in the
	// store. Apache runs with PrivateTmp, so a folder under /tmp could not be renamed into it.
	$tmpdir      = '';
	$attachments = array();
	foreach ( sssihms_fa_files() as $key => $f ) {
		$up = $_FILES[ $key ] ?? null;
		if ( ! $up || UPLOAD_ERR_NO_FILE === $up['error'] ) {
			$errors[] = 'Upload the ' . lcfirst( $f[0] ) . '.';
			continue;
		}
		if ( UPLOAD_ERR_OK !== $up['error'] || ! is_uploaded_file( $up['tmp_name'] ) ) {
			$errors[] = 'The ' . lcfirst( $f[0] ) . ' could not be uploaded. Please try again.';
			continue;
		}
		if ( $up['size'] > $f[2] ) {
			$errors[] = 'The ' . lcfirst( $f[0] ) . ' is larger than ' . size_format( $f[2] ) . '.';
			continue;
		}
		$check = wp_check_filetype_and_ext( $up['tmp_name'], $up['name'] );
		if ( ! $check['ext'] || ! in_array( strtolower( $check['ext'] ), $f[1], true ) ) {
			$errors[] = 'The ' . lcfirst( $f[0] ) . ' must be a ' . strtoupper( implode( '/', $f[1] ) ) . ' file.';
			continue;
		}
		if ( $errors ) {
			continue; // No point copying files for a submission that will be rejected.
		}
		if ( '' === $tmpdir ) {
			$tmpdir = SSSIHMS_FA_STORE . '/.incoming-' . wp_generate_password( 12, false );
			wp_mkdir_p( $tmpdir );
		}
		$dest = $tmpdir . '/' . sanitize_file_name( $v['name'] . '-' . $key . '.' . strtolower( $check['ext'] ) );
		if ( move_uploaded_file( $up['tmp_name'], $dest ) ) {
			$attachments[ $key ] = $dest;
		} else {
			$errors[] = 'The ' . lcfirst( $f[0] ) . ' could not be saved. Please try again.';
		}
	}

	if ( $errors ) {
		sssihms_fa_cleanup( $tmpdir );
		$GLOBALS['sssihms_fa_errors'] = $errors;
		$GLOBALS['sssihms_fa_values'] = $v;
		return;
	}

	set_transient( $rl_key, $count + 1, HOUR_IN_SECONDS );
	$ref    = 'FA26-' . current_time( 'md' ) . '-' . strtoupper( wp_generate_password( 4, false ) );
	$course = implode( ' + ', array_intersect_key( sssihms_fa_courses(), array_flip( $courses ) ) );
	$nation = 'OTHER' === $v['nation'] ? $v['nation_other'] : $v['nation'];

	$rows = array( 'Reference' => $ref, 'Email' => $email, 'Course(s) applied' => $course );
	foreach ( sssihms_fa_fields() as $key => $f ) {
		$val = $v[ $key ];
		if ( 'dob' === $key ) {
			$val = DateTime::createFromFormat( '!Y-m-d', $val )->format( 'd-M-Y' );
		} elseif ( 'nation' === $key ) {
			$val = $nation;
		}
		$rows[ $f[0] ] = $val;
	}
	$rows['Submitted'] = current_time( 'd-M-Y H:i' ) . ' IST';

	// Keep the application: rename the staging folder to the reference, then record the post.
	$post_id = 0;
	$dir     = SSSIHMS_FA_STORE . '/' . $ref;
	if ( rename( $tmpdir, $dir ) ) {
		$tmpdir = '';
		$files  = array();
		foreach ( $attachments as $key => $path ) {
			$files[ $key ] = $dir . '/' . basename( $path );
		}
		$attachments = $files;
		$post_id     = wp_insert_post(
			array(
				'post_type'   => 'sssihms_fa_app',
				'post_status' => 'private',
				'post_title'  => $ref,
				'meta_input'  => array( '_fa_rows' => $rows, '_fa_files' => $files ),
			)
		);
	}
	if ( ! $post_id ) {
		error_log( 'sssihms-fa: application ' . $ref . ' could not be stored; email only.' );
	}

	$html = '<p>New fellowship application received through whitefield.sssihms.org. The photograph and CV are attached.</p><table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
	foreach ( $rows as $label => $val ) {
		$html .= '<tr><th align="left" style="background:#f4efe6">' . esc_html( $label ) . '</th><td>' . esc_html( '' === $val ? '—' : $val ) . '</td></tr>';
	}
	$html .= '</table>';

	$sent = wp_mail(
		SSSIHMS_FA_TO,
		'Fellowship application 2026-27 — ' . $v['name'] . ' — ' . $course . ' [' . $ref . ']',
		$html,
		array( 'Content-Type: text/html; charset=UTF-8', 'Reply-To: ' . $v['name'] . ' <' . $email . '>' ),
		array_values( $attachments )
	);
	sssihms_fa_cleanup( $tmpdir );

	if ( $post_id ) {
		update_post_meta( $post_id, '_fa_emailed', $sent ? 1 : 0 );
		if ( sssihms_fa_drive_cfg() ) {
			wp_schedule_single_event( time(), 'sssihms_fa_drive_push', array( $post_id ) );
		}
	}

	// A stored application is safe even if the email failed: it is listed in wp-admin.
	if ( ! $sent && ! $post_id ) {
		$GLOBALS['sssihms_fa_errors'] = array( 'Sorry — your application could not be sent because of a problem on our side. Please try again later, or email it to ' . SSSIHMS_FA_TO . '.' );
		$GLOBALS['sssihms_fa_values'] = $v;
		return;
	}

	$ack = "Dear " . $v['name'] . ",\n\nThank you for applying to SSSIHMS, Whitefield. Your application has been received.\n\n"
		. "Reference: $ref\nCourse(s): $course\n\n"
		. "Further information about admission will be sent to this email address.\n"
		. "Entrance exam: Interventional Cardiology Thursday 22-Oct-2026; Cardio Vascular Anaesthesia Friday 23-Oct-2026. Classes begin 02-Nov-2026.\n\n"
		. "Academic Section, Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield, Bengaluru\n"
		. SSSIHMS_FA_TO . " · WhatsApp 080-28004641\n";
	wp_mail( $email, 'Your fellowship application to SSSIHMS Whitefield [' . $ref . ']', $ack, array( 'Reply-To: Academic Section <' . SSSIHMS_FA_TO . '>' ) );

	wp_safe_redirect( add_query_arg( 'applied', $ref, get_permalink() ) . '#fellowship-application' );
	exit;
}

function sssihms_fa_cleanup( $dir ) {
	if ( '' === $dir || ! is_dir( $dir ) ) {
		return;
	}
	foreach ( glob( $dir . '/*' ) as $f ) {
		wp_delete_file( $f );
	}
	rmdir( $dir );
}

add_shortcode( 'sssihms_fellowship_application', 'sssihms_fa_render' );
function sssihms_fa_render() {
	if ( ! sssihms_fa_is_target() ) {
		return '';
	}
	$out = '<div id="fellowship-application" class="fa-wrap">' . sssihms_fa_css();

	$ref = isset( $_GET['applied'] ) ? sanitize_text_field( wp_unslash( $_GET['applied'] ) ) : '';
	if ( preg_match( '/^FA26-\d{4}-[A-Z0-9]{4}$/', $ref ) || 'FA-0' === $ref ) {
		$out .= '<div class="fa-ok" role="status"><h3>Application received</h3><p>Thank you. Your application has been sent to the Academic Section.'
			. ( 'FA-0' === $ref ? '' : ' Your reference is <strong>' . esc_html( $ref ) . '</strong>.' )
			. ' An acknowledgement has been emailed to you; please check your spam folder if you do not see it.</p>'
			. '<p>Questions: <a href="mailto:' . SSSIHMS_FA_TO . '">' . SSSIHMS_FA_TO . '</a> · WhatsApp 080-28004641</p></div></div>';
		return $out;
	}
	if ( ! sssihms_fa_is_open() ) {
		return $out . '<div class="fa-ok"><h3>Applications closed</h3><p>The last date to apply for the 2026–27 fellowships was 19-Oct-2026.</p></div></div>';
	}

	$v   = $GLOBALS['sssihms_fa_values'];
	$val = function ( $k ) use ( $v ) {
		return esc_attr( $v[ $k ] ?? '' );
	};
	if ( $GLOBALS['sssihms_fa_errors'] ) {
		$out .= '<div class="fa-err" role="alert" tabindex="-1" id="fa-errors"><strong>Please correct the following and submit again. Attach the photograph and CV again too.</strong><ul>';
		foreach ( $GLOBALS['sssihms_fa_errors'] as $e ) {
			$out .= '<li>' . esc_html( $e ) . '</li>';
		}
		$out .= '</ul></div><script>document.getElementById("fa-errors").focus();</script>';
	}

	$f   = sssihms_fa_fields();
	$req = '<span class="fa-req" aria-hidden="true">*</span>';
	$txt = function ( $k, $attrs = '' ) use ( $f, $val, $req ) {
		return '<div class="fa-field"><label for="fa-' . $k . '">' . esc_html( $f[ $k ][0] ) . ( $f[ $k ][1] ? ' ' . $req : '' ) . '</label>'
			. '<input type="text" id="fa-' . $k . '" name="fa_' . $k . '" value="' . $val( $k ) . '" maxlength="200" class="fa-caps"' . ( $f[ $k ][1] ? ' required' : '' ) . ' ' . $attrs . '></div>';
	};
	$radio = function ( $k, $opts ) use ( $f, $v, $req ) {
		$h = '<fieldset class="fa-field"><legend>' . esc_html( $f[ $k ][0] ) . ' ' . $req . '</legend>';
		foreach ( $opts as $o => $label ) {
			$h .= '<label class="fa-opt"><input type="radio" name="fa_' . $k . '" value="' . $o . '"' . checked( $v[ $k ] ?? '', $o, false ) . ' required> ' . esc_html( $label ) . '</label>';
		}
		return $h;
	};

	$out .= '<form method="post" enctype="multipart/form-data" action="#fellowship-application" class="fa-form">'
		. '<input type="hidden" name="sssihms_fa" value="1">'
		. '<div class="fa-hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>'
		. '<p class="fa-note">Fields marked ' . $req . ' are required. Please enter details in CAPITAL letters. Your admission information will be sent only to the email address you give below.</p>'

		. '<h3>1. Contact email</h3>'
		. '<div class="fa-field"><label for="fa-email">Email address ' . $req . '</label><input type="email" id="fa-email" name="email" value="' . $val( 'email' ) . '" required autocomplete="email"></div>'

		. '<h3>2. Course(s) applied</h3><fieldset class="fa-field"><legend>Select the course(s) that you would like to apply for ' . $req . '</legend>';
	foreach ( sssihms_fa_courses() as $k => $label ) {
		$out .= '<label class="fa-opt"><input type="checkbox" name="courses[]" value="' . $k . '"' . ( in_array( $k, $v['courses'] ?? array(), true ) ? ' checked' : '' ) . '> ' . esc_html( $label ) . '</label>';
	}
	$out .= '</fieldset>'

		. '<h3>3. Personal details</h3>'
		. '<div class="fa-field"><label for="fa-photo">Latest photograph of the applicant ' . $req . '</label><input type="file" id="fa-photo" name="photo" accept=".jpg,.jpeg,.png" required><small>JPG or PNG, up to 2 MB.</small></div>'
		. '<div class="fa-grid">'
		. $txt( 'name', 'autocomplete="name"' )
		. '<div class="fa-field"><label for="fa-dob">' . esc_html( $f['dob'][0] ) . ' ' . $req . '</label><input type="date" id="fa-dob" name="fa_dob" value="' . $val( 'dob' ) . '" required></div>'
		. $radio( 'gender', array( 'MALE' => 'Male', 'FEMALE' => 'Female' ) ) . '</fieldset>'
		. $txt( 'blood' ) . $txt( 'marital' ) . $txt( 'father' ) . $txt( 'mother' ) . $txt( 'spouse' ) . $txt( 'state' )
		. str_replace( 'type="text"', 'type="tel"', $txt( 'mobile', 'inputmode="numeric" autocomplete="tel"' ) )
		. str_replace( 'type="text"', 'type="tel"', $txt( 'alt', 'inputmode="numeric"' ) )
		. $radio( 'nation', array( 'INDIAN' => 'Indian', 'OTHER' => 'Other:' ) )
		. '<input type="text" name="nation_other" aria-label="Other nationality" value="' . $val( 'nation_other' ) . '" maxlength="100" class="fa-caps fa-inline"></fieldset>'
		. $txt( 'religion' )
		. '</div>'

		. '<h3>4. Educational qualification</h3><div class="fa-grid">'
		. $txt( 'mbbs' ) . $txt( 'mbbs_year', 'inputmode="numeric" maxlength="4"' )
		. $txt( 'md' ) . $txt( 'md_year', 'inputmode="numeric" maxlength="4"' )
		. $txt( 'dm' ) . $txt( 'dm_year', 'inputmode="numeric" maxlength="4"' )
		. $txt( 'reg' )
		. '</div>'
		. '<div class="fa-field"><label for="fa-cv">Latest CV ' . $req . '</label><input type="file" id="fa-cv" name="cv" accept=".pdf,.doc,.docx" required><small>PDF or Word, up to 5 MB.</small></div>'

		. '<label class="fa-opt fa-consent"><input type="checkbox" name="consent" value="1" required> I declare that the information given is true, and I agree to SSSIHMS using it to process my fellowship application. ' . $req . '</label>'
		. '<p><button type="submit" class="btn btn-primary">Submit application</button></p>'
		. '<p class="fa-note">Trouble with the form? Email your details, photograph and CV to <a href="mailto:' . SSSIHMS_FA_TO . '">' . SSSIHMS_FA_TO . '</a>.</p>'
		. '</form></div>';
	return $out;
}

function sssihms_fa_css() {
	return '<style>
.fa-wrap{max-width:860px}
.fa-form h3{font-family:var(--f-head);color:var(--pd);font-size:22px;margin:30px 0 14px;padding-top:14px;border-top:1px solid var(--border)}
.fa-form h3:first-of-type{border-top:0;padding-top:0}
.fa-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:4px 22px}
.fa-field{margin:0 0 16px;border:0;min-width:0}
.fa-field label,.fa-field legend{display:block;font-weight:600;font-size:15px;color:var(--pd);margin-bottom:6px}
.fa-field input[type=text],.fa-field input[type=email],.fa-field input[type=tel],.fa-field input[type=date]{width:100%;font:inherit;font-size:16px;padding:10px 12px;border:1px solid #b9ad9a;border-radius:6px;background:#fff;color:#2a1f14}
.fa-field input:focus,.fa-opt input:focus{outline:2px solid var(--primary);outline-offset:1px}
.fa-field input[type=file]{font-size:15px;max-width:100%}
.fa-field small{display:block;color:var(--tm);font-size:14px;margin-top:4px}
.fa-caps{text-transform:uppercase}
.fa-opt{display:flex;gap:10px;align-items:center;font-size:16px;margin:6px 0;color:#2a1f14;font-weight:400}
.fa-opt input{width:18px;height:18px;flex:none}
.fa-inline{width:auto!important;flex:1;margin-left:6px;padding:6px 10px!important}
.fa-consent{align-items:flex-start;margin:22px 0 10px}
.fa-consent input{margin-top:3px}
.fa-req{color:#b3261e}
.fa-note{font-size:15px;color:var(--tm);margin:10px 0}
.fa-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.fa-err{border:1px solid #b3261e;background:#fdecea;color:#5f1410;border-radius:6px;padding:14px 18px;margin:0 0 22px}
.fa-err ul{margin:8px 0 0 20px}
.fa-ok{border:1px solid #2e7d32;background:#edf7ee;border-radius:6px;padding:18px 22px}
.fa-ok h3{font-family:var(--f-head);color:#1b5e20;font-size:22px;margin-bottom:8px}
.fa-ok p{margin:6px 0}
</style>';
}

/* ---------- Stored applications: admin list, Excel and ZIP export, Google Drive copy ---------- */

add_action( 'init', 'sssihms_fa_register' );
function sssihms_fa_register() {
	if ( sssihms_fa_is_target() ) {
		register_post_type( 'sssihms_fa_app', array( 'public' => false, 'show_ui' => false, 'label' => 'Fellowship applications' ) );
	}
}

/** Who may see applications: editors and administrators. Connecting Drive needs manage_options. */
const SSSIHMS_FA_CAP = 'edit_others_pages';

function sssihms_fa_apps() {
	return get_posts( array( 'post_type' => 'sssihms_fa_app', 'post_status' => 'private', 'numberposts' => -1, 'orderby' => 'date', 'order' => 'ASC' ) );
}

/** Drive settings, or null if not connected: array( url, secret ). */
function sssihms_fa_drive_cfg() {
	$c = get_option( 'sssihms_fa_drive' );
	return ! empty( $c['url'] ) && ! empty( $c['secret'] ) ? $c : null;
}

add_action( 'sssihms_fa_drive_push', 'sssihms_fa_drive_push' );
function sssihms_fa_drive_push( $post_id ) {
	$cfg = sssihms_fa_drive_cfg();
	$app = get_post( $post_id );
	if ( ! $cfg || ! $app || 'sssihms_fa_app' !== $app->post_type || get_post_meta( $post_id, '_fa_drive', true ) ) {
		return;
	}
	$files = array();
	foreach ( (array) get_post_meta( $post_id, '_fa_files', true ) as $path ) {
		if ( is_readable( $path ) ) {
			$files[] = array( 'name' => basename( $path ), 'mime' => wp_check_filetype( $path )['type'], 'data' => base64_encode( file_get_contents( $path ) ) );
		}
	}
	$r = wp_remote_post(
		$cfg['url'],
		array(
			'timeout' => 60,
			'headers' => array( 'Content-Type' => 'application/json' ),
			'body'    => wp_json_encode( array( 'secret' => $cfg['secret'], 'ref' => $app->post_title, 'row' => get_post_meta( $post_id, '_fa_rows', true ), 'files' => $files ) ),
		)
	);
	$j = is_wp_error( $r ) ? null : json_decode( wp_remote_retrieve_body( $r ), true );
	if ( ! empty( $j['ok'] ) && ! empty( $j['folder'] ) ) {
		update_post_meta( $post_id, '_fa_drive', esc_url_raw( $j['folder'] ) );
		delete_post_meta( $post_id, '_fa_drive_error' );
	} else {
		$err = is_wp_error( $r ) ? $r->get_error_message() : ( $j['error'] ?? 'HTTP ' . wp_remote_retrieve_response_code( $r ) . ' — unexpected reply' );
		update_post_meta( $post_id, '_fa_drive_error', mb_substr( wp_strip_all_tags( $err ), 0, 200 ) );
	}
}

add_action( 'admin_menu', 'sssihms_fa_admin_menu' );
function sssihms_fa_admin_menu() {
	if ( sssihms_fa_is_target() ) {
		add_menu_page( 'Fellowship Applications', 'Fellowship Applications', SSSIHMS_FA_CAP, 'sssihms-fa', 'sssihms_fa_admin_page', 'dashicons-welcome-learn-more', 26 );
	}
}

function sssihms_fa_admin_url( $action, $args = array() ) {
	return wp_nonce_url( add_query_arg( array_merge( array( 'action' => $action ), $args ), admin_url( 'admin-post.php' ) ), $action );
}

function sssihms_fa_admin_page() {
	$apps  = sssihms_fa_apps();
	$cfg   = sssihms_fa_drive_cfg();
	$names = array( 'photo' => 'Photo', 'cv' => 'CV' );
	echo '<div class="wrap"><h1>Fellowship Applications 2026–27</h1>';
	if ( isset( $_GET['fa_msg'] ) ) {
		echo '<div class="notice notice-success"><p>' . esc_html( sanitize_text_field( wp_unslash( $_GET['fa_msg'] ) ) ) . '</p></div>';
	}
	echo '<p>' . count( $apps ) . ' application(s) received through the website form. Applications sent before 07-Oct-2026 were emailed only and are not listed here.</p>';
	if ( $apps ) {
		echo '<p><a class="button button-primary" href="' . esc_url( sssihms_fa_admin_url( 'sssihms_fa_xlsx' ) ) . '">Download Excel (.xlsx)</a> '
			. '<a class="button" href="' . esc_url( sssihms_fa_admin_url( 'sssihms_fa_zip' ) ) . '">Download all photos &amp; CVs (.zip)</a></p>';
	}
	echo '<table class="widefat striped"><thead><tr><th>Reference</th><th>Submitted</th><th>Name</th><th>Course(s)</th><th>Mobile</th><th>Email</th><th>Files</th><th>Google Drive</th></tr></thead><tbody>';
	foreach ( array_reverse( $apps ) as $app ) {
		$r     = (array) get_post_meta( $app->ID, '_fa_rows', true );
		$links = array();
		foreach ( (array) get_post_meta( $app->ID, '_fa_files', true ) as $key => $path ) {
			$links[] = '<a href="' . esc_url( sssihms_fa_admin_url( 'sssihms_fa_file', array( 'id' => $app->ID, 'key' => $key ) ) ) . '">' . esc_html( $names[ $key ] ?? $key ) . '</a>';
		}
		$drive = get_post_meta( $app->ID, '_fa_drive', true );
		$derr  = get_post_meta( $app->ID, '_fa_drive_error', true );
		$dcell = $drive ? '<a href="' . esc_url( $drive ) . '" target="_blank" rel="noopener">Open folder</a>' : ( $derr ? 'Failed: ' . esc_html( $derr ) : ( $cfg ? 'Pending' : '—' ) );
		echo '<tr><td>' . esc_html( $app->post_title ) . '</td><td>' . esc_html( $r['Submitted'] ?? '' ) . '</td><td>' . esc_html( $r['Name of the applicant'] ?? '' ) . '</td><td>' . esc_html( $r['Course(s) applied'] ?? '' ) . '</td><td>' . esc_html( $r['Mobile number (10 digits)'] ?? '' ) . '</td><td>' . esc_html( $r['Email'] ?? '' ) . '</td><td>' . implode( ' · ', $links ) . '</td><td>' . $dcell . '</td></tr>';
	}
	if ( ! $apps ) {
		echo '<tr><td colspan="8">No applications yet.</td></tr>';
	}
	echo '</tbody></table>';

	echo '<h2 style="margin-top:32px">Google Drive</h2>';
	if ( $cfg ) {
		echo '<p>Connected. Each new application is copied to the Drive folder and added to its spreadsheet a minute or so after it arrives.</p>';
		echo '<p><a class="button" href="' . esc_url( sssihms_fa_admin_url( 'sssihms_fa_drive_all' ) ) . '">Copy pending and failed applications to Drive now</a></p>';
	} else {
		echo '<p>Not connected. Applications are kept here and emailed, but not copied to Drive.</p>';
	}
	if ( current_user_can( 'manage_options' ) ) {
		$opt = get_option( 'sssihms_fa_drive', array() );
		if ( empty( $opt['secret'] ) ) {
			$opt['secret'] = wp_generate_password( 32, false );
			update_option( 'sssihms_fa_drive', $opt, false );
		}
		echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">' . wp_nonce_field( 'sssihms_fa_drive_save', '_wpnonce', true, false )
			. '<input type="hidden" name="action" value="sssihms_fa_drive_save">'
			. '<p><label>Secret to paste into the Apps Script (SECRET):<br><input type="text" readonly class="regular-text code" value="' . esc_attr( $opt['secret'] ) . '" onclick="this.select()"></label></p>'
			. '<p><label>Apps Script web app URL (ends in /exec):<br><input type="url" name="url" class="large-text code" value="' . esc_attr( $opt['url'] ?? '' ) . '" placeholder="https://script.google.com/macros/s/…/exec"></label></p>'
			. '<p><button class="button button-primary">Save</button> Leave the URL empty and save to disconnect.</p></form>';
	}
	echo '</div>';
}

function sssihms_fa_admin_check( $action, $cap = SSSIHMS_FA_CAP ) {
	if ( ! sssihms_fa_is_target() || ! current_user_can( $cap ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	check_admin_referer( $action );
}

add_action( 'admin_post_sssihms_fa_drive_save', 'sssihms_fa_drive_save' );
function sssihms_fa_drive_save() {
	sssihms_fa_admin_check( 'sssihms_fa_drive_save', 'manage_options' );
	$opt        = get_option( 'sssihms_fa_drive', array() );
	$url        = esc_url_raw( trim( wp_unslash( $_POST['url'] ?? '' ) ) );
	$opt['url'] = preg_match( '#^https://script\.google\.com/macros/s/[\w-]+/exec$#', $url ) ? $url : '';
	update_option( 'sssihms_fa_drive', $opt, false );
	$msg = $opt['url'] ? 'Google Drive connected.' : ( '' === $url ? 'Google Drive disconnected.' : 'That is not an Apps Script web app URL (https://script.google.com/macros/s/…/exec). Not saved.' );
	wp_safe_redirect( add_query_arg( 'fa_msg', rawurlencode( $msg ), admin_url( 'admin.php?page=sssihms-fa' ) ) );
	exit;
}

add_action( 'admin_post_sssihms_fa_drive_all', 'sssihms_fa_drive_all' );
function sssihms_fa_drive_all() {
	sssihms_fa_admin_check( 'sssihms_fa_drive_all' );
	$done = 0;
	$todo = 0;
	foreach ( sssihms_fa_apps() as $app ) {
		if ( get_post_meta( $app->ID, '_fa_drive', true ) ) {
			continue;
		}
		++$todo;
		sssihms_fa_drive_push( $app->ID );
		$done += get_post_meta( $app->ID, '_fa_drive', true ) ? 1 : 0;
	}
	wp_safe_redirect( add_query_arg( 'fa_msg', rawurlencode( "Copied $done of $todo application(s) to Drive." ), admin_url( 'admin.php?page=sssihms-fa' ) ) );
	exit;
}

/** A stored file's path, only if it is inside the store. */
function sssihms_fa_safe_path( $path ) {
	$real = realpath( $path );
	return $real && 0 === strpos( $real, SSSIHMS_FA_STORE . '/' ) && is_file( $real ) ? $real : '';
}

add_action( 'admin_post_sssihms_fa_file', 'sssihms_fa_file' );
function sssihms_fa_file() {
	sssihms_fa_admin_check( 'sssihms_fa_file' );
	$app   = get_post( absint( $_GET['id'] ?? 0 ) );
	$files = $app && 'sssihms_fa_app' === $app->post_type ? (array) get_post_meta( $app->ID, '_fa_files', true ) : array();
	$path  = sssihms_fa_safe_path( $files[ sanitize_key( $_GET['key'] ?? '' ) ] ?? '' );
	if ( ! $path ) {
		wp_die( 'File not found.', 404 );
	}
	nocache_headers();
	header( 'Content-Type: ' . ( wp_check_filetype( $path )['type'] ?: 'application/octet-stream' ) );
	header( 'Content-Disposition: attachment; filename="' . basename( $path ) . '"' );
	header( 'Content-Length: ' . filesize( $path ) );
	readfile( $path );
	exit;
}

add_action( 'admin_post_sssihms_fa_zip', 'sssihms_fa_zip' );
function sssihms_fa_zip() {
	sssihms_fa_admin_check( 'sssihms_fa_zip' );
	$tmp = wp_tempnam( 'fellowship-files' );
	$zip = new ZipArchive();
	$zip->open( $tmp, ZipArchive::OVERWRITE );
	foreach ( sssihms_fa_apps() as $app ) {
		$r      = (array) get_post_meta( $app->ID, '_fa_rows', true );
		$folder = sanitize_file_name( $app->post_title . ' ' . ( $r['Name of the applicant'] ?? '' ) );
		foreach ( (array) get_post_meta( $app->ID, '_fa_files', true ) as $path ) {
			$path = sssihms_fa_safe_path( $path );
			if ( $path ) {
				$zip->addFile( $path, $folder . '/' . basename( $path ) );
			}
		}
	}
	$zip->addFromString( 'README.txt', 'Fellowship applications 2026-27, photos and CVs, downloaded ' . current_time( 'd-M-Y H:i' ) . " IST.\r\nOne folder per application: reference and applicant name.\r\n" );
	$zip->close();
	sssihms_fa_send_download( $tmp, 'Fellowship-applications-files_' . current_time( 'Y-m-d' ) . '.zip', 'application/zip' );
}

add_action( 'admin_post_sssihms_fa_xlsx', 'sssihms_fa_xlsx' );
function sssihms_fa_xlsx() {
	sssihms_fa_admin_check( 'sssihms_fa_xlsx' );
	$head = array( 'Reference', 'Submitted', 'Email', 'Course(s) applied' );
	foreach ( sssihms_fa_fields() as $f ) {
		$head[] = $f[0];
	}
	array_push( $head, 'Photo file', 'CV file', 'Emailed to Academic Section', 'Google Drive folder' );
	$rows = array( $head );
	foreach ( sssihms_fa_apps() as $app ) {
		$r     = (array) get_post_meta( $app->ID, '_fa_rows', true );
		$files = (array) get_post_meta( $app->ID, '_fa_files', true );
		$row   = array();
		foreach ( array_slice( $head, 0, -4 ) as $h ) {
			$row[] = (string) ( $r[ $h ] ?? '' );
		}
		$row[]  = isset( $files['photo'] ) ? basename( $files['photo'] ) : '';
		$row[]  = isset( $files['cv'] ) ? basename( $files['cv'] ) : '';
		$row[]  = get_post_meta( $app->ID, '_fa_emailed', true ) ? 'Yes' : 'No';
		$row[]  = (string) get_post_meta( $app->ID, '_fa_drive', true );
		$rows[] = $row;
	}
	$tmp = wp_tempnam( 'fellowship-xlsx' );
	sssihms_fa_write_xlsx( $tmp, 'Applications', $rows );
	sssihms_fa_send_download( $tmp, 'Fellowship-applications_' . current_time( 'Y-m-d' ) . '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
}

function sssihms_fa_send_download( $tmp, $filename, $type ) {
	nocache_headers();
	header( 'Content-Type: ' . $type );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	header( 'Content-Length: ' . filesize( $tmp ) );
	readfile( $tmp );
	wp_delete_file( $tmp );
	exit;
}

/**
 * Minimal .xlsx: one sheet of text cells, bold frozen header row, autofilter. Every value is
 * an inline string, so nothing an applicant types can become a formula.
 */
function sssihms_fa_write_xlsx( $file, $sheet, $rows ) {
	$col = function ( $i ) {
		$s = '';
		for ( ++$i; $i > 0; $i = intdiv( $i - 1, 26 ) ) {
			$s = chr( 65 + ( $i - 1 ) % 26 ) . $s;
		}
		return $s;
	};
	$esc = function ( $t ) {
		return htmlspecialchars( preg_replace( '/[^\x{9}\x{A}\x{D}\x{20}-\x{D7FF}\x{E000}-\x{FFFD}]/u', '', $t ), ENT_XML1 | ENT_QUOTES, 'UTF-8' );
	};
	$ncol  = count( $rows[0] );
	$width = array_fill( 0, $ncol, 10 );
	$data  = '';
	foreach ( $rows as $ri => $row ) {
		$data .= '<row r="' . ( $ri + 1 ) . '">';
		foreach ( array_values( $row ) as $ci => $val ) {
			$width[ $ci ] = min( 60, max( $width[ $ci ], mb_strlen( $val ) + 2 ) );
			$data        .= '<c r="' . $col( $ci ) . ( $ri + 1 ) . '" t="inlineStr"' . ( 0 === $ri ? ' s="1"' : '' ) . '><is><t xml:space="preserve">' . $esc( $val ) . '</t></is></c>';
		}
		$data .= '</row>';
	}
	$cols = '';
	foreach ( $width as $ci => $w ) {
		$cols .= '<col min="' . ( $ci + 1 ) . '" max="' . ( $ci + 1 ) . '" width="' . $w . '" customWidth="1"/>';
	}
	$last = $col( $ncol - 1 ) . count( $rows );
	$ns   = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
	$zip  = new ZipArchive();
	$zip->open( $file, ZipArchive::OVERWRITE );
	$zip->addFromString( '[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' );
	$zip->addFromString( '_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' );
	$zip->addFromString( 'xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' );
	$zip->addFromString( 'xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook ' . $ns . '><sheets><sheet name="' . $esc( $sheet ) . '" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">\'' . $esc( $sheet ) . '\'!$A$1:$' . preg_replace( '/\d+$/', '', $last ) . '$' . count( $rows ) . '</definedName></definedNames></workbook>' );
	$zip->addFromString( 'xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF4EFE6"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>' );
	$zip->addFromString( 'xl/worksheets/sheet1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet ' . $ns . '><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>' . $cols . '</cols><sheetData>' . $data . '</sheetData><autoFilter ref="A1:' . $last . '"/></worksheet>' );
	$zip->close();
}
