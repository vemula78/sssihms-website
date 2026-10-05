<?php
/**
 * Plugin Name: SSSIHMS Whitefield — Fellowship Application
 * Description: Online application form for the Fellowship admissions 2026–27, replacing the
 *              Google Form. Shortcode [sssihms_fellowship_application]. Blog 4 only.
 *
 * Same sections and questions as the Google Form "FELLOWSHIP APPLICATION ACADEMIC YEAR
 * 2026-27". Google Forms with file-upload questions make applicants sign in to a Google
 * account; this form does not. Each application is emailed to the Academic Section with the
 * photograph and CV attached, and the applicant gets an acknowledgement. Nothing is stored
 * on the server: the uploaded files are deleted as soon as the email has been handed over.
 */

defined( 'ABSPATH' ) || exit;

const SSSIHMS_FA_TO     = 'academicblr@sssihms.org.in';
const SSSIHMS_FA_CLOSES = '2026-10-19 23:59:59'; // Last date to apply, site time (IST).

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

	// Uploads: check size, extension and real content type; copy to a private temp folder.
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
			$tmpdir = trailingslashit( get_temp_dir() ) . 'sssihms-fa-' . wp_generate_password( 12, false );
			wp_mkdir_p( $tmpdir );
		}
		$dest = $tmpdir . '/' . sanitize_file_name( $v['name'] . '-' . $key . '.' . strtolower( $check['ext'] ) );
		if ( move_uploaded_file( $up['tmp_name'], $dest ) ) {
			$attachments[] = $dest;
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
		$rows[ $f[0] ] = '' === $val ? '—' : $val;
	}
	$rows['Submitted'] = current_time( 'd-M-Y H:i' ) . ' IST';

	$html = '<p>New fellowship application received through whitefield.sssihms.org. The photograph and CV are attached.</p><table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
	foreach ( $rows as $label => $val ) {
		$html .= '<tr><th align="left" style="background:#f4efe6">' . esc_html( $label ) . '</th><td>' . esc_html( $val ) . '</td></tr>';
	}
	$html .= '</table>';

	$sent = wp_mail(
		SSSIHMS_FA_TO,
		'Fellowship application 2026-27 — ' . $v['name'] . ' — ' . $course . ' [' . $ref . ']',
		$html,
		array( 'Content-Type: text/html; charset=UTF-8', 'Reply-To: ' . $v['name'] . ' <' . $email . '>' ),
		$attachments
	);
	sssihms_fa_cleanup( $tmpdir );

	if ( ! $sent ) {
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
