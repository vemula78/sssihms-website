<?php
/**
 * Plugin Name: SSSIHMS Whitefield — Job Application
 * Description: Year-round online job application form for Career Opportunities.
 *              Shortcode [sssihms_job_application]. Blog 4 only.
 *
 * One form for four categories (Nursing, Doctors, Technicians & Allied Health,
 * Administrative & Support): common questions plus a short section for the chosen category.
 * Each application is emailed to Human Resources with the CV, certificates and photograph
 * attached, and the applicant gets an acknowledgement. It is also kept on the server (private
 * post type sssihms_ja_app; files in SSSIHMS_JA_STORE, outside the web root), listed in
 * wp-admin → Job Applications with status, Excel (one sheet per category) and ZIP export,
 * and copied to Google Drive through the same Apps Script web app as the fellowship form.
 *
 * Retention: applications not marked "Selected" are deleted from the server six months after
 * they were received (daily WP-Cron job). The Google Drive copies are kept (Praveen's
 * instruction, 08-Oct-2026); Human Resources manages them in Drive.
 *
 * Vacancies: wp-admin → Job Applications → Vacancies lets HR add, edit and close vacancies with
 * an optional flyer (JPG/PNG/PDF). Open vacancies are listed on the Careers page by the
 * shortcode [sssihms_vacancies]; each links to the form with the category filled in and the vacancy recorded.
 * A vacancy disappears after its last date. The "HR Recruitment" role sees only these screens.
 *
 * Uses sssihms_fa_css(), sssihms_fa_drive_cfg() and sssihms_fa_send_download() from
 * sssihms-wfd-fellowship-application.php.
 */

defined( 'ABSPATH' ) || exit;

const SSSIHMS_JA_TO     = 'humanresourcesblr@sssihms.org.in';
const SSSIHMS_JA_STORE  = '/srv/www/job-applications'; // CVs, certificates, photos; not web-served.
const SSSIHMS_JA_KEEP   = '-6 months';                 // Retention for applications not selected.
const SSSIHMS_JA_CAP    = 'sssihms_hr'; // Administrators, editors and the "HR Recruitment" role.

function sssihms_ja_is_target() {
	return is_multisite() && get_current_blog_id() === 4;
}

function sssihms_ja_categories() {
	return array(
		'nursing' => 'Nursing',
		'doctor'  => 'Doctors',
		'tech'    => 'Technicians & Allied Health',
		'admin'   => 'Administrative & Support',
	);
}

/**
 * Questions in form order: key => array( label, type, required, category or '', options ).
 * Types: text, textarea, date, month, email, tel, number, radio, select, checks.
 * Required is ignored for a category the applicant did not choose.
 */
function sssihms_ja_fields() {
	$yn = array( 'Yes', 'No' );
	return array(
		'name'         => array( 'Full name (as per Aadhaar)', 'text', true, '', null ),
		'dob'          => array( 'Date of birth', 'date', true, '', null ),
		'gender'       => array( 'Gender', 'radio', false, '', array( 'Male', 'Female' ) ),
		'mobile'       => array( 'Mobile number (10 digits)', 'tel', true, '', null ),
		'alt'          => array( 'Alternate number', 'tel', false, '', null ),
		'city'         => array( 'Current city', 'text', true, '', null ),
		'state'        => array( 'State', 'text', true, '', null ),
		'languages'    => array( 'Languages you speak', 'checks', true, '', array( 'Kannada', 'English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam', 'Other' ) ),

		'qual'         => array( 'Highest qualification', 'text', true, '', null ),
		'inst'         => array( 'Institution and university / board', 'text', true, '', null ),
		'qual_year'    => array( 'Year passed', 'number', true, '', null ),
		'other_qual'   => array( 'Other qualifications and certifications', 'textarea', false, '', null ),
		// Required for doctors and nurses only (checked in the handler and the form script).
		'reg'          => array( 'Council registration number (doctors and nurses)', 'text', false, '', null ),
		'reg_council'  => array( 'Registered with (e.g. NMC, Karnataka Medical Council, INC, Karnataka State Nursing Council)', 'text', false, '', null ),

		'n_qual'       => array( 'Nursing qualification', 'select', true, 'nursing', array( 'ANM', 'GNM', 'B.Sc Nursing', 'Post Basic B.Sc Nursing', 'M.Sc Nursing' ) ),
		'n_areas'      => array( 'Areas you have worked in', 'checks', false, 'nursing', array( 'ICU', 'CTVS ICU', 'Cardiac OT', 'Cath lab', 'Neuro ICU', 'Ward', 'Dialysis', 'NICU / PICU', 'Other' ) ),
		'n_bls'        => array( 'BLS / ACLS certificate valid until', 'month', false, 'nursing', null ),

		'd_degree'     => array( 'Degrees and specialty (e.g. MBBS, MD Anaesthesia, DM Cardiology)', 'text', true, 'doctor', null ),
		'd_post'       => array( 'Post sought', 'select', true, 'doctor', array( 'Resident', 'Registrar', 'Consultant', 'Fellow', 'Other' ) ),
		'd_expertise'  => array( 'Procedures and areas of expertise', 'textarea', false, 'doctor', null ),
		'd_pubs'       => array( 'Publications', 'textarea', false, 'doctor', null ),

		't_field'      => array( 'Field', 'select', true, 'tech', array( 'Cath lab', 'Perfusion', 'Operation theatre', 'Anaesthesia', 'Radiology / imaging', 'Laboratory', 'Respiratory therapy', 'Dialysis', 'Biomedical engineering', 'Pharmacy', 'Physiotherapy', 'Other' ) ),
		't_course'     => array( 'Course and duration', 'text', true, 'tech', null ),
		't_equipment'  => array( 'Equipment and systems you have used', 'textarea', false, 'tech', null ),

		'a_function'   => array( 'Area of work', 'select', true, 'admin', array( 'Accounts', 'Human resources', 'Front office', 'IT', 'Stores and purchase', 'Housekeeping', 'Security', 'Other' ) ),
		'a_skills'     => array( 'Computer skills', 'checks', false, 'admin', array( 'MS Office', 'Tally', 'Hospital information system', 'Other' ) ),
		'a_typing'     => array( 'Typing speed (words per minute)', 'number', false, 'admin', null ),

		'exp_years'    => array( 'Total experience (years; 0 if none)', 'number', true, '', null ),
		'employer'     => array( 'Current or last employer', 'text', false, '', null ),
		'designation'  => array( 'Designation', 'text', false, '', null ),
		'exp_from'     => array( 'Working there from', 'month', false, '', null ),
		'exp_to'       => array( 'Until (leave empty if still working there)', 'month', false, '', null ),
		'leaving'      => array( 'Reason for leaving', 'text', false, '', null ),
		'salary'       => array( 'Current monthly salary in ₹ (0 if not working)', 'number', true, '', null ),
		'notice'       => array( 'Notice period', 'text', false, '', null ),
	);
}

/** Upload fields: key => array( label, allowed extensions, max bytes, required ). */
function sssihms_ja_files() {
	return array(
		'cv'    => array( 'CV', array( 'pdf', 'doc', 'docx' ), 5 * MB_IN_BYTES, true ),
		'certs' => array( 'Certificates, combined into one PDF', array( 'pdf' ), 8 * MB_IN_BYTES, false ),
		'photo' => array( 'Photograph', array( 'jpg', 'jpeg', 'png' ), 2 * MB_IN_BYTES, false ),
	);
}

$GLOBALS['sssihms_ja_errors'] = array();
$GLOBALS['sssihms_ja_values'] = array();

add_action( 'template_redirect', 'sssihms_ja_handle' );
function sssihms_ja_handle() {
	if ( ! sssihms_ja_is_target() || 'POST' !== $_SERVER['REQUEST_METHOD'] || empty( $_POST['sssihms_ja'] ) ) {
		return;
	}
	nocache_headers();
	$errors = array();
	$v      = array();

	if ( ! empty( $_POST['website'] ) ) { // Honeypot.
		wp_safe_redirect( add_query_arg( 'applied', 'HR-0', get_permalink() ) );
		exit;
	}
	$rl_key = 'sssihms_ja_' . md5( wp_salt() . ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
	$count  = (int) get_transient( $rl_key );
	if ( $count >= 5 ) {
		$errors[] = 'Too many submissions from your connection. Please try again in an hour, or email ' . SSSIHMS_JA_TO . '.';
	}

	$email      = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
	$v['email'] = $email;
	if ( ! is_email( $email ) ) {
		$errors[] = 'Enter a valid email address.';
	}
	$cat      = sanitize_key( $_POST['category'] ?? '' );
	$v['cat'] = $cat;
	if ( ! isset( sssihms_ja_categories()[ $cat ] ) ) {
		$errors[] = 'Choose the category you are applying in.';
	}

	// Fields are posted as ja_<key>: a bare "name" is a WordPress query var and 404s the page.
	foreach ( sssihms_ja_fields() as $key => $f ) {
		list( $label, $type, $req, $fcat, $opts ) = $f;
		if ( '' !== $fcat && $fcat !== $cat ) {
			$v[ $key ] = '';
			continue;
		}
		$raw = wp_unslash( $_POST[ 'ja_' . $key ] ?? '' );
		if ( 'checks' === $type ) {
			$val = implode( ', ', array_values( array_intersect( $opts, array_map( 'sanitize_text_field', (array) $raw ) ) ) );
		} elseif ( 'textarea' === $type ) {
			$val = mb_substr( trim( sanitize_textarea_field( $raw ) ), 0, 1500 );
		} else {
			$val = mb_substr( trim( sanitize_text_field( $raw ) ), 0, 200 );
		}
		if ( in_array( $type, array( 'radio', 'select' ), true ) && '' !== $val && ! in_array( $val, $opts, true ) ) {
			$errors[] = $label . ': choose one of the options.';
			$val      = '';
		}
		$v[ $key ] = $val;
		if ( $req && '' === $val ) {
			$errors[] = ( 'checks' === $type || 'radio' === $type || 'select' === $type ? 'Answer: ' : '' ) . $label . ( 'checks' === $type || 'radio' === $type || 'select' === $type ? '' : ' is required.' );
		}
	}
	if ( '' !== $v['dob'] ) {
		$d = DateTime::createFromFormat( '!Y-m-d', $v['dob'] );
		if ( ! $d || $d->format( 'Y-m-d' ) !== $v['dob'] || $d->format( 'Y' ) < 1940 || $d > new DateTime( '-17 years' ) ) {
			$errors[] = 'Enter a valid date of birth.';
		}
	}
	foreach ( array( 'n_bls', 'exp_from', 'exp_to' ) as $m ) {
		if ( '' !== $v[ $m ] && ! preg_match( '/^(19|20)\d\d-(0[1-9]|1[0-2])$/', $v[ $m ] ) ) {
			$errors[] = sssihms_ja_fields()[ $m ][0] . ': enter a month and year.';
		}
	}
	if ( '' !== $v['mobile'] && ! preg_match( '/^(91)?[6-9]\d{9}$/', preg_replace( '/\D/', '', $v['mobile'] ) ) ) {
		$errors[] = 'Enter a 10-digit mobile number.';
	}
	if ( '' !== $v['qual_year'] && ( ! preg_match( '/^\d{4}$/', $v['qual_year'] ) || $v['qual_year'] < 1960 || $v['qual_year'] > (int) current_time( 'Y' ) + 1 ) ) {
		$errors[] = 'Year passed should be a year such as 2020.';
	}
	foreach ( array( 'exp_years' => 60, 'salary' => 10000000, 'a_typing' => 200 ) as $n => $max ) {
		if ( '' !== $v[ $n ] && ( ! is_numeric( $v[ $n ] ) || $v[ $n ] < 0 || $v[ $n ] > $max ) ) {
			$errors[] = sssihms_ja_fields()[ $n ][0] . ': enter a number.';
		}
	}
	if ( in_array( $cat, array( 'nursing', 'doctor' ), true ) ) {
		foreach ( array( 'reg', 'reg_council' ) as $k ) {
			if ( '' === $v[ $k ] ) {
				$errors[] = ( 'reg' === $k ? 'Council registration number' : 'Registered with (council)' ) . ' is required for doctors and nurses.';
			}
		}
	}
	// Applying from a vacancy on the Careers page: keep which one.
	$vac        = sssihms_ja_vac_get( absint( $_POST['ja_vacancy'] ?? 0 ) );
	$v['vacancy'] = $vac ? $vac['id'] : 0;
	if ( empty( $_POST['consent'] ) ) {
		$errors[] = 'Please confirm the declaration at the end of the form.';
	}

	// Uploads: check size, extension and real content type; stage inside the store (Apache
	// runs with PrivateTmp, so a /tmp folder could not be renamed into it).
	$tmpdir = '';
	$files  = array();
	foreach ( sssihms_ja_files() as $key => $f ) {
		$up = $_FILES[ $key ] ?? null;
		if ( ! $up || UPLOAD_ERR_NO_FILE === $up['error'] ) {
			if ( $f[3] ) {
				$errors[] = 'Upload your ' . $f[0] . '.';
			}
			continue;
		}
		if ( UPLOAD_ERR_OK !== $up['error'] || ! is_uploaded_file( $up['tmp_name'] ) ) {
			$errors[] = 'The ' . lcfirst( $f[0] ) . ' file could not be uploaded. Please try again.';
			continue;
		}
		if ( $up['size'] > $f[2] ) {
			$errors[] = 'The ' . lcfirst( $f[0] ) . ' file is larger than ' . size_format( $f[2] ) . '.';
			continue;
		}
		$check = wp_check_filetype_and_ext( $up['tmp_name'], $up['name'] );
		if ( ! $check['ext'] || ! in_array( strtolower( $check['ext'] ), $f[1], true ) ) {
			$errors[] = 'The ' . lcfirst( $f[0] ) . ' must be a ' . strtoupper( implode( '/', $f[1] ) ) . ' file.';
			continue;
		}
		if ( $errors ) {
			continue;
		}
		if ( '' === $tmpdir ) {
			$tmpdir = SSSIHMS_JA_STORE . '/.incoming-' . wp_generate_password( 12, false );
			wp_mkdir_p( $tmpdir );
		}
		$dest = $tmpdir . '/' . sanitize_file_name( $v['name'] . '-' . $key . '.' . strtolower( $check['ext'] ) );
		if ( move_uploaded_file( $up['tmp_name'], $dest ) ) {
			$files[ $key ] = $dest;
		} else {
			$errors[] = 'The ' . lcfirst( $f[0] ) . ' file could not be saved. Please try again.';
		}
	}

	if ( $errors ) {
		sssihms_ja_rmdir( $tmpdir );
		$GLOBALS['sssihms_ja_errors'] = $errors;
		$GLOBALS['sssihms_ja_values'] = $v;
		return;
	}

	set_transient( $rl_key, $count + 1, HOUR_IN_SECONDS );
	$ref     = 'HR' . current_time( 'ymd' ) . '-' . strtoupper( wp_generate_password( 4, false ) );
	$catname = sssihms_ja_categories()[ $cat ];

	// Every application carries every column (blank when not asked), so Drive and Excel line up.
	$rows = array( 'Reference' => $ref, 'Submitted' => current_time( 'd-M-Y H:i' ) . ' IST', 'Category' => $catname, 'Vacancy' => $vac ? $vac['title'] : '', 'Email' => $email );
	foreach ( sssihms_ja_fields() as $key => $f ) {
		$val = $v[ $key ];
		if ( '' !== $val && 'date' === $f[1] ) {
			$val = DateTime::createFromFormat( '!Y-m-d', $val )->format( 'd-M-Y' );
		} elseif ( '' !== $val && 'month' === $f[1] ) {
			$val = DateTime::createFromFormat( '!Y-m', $val )->format( 'M-Y' );
		} elseif ( 'name' === $key ) {
			$val = mb_strtoupper( $val );
		}
		$rows[ $f[0] ] = $val;
	}

	$post_id = 0;
	$dir     = SSSIHMS_JA_STORE . '/' . $ref;
	if ( rename( $tmpdir, $dir ) ) {
		$tmpdir = '';
		foreach ( $files as $key => $path ) {
			$files[ $key ] = $dir . '/' . basename( $path );
		}
		$post_id = wp_insert_post(
			array(
				'post_type'   => 'sssihms_ja_app',
				'post_status' => 'private',
				'post_title'  => $ref,
				'meta_input'  => array( '_ja_rows' => $rows, '_ja_files' => $files, '_ja_cat' => $cat, '_ja_status' => 'new' ),
			)
		);
	}
	if ( ! $post_id ) {
		error_log( 'sssihms-ja: application ' . $ref . ' could not be stored; email only.' );
	}

	$html = '<p>New job application received through whitefield.sssihms.org. The attached files are the applicant\'s uploads.</p><table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
	foreach ( $rows as $label => $val ) {
		if ( '' !== $val ) {
			$html .= '<tr><th align="left" style="background:#f4efe6">' . esc_html( $label ) . '</th><td>' . nl2br( esc_html( $val ) ) . '</td></tr>';
		}
	}
	$html .= '</table>';
	$sent  = wp_mail(
		SSSIHMS_JA_TO,
		'Job application — ' . $catname . ' — ' . ( $rows['Vacancy'] ?: 'General application' ) . ' — ' . $rows['Full name (as per Aadhaar)'] . ' [' . $ref . ']',
		$html,
		array( 'Content-Type: text/html; charset=UTF-8', 'Reply-To: ' . $rows['Full name (as per Aadhaar)'] . ' <' . $email . '>' ),
		array_values( $files )
	);
	sssihms_ja_rmdir( $tmpdir );

	if ( $post_id ) {
		update_post_meta( $post_id, '_ja_emailed', $sent ? 1 : 0 );
		if ( sssihms_fa_drive_cfg() ) {
			wp_schedule_single_event( time(), 'sssihms_ja_drive_push', array( $post_id ) );
		}
	}
	if ( ! $sent && ! $post_id ) {
		$GLOBALS['sssihms_ja_errors'] = array( 'Sorry — your application could not be sent because of a problem on our side. Please try again later, or email it to ' . SSSIHMS_JA_TO . '.' );
		$GLOBALS['sssihms_ja_values'] = $v;
		return;
	}

	$ack = 'Dear ' . $rows['Full name (as per Aadhaar)'] . ",\n\nThank you for applying to Sri Sathya Sai Institute of Higher Medical Sciences, Whitefield. Your application has been received.\n\n"
		. "Reference: $ref\nCategory: $catname\n" . ( $rows['Vacancy'] ? 'Vacancy: ' . $rows['Vacancy'] . "\n" : '' ) . "\n"
		. "The Human Resources department will contact you if your profile matches a requirement.\n\n"
		. "Human Resources, Sri Sathya Sai Institute of Higher Medical Sciences, EPIP Area, Whitefield, Bengaluru 560066\n"
		. SSSIHMS_JA_TO . "\n";
	wp_mail( $email, 'Your job application to SSSIHMS Whitefield [' . $ref . ']', $ack, array( 'Reply-To: Human Resources <' . SSSIHMS_JA_TO . '>' ) );

	wp_safe_redirect( add_query_arg( 'applied', $ref, get_permalink() ) . '#job-application' );
	exit;
}

function sssihms_ja_rmdir( $dir ) {
	if ( '' === $dir || ! is_dir( $dir ) ) {
		return;
	}
	foreach ( glob( $dir . '/*' ) as $f ) {
		wp_delete_file( $f );
	}
	rmdir( $dir );
}

add_shortcode( 'sssihms_job_application', 'sssihms_ja_render' );
function sssihms_ja_render() {
	if ( ! sssihms_ja_is_target() ) {
		return '';
	}
	$out = '<div id="job-application" class="fa-wrap">' . sssihms_fa_css() . sssihms_ja_css();
	$ref = isset( $_GET['applied'] ) ? sanitize_text_field( wp_unslash( $_GET['applied'] ) ) : '';
	if ( preg_match( '/^HR\d{6}-[A-Z0-9]{4}$/', $ref ) || 'HR-0' === $ref ) {
		return $out . '<div class="fa-ok" role="status"><h3>Application received</h3><p>Thank you. Your application has been sent to the Human Resources department.'
			. ( 'HR-0' === $ref ? '' : ' Your reference is <strong>' . esc_html( $ref ) . '</strong>.' )
			. ' An acknowledgement has been emailed to you; please check your spam folder if you do not see it.</p></div></div>';
	}

	$v = $GLOBALS['sssihms_ja_values'];
	$vac = sssihms_ja_vac_get( $v ? (int) ( $v['vacancy'] ?? 0 ) : absint( $_GET['vacancy'] ?? 0 ) );
	if ( $vac && ! $v ) {
		$v = array( 'cat' => $vac['cat'] );
	}
	if ( $vac ) {
		$out .= '<p class="fa-note">Applying for: <strong>' . esc_html( $vac['title'] ) . '</strong>.</p>';
	}
	if ( $GLOBALS['sssihms_ja_errors'] ) {
		$out .= '<div class="fa-err" role="alert" tabindex="-1" id="ja-errors"><strong>Please correct the following and submit again. Attach your files again too.</strong><ul>';
		foreach ( $GLOBALS['sssihms_ja_errors'] as $e ) {
			$out .= '<li>' . esc_html( $e ) . '</li>';
		}
		$out .= '</ul></div><script>document.getElementById("ja-errors").focus();</script>';
	}

	$req   = '<span class="fa-req" aria-hidden="true">*</span>';
	$all   = sssihms_ja_fields();
	$field = function ( $k ) use ( $all, $v, $req ) {
		list( $label, $type, $required, $fcat, $opts ) = $all[ $k ];
		$id   = 'ja-' . $k;
		$nm   = 'ja_' . $k;
		$cur  = $v[ $k ] ?? '';
		$star = $required ? ' ' . $req : '';
		// Category questions are only required while their section is shown (see the script).
		$ra   = $required ? ( '' === $fcat ? ' required' : ' data-req="1"' ) : '';
		if ( 'radio' === $type || 'checks' === $type ) {
			$sel = 'checks' === $type ? array_map( 'trim', explode( ',', $cur ) ) : array( $cur );
			$h   = '<fieldset class="fa-field"><legend>' . esc_html( $label ) . $star . '</legend>';
			foreach ( $opts as $o ) {
				$h .= '<label class="fa-opt"><input type="' . ( 'radio' === $type ? 'radio' : 'checkbox' ) . '" name="' . $nm . ( 'checks' === $type ? '[]' : '' ) . '" value="' . esc_attr( $o ) . '"'
					. ( in_array( $o, $sel, true ) ? ' checked' : '' ) . ( 'radio' === $type ? $ra : '' ) . '> ' . esc_html( $o ) . '</label>';
			}
			return $h . '</fieldset>';
		}
		$h = '<div class="fa-field' . ( 'textarea' === $type ? ' ja-wide' : '' ) . '"><label for="' . $id . '">' . esc_html( $label ) . $star . '</label>';
		if ( 'select' === $type ) {
			$h .= '<select id="' . $id . '" name="' . $nm . '"' . $ra . '><option value="">— Choose —</option>';
			foreach ( $opts as $o ) {
				$h .= '<option' . selected( $cur, $o, false ) . '>' . esc_html( $o ) . '</option>';
			}
			return $h . '</select></div>';
		}
		if ( 'textarea' === $type ) {
			return $h . '<textarea id="' . $id . '" name="' . $nm . '" rows="3" maxlength="1500"' . $ra . '>' . esc_textarea( $cur ) . '</textarea></div>';
		}
		$extra = array(
			'tel'    => ' inputmode="numeric"',
			'number' => ' min="0" step="any"',
			'month'  => ' placeholder="YYYY-MM"',
			'text'   => ' maxlength="200"',
		);
		return $h . '<input type="' . $type . '" id="' . $id . '" name="' . $nm . '" value="' . esc_attr( $cur ) . '"' . ( $extra[ $type ] ?? '' ) . $ra
			. ( 'name' === $k ? ' autocomplete="name" class="fa-caps"' : '' ) . ( 'mobile' === $k ? ' autocomplete="tel"' : '' ) . '></div>';
	};
	$group = function ( $keys ) use ( $field ) {
		return '<div class="fa-grid">' . implode( '', array_map( $field, $keys ) ) . '</div>';
	};
	$file = function ( $k ) use ( $req ) {
		$f = sssihms_ja_files()[ $k ];
		return '<div class="fa-field"><label for="ja-' . $k . '">' . esc_html( $f[0] ) . ( $f[3] ? ' ' . $req : '' ) . '</label><input type="file" id="ja-' . $k . '" name="' . $k . '" accept=".' . implode( ',.', $f[1] ) . '"' . ( $f[3] ? ' required' : '' ) . '><small>'
			. strtoupper( implode( ' / ', array_diff( $f[1], array( 'jpeg' ) ) ) ) . ', up to ' . size_format( $f[2] ) . '.' . ( $f[3] ? '' : ' Optional.' ) . '</small></div>';
	};

	$out .= '<form method="post" enctype="multipart/form-data" action="#job-application" class="fa-form" id="ja-form">'
		. '<input type="hidden" name="sssihms_ja" value="1">'
		. ( $vac ? '<input type="hidden" name="ja_vacancy" value="' . (int) $vac['id'] . '">' : '' )
		. '<div class="fa-hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>'
		. '<p class="fa-note">Fields marked ' . $req . ' are required. We will reply to the email address you give below.</p>'

		. '<h3>1. Category</h3><fieldset class="fa-field"><legend>Category ' . $req . '</legend>';
	foreach ( sssihms_ja_categories() as $k => $label ) {
		$out .= '<label class="fa-opt"><input type="radio" name="category" value="' . $k . '"' . checked( $v['cat'] ?? '', $k, false ) . ' required> ' . esc_html( $label ) . '</label>';
	}
	$out .= '</fieldset>'

		. '<h3>2. Personal details</h3>'
		. '<div class="fa-grid">' . $field( 'name' ) . $field( 'dob' ) . $field( 'gender' )
		. '<div class="fa-field"><label for="ja-email">Email address ' . $req . '</label><input type="email" id="ja-email" name="email" value="' . esc_attr( $v['email'] ?? '' ) . '" required autocomplete="email"></div>'
		. $field( 'mobile' ) . $field( 'alt' ) . $field( 'city' ) . $field( 'state' ) . '</div>'
		. $field( 'languages' )

		. '<h3>3. Education</h3>' . $group( array( 'qual', 'inst', 'qual_year', 'other_qual', 'reg', 'reg_council' ) );

	$n = 4;
	foreach ( sssihms_ja_categories() as $c => $label ) {
		$keys = array_keys( array_filter( $all, function ( $f ) use ( $c ) {
			return $c === $f[3];
		} ) );
		$out .= '<div class="ja-cat" data-cat="' . $c . '"><h3>' . $n . '. ' . esc_html( $label ) . '</h3>' . $group( $keys ) . '</div>';
	}

	$out .= '<h3>' . ( $n + 1 ) . '. Experience</h3>' . $group( array( 'exp_years', 'employer', 'designation', 'exp_from', 'exp_to', 'leaving', 'salary', 'notice' ) )
		. '<h3>' . ( $n + 2 ) . '. Documents</h3>' . $file( 'cv' ) . $file( 'certs' ) . $file( 'photo' )

		. '<label class="fa-opt fa-consent"><input type="checkbox" name="consent" value="1" required> I declare that the information given is true. I agree to SSSIHMS using it to consider me for employment. ' . $req . '</label>'
		. '<p><button type="submit" class="btn btn-primary">Submit application</button></p>'
		. '<p class="fa-note">Trouble with the form? Email your CV to <a href="mailto:' . SSSIHMS_JA_TO . '">' . SSSIHMS_JA_TO . '</a>.</p>'
		. '</form></div>'
		. '<script>(function(){var f=document.getElementById("ja-form");if(!f)return;function show(){var c=(f.querySelector("input[name=category]:checked")||{}).value||"";'
		. 'f.querySelectorAll(".ja-cat").forEach(function(s){var on=s.getAttribute("data-cat")===c;s.hidden=!on;s.querySelectorAll("input,select,textarea").forEach(function(el){el.disabled=!on;if(el.getAttribute("data-req"))el.required=on;});});'
		. '["ja-reg","ja-reg_council"].forEach(function(id){var e=document.getElementById(id);if(e)e.required=(c==="nursing"||c==="doctor");});}'
		. 'f.addEventListener("change",function(e){if(e.target.name==="category")show();});show();})();</script>';
	return $out;
}

function sssihms_ja_css() {
	return '<style>
.ja-cat[hidden]{display:none}
.ja-wide{grid-column:1/-1}
.fa-field select,.fa-field textarea,.fa-field input[type=number],.fa-field input[type=month]{width:100%;font:inherit;font-size:16px;padding:10px 12px;border:1px solid #b9ad9a;border-radius:6px;background:#fff;color:#2a1f14}
.fa-field textarea{resize:vertical}
</style>';
}

/* ---------- Stored applications: admin list, status, Excel and ZIP export, Drive, retention ---------- */

add_action( 'init', 'sssihms_ja_register' );
function sssihms_ja_register() {
	if ( sssihms_ja_is_target() ) {
		register_post_type( 'sssihms_ja_app', array( 'public' => false, 'show_ui' => false, 'label' => 'Job applications' ) );
		register_post_type( 'sssihms_vacancy', array( 'public' => false, 'show_ui' => false, 'label' => 'Vacancies' ) );
	}
}

function sssihms_ja_statuses() {
	return array( 'new' => 'New', 'shortlisted' => 'Shortlisted', 'selected' => 'Selected', 'not_selected' => 'Not selected' );
}

function sssihms_ja_apps() {
	return get_posts( array( 'post_type' => 'sssihms_ja_app', 'post_status' => 'private', 'numberposts' => -1, 'orderby' => 'date', 'order' => 'ASC' ) );
}

/** Calls the Apps Script web app; returns the decoded reply or an error string. */
function sssihms_ja_drive_call( $payload ) {
	$cfg = sssihms_fa_drive_cfg();
	if ( ! $cfg ) {
		return 'Google Drive is not connected';
	}
	$r = wp_remote_post(
		$cfg['url'],
		array(
			'timeout'     => 60,
			'headers'     => array( 'Content-Type' => 'application/json' ),
			'body'        => wp_json_encode( array_merge( array( 'secret' => $cfg['secret'], 'form' => 'jobs' ), $payload ) ),
			// Apps Script answers with a 302 that must be fetched with GET; WordPress would re-POST.
			'redirection' => 0,
		)
	);
	$loc = wp_remote_retrieve_header( $r, 'location' );
	if ( ! is_wp_error( $r ) && 302 === wp_remote_retrieve_response_code( $r ) && $loc ) {
		$r = wp_remote_get( $loc, array( 'timeout' => 30 ) );
	}
	if ( is_wp_error( $r ) ) {
		return $r->get_error_message();
	}
	$j = json_decode( wp_remote_retrieve_body( $r ), true );
	return ! empty( $j['ok'] ) ? $j : ( $j['error'] ?? 'HTTP ' . wp_remote_retrieve_response_code( $r ) . ' — unexpected reply' );
}

add_action( 'sssihms_ja_drive_push', 'sssihms_ja_drive_push' );
function sssihms_ja_drive_push( $post_id ) {
	$app = get_post( $post_id );
	if ( ! $app || 'sssihms_ja_app' !== $app->post_type || get_post_meta( $post_id, '_ja_drive', true ) ) {
		return;
	}
	$files = array();
	foreach ( (array) get_post_meta( $post_id, '_ja_files', true ) as $path ) {
		if ( is_readable( $path ) ) {
			$files[] = array( 'name' => basename( $path ), 'mime' => wp_check_filetype( $path )['type'], 'data' => base64_encode( file_get_contents( $path ) ) );
		}
	}
	$rows = get_post_meta( $post_id, '_ja_rows', true );
	$j    = sssihms_ja_drive_call( array( 'ref' => $app->post_title, 'name' => $rows['Full name (as per Aadhaar)'] ?? '', 'row' => $rows, 'files' => $files ) );
	if ( is_array( $j ) && ! empty( $j['folder'] ) ) {
		update_post_meta( $post_id, '_ja_drive', esc_url_raw( $j['folder'] ) );
		delete_post_meta( $post_id, '_ja_drive_error' );
	} else {
		update_post_meta( $post_id, '_ja_drive_error', mb_substr( wp_strip_all_tags( is_string( $j ) ? $j : 'no folder returned' ), 0, 200 ) );
	}
}

/** Daily: delete applications not marked Selected, six months after they arrived. */
add_action( 'init', 'sssihms_ja_schedule' );
function sssihms_ja_schedule() {
	if ( sssihms_ja_is_target() && ! wp_next_scheduled( 'sssihms_ja_retention' ) ) {
		wp_schedule_event( strtotime( 'tomorrow 02:30' ), 'daily', 'sssihms_ja_retention' );
	}
}

add_action( 'sssihms_ja_retention', 'sssihms_ja_retention' );
function sssihms_ja_retention() {
	if ( ! sssihms_ja_is_target() ) {
		return;
	}
	$cutoff = gmdate( 'Y-m-d H:i:s', strtotime( SSSIHMS_JA_KEEP ) );
	$old    = get_posts( array( 'post_type' => 'sssihms_ja_app', 'post_status' => 'private', 'numberposts' => -1, 'date_query' => array( array( 'column' => 'post_date_gmt', 'before' => $cutoff ) ) ) );
	foreach ( $old as $app ) {
		if ( 'selected' === get_post_meta( $app->ID, '_ja_status', true ) ) {
			continue;
		}
		sssihms_ja_rmdir( SSSIHMS_JA_STORE . '/' . $app->post_title );
		wp_delete_post( $app->ID, true );
	}
}

add_action( 'admin_menu', 'sssihms_ja_admin_menu' );
function sssihms_ja_admin_menu() {
	if ( sssihms_ja_is_target() ) {
		add_menu_page( 'Job Applications', 'Job Applications', SSSIHMS_JA_CAP, 'sssihms-ja', 'sssihms_ja_admin_page', 'dashicons-id-alt', 27 );
		add_submenu_page( 'sssihms-ja', 'Job Applications', 'Applications', SSSIHMS_JA_CAP, 'sssihms-ja', 'sssihms_ja_admin_page' );
		add_submenu_page( 'sssihms-ja', 'Vacancies', 'Vacancies', SSSIHMS_JA_CAP, 'sssihms-vac', 'sssihms_ja_vac_page' );
	}
}

function sssihms_ja_admin_url( $action, $args = array() ) {
	return wp_nonce_url( add_query_arg( array_merge( array( 'action' => $action ), $args ), admin_url( 'admin-post.php' ) ), $action );
}

function sssihms_ja_admin_check( $action ) {
	if ( ! sssihms_ja_is_target() || ! current_user_can( SSSIHMS_JA_CAP ) ) {
		wp_die( 'Not allowed.', 403 );
	}
	check_admin_referer( $action );
}

function sssihms_ja_back( $msg ) {
	wp_safe_redirect( add_query_arg( 'ja_msg', rawurlencode( $msg ), admin_url( 'admin.php?page=sssihms-ja' ) ) );
	exit;
}

function sssihms_ja_admin_page() {
	$apps   = sssihms_ja_apps();
	$cats   = sssihms_ja_categories();
	$states = sssihms_ja_statuses();
	$filter = sanitize_key( $_GET['cat'] ?? '' );
	echo '<div class="wrap"><h1>Job Applications</h1>';
	if ( isset( $_GET['ja_msg'] ) ) {
		echo '<div class="notice notice-success"><p>' . esc_html( sanitize_text_field( wp_unslash( $_GET['ja_msg'] ) ) ) . '</p></div>';
	}
	echo '<p>Applications from the website form. <strong>Applications not marked Selected are deleted from this list six months after they arrive.</strong> Their Google Drive copies are kept.</p>';
	$counts = array_count_values( array_map( function ( $a ) {
		return get_post_meta( $a->ID, '_ja_cat', true );
	}, $apps ) );
	echo '<ul class="subsubsub"><li><a href="' . esc_url( admin_url( 'admin.php?page=sssihms-ja' ) ) . '"' . ( '' === $filter ? ' class="current"' : '' ) . '>All (' . count( $apps ) . ')</a></li>';
	foreach ( $cats as $c => $label ) {
		echo '<li> | <a href="' . esc_url( admin_url( 'admin.php?page=sssihms-ja&cat=' . $c ) ) . '"' . ( $filter === $c ? ' class="current"' : '' ) . '>' . esc_html( $label ) . ' (' . (int) ( $counts[ $c ] ?? 0 ) . ')</a></li>';
	}
	echo '</ul><br class="clear">';
	if ( $apps ) {
		echo '<p><a class="button button-primary" href="' . esc_url( sssihms_ja_admin_url( 'sssihms_ja_xlsx' ) ) . '">Download Excel (.xlsx, one sheet per category)</a> '
			. '<a class="button" href="' . esc_url( sssihms_ja_admin_url( 'sssihms_ja_zip' ) ) . '">Download all files (.zip)</a> '
			. ( sssihms_fa_drive_cfg() ? '<a class="button" href="' . esc_url( sssihms_ja_admin_url( 'sssihms_ja_drive_all' ) ) . '">Copy pending and failed to Drive now</a>' : '' ) . '</p>';
	}
	echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">' . wp_nonce_field( 'sssihms_ja_status', '_wpnonce', true, false ) . '<input type="hidden" name="action" value="sssihms_ja_status">';
	echo '<table class="widefat striped"><thead><tr><th>Reference</th><th>Submitted</th><th>Category</th><th>Vacancy</th><th>Name</th><th>Experience</th><th>Mobile</th><th>Files</th><th>Drive</th><th>Status</th></tr></thead><tbody>';
	$shown = 0;
	foreach ( array_reverse( $apps ) as $app ) {
		$cat = get_post_meta( $app->ID, '_ja_cat', true );
		if ( '' !== $filter && $filter !== $cat ) {
			continue;
		}
		++$shown;
		$r     = (array) get_post_meta( $app->ID, '_ja_rows', true );
		$links = array();
		foreach ( (array) get_post_meta( $app->ID, '_ja_files', true ) as $key => $path ) {
			$links[] = '<a href="' . esc_url( sssihms_ja_admin_url( 'sssihms_ja_file', array( 'id' => $app->ID, 'key' => $key ) ) ) . '">' . esc_html( sssihms_ja_files()[ $key ][0] ?? $key ) . '</a>';
		}
		$drive = get_post_meta( $app->ID, '_ja_drive', true );
		$derr  = get_post_meta( $app->ID, '_ja_drive_error', true );
		$dcell = $drive ? '<a href="' . esc_url( $drive ) . '" target="_blank" rel="noopener">Open</a>' : ( $derr ? 'Failed: ' . esc_html( $derr ) : ( sssihms_fa_drive_cfg() ? 'Pending' : '—' ) );
		$st    = get_post_meta( $app->ID, '_ja_status', true ) ?: 'new';
		$sel   = '<select name="status[' . $app->ID . ']">';
		foreach ( $states as $k => $label ) {
			$sel .= '<option value="' . $k . '"' . selected( $st, $k, false ) . '>' . esc_html( $label ) . '</option>';
		}
		$sel .= '</select>';
		echo '<tr><td>' . esc_html( $app->post_title ) . '</td><td>' . esc_html( $r['Submitted'] ?? '' ) . '</td><td>' . esc_html( $r['Category'] ?? '' ) . '</td><td>' . esc_html( ( $r['Vacancy'] ?? '' ) ?: ( $r['Position applied for'] ?? 'General' ) ) . '</td><td>' . esc_html( $r['Full name (as per Aadhaar)'] ?? '' ) . '</td><td>' . esc_html( $r['Total experience (years; 0 if none)'] ?? '' ) . ' yrs</td><td>' . esc_html( $r['Mobile number (10 digits)'] ?? '' ) . '</td><td>' . implode( ' · ', $links ) . '</td><td>' . $dcell . '</td><td>' . $sel . '</td></tr>';
	}
	if ( ! $shown ) {
		echo '<tr><td colspan="10">No applications.</td></tr>';
	}
	echo '</tbody></table>';
	if ( $shown ) {
		echo '<p><button class="button button-primary">Save status changes</button></p>';
	}
	echo '</form></div>';
}

add_action( 'admin_post_sssihms_ja_status', 'sssihms_ja_status' );
function sssihms_ja_status() {
	sssihms_ja_admin_check( 'sssihms_ja_status' );
	$n = 0;
	foreach ( (array) ( $_POST['status'] ?? array() ) as $id => $st ) {
		$app = get_post( absint( $id ) );
		$st  = sanitize_key( $st );
		if ( $app && 'sssihms_ja_app' === $app->post_type && isset( sssihms_ja_statuses()[ $st ] ) && get_post_meta( $app->ID, '_ja_status', true ) !== $st ) {
			update_post_meta( $app->ID, '_ja_status', $st );
			++$n;
		}
	}
	sssihms_ja_back( "$n status change(s) saved." );
}

add_action( 'admin_post_sssihms_ja_drive_all', 'sssihms_ja_drive_all' );
function sssihms_ja_drive_all() {
	sssihms_ja_admin_check( 'sssihms_ja_drive_all' );
	$done = 0;
	$todo = 0;
	foreach ( sssihms_ja_apps() as $app ) {
		if ( get_post_meta( $app->ID, '_ja_drive', true ) ) {
			continue;
		}
		++$todo;
		sssihms_ja_drive_push( $app->ID );
		$done += get_post_meta( $app->ID, '_ja_drive', true ) ? 1 : 0;
	}
	sssihms_ja_back( "Copied $done of $todo application(s) to Drive." );
}

function sssihms_ja_safe_path( $path ) {
	$real = realpath( $path );
	return $real && 0 === strpos( $real, SSSIHMS_JA_STORE . '/' ) && is_file( $real ) ? $real : '';
}

add_action( 'admin_post_sssihms_ja_file', 'sssihms_ja_file' );
function sssihms_ja_file() {
	sssihms_ja_admin_check( 'sssihms_ja_file' );
	$app   = get_post( absint( $_GET['id'] ?? 0 ) );
	$files = $app && 'sssihms_ja_app' === $app->post_type ? (array) get_post_meta( $app->ID, '_ja_files', true ) : array();
	$path  = sssihms_ja_safe_path( $files[ sanitize_key( $_GET['key'] ?? '' ) ] ?? '' );
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

add_action( 'admin_post_sssihms_ja_zip', 'sssihms_ja_zip' );
function sssihms_ja_zip() {
	sssihms_ja_admin_check( 'sssihms_ja_zip' );
	$tmp = wp_tempnam( 'job-files' );
	$zip = new ZipArchive();
	$zip->open( $tmp, ZipArchive::OVERWRITE );
	foreach ( sssihms_ja_apps() as $app ) {
		$r      = (array) get_post_meta( $app->ID, '_ja_rows', true );
		$folder = sanitize_file_name( ( $r['Category'] ?? '' ) ) . '/' . sanitize_file_name( $app->post_title . ' ' . ( $r['Full name (as per Aadhaar)'] ?? '' ) );
		foreach ( (array) get_post_meta( $app->ID, '_ja_files', true ) as $path ) {
			$path = sssihms_ja_safe_path( $path );
			if ( $path ) {
				$zip->addFile( $path, $folder . '/' . basename( $path ) );
			}
		}
	}
	$zip->addFromString( 'README.txt', 'Job applications, uploaded files, downloaded ' . current_time( 'd-M-Y H:i' ) . " IST.\r\nOne folder per category, then one per application: reference and name.\r\n" );
	$zip->close();
	sssihms_fa_send_download( $tmp, 'Job-applications-files_' . current_time( 'Y-m-d' ) . '.zip', 'application/zip' );
}

add_action( 'admin_post_sssihms_ja_xlsx', 'sssihms_ja_xlsx' );
function sssihms_ja_xlsx() {
	sssihms_ja_admin_check( 'sssihms_ja_xlsx' );
	$all    = sssihms_ja_fields();
	$sheets = array();
	foreach ( sssihms_ja_categories() as $c => $label ) {
		$head = array( 'Reference', 'Submitted', 'Status', 'Vacancy', 'Email' );
		foreach ( $all as $f ) {
			if ( '' === $f[3] || $c === $f[3] ) {
				$head[] = $f[0];
			}
		}
		// Answers to questions since removed from the form (older applications) stay as extra columns.
		$apps = array_filter( sssihms_ja_apps(), function ( $app ) use ( $c ) {
			return get_post_meta( $app->ID, '_ja_cat', true ) === $c;
		} );
		foreach ( $apps as $app ) {
			foreach ( array_keys( (array) get_post_meta( $app->ID, '_ja_rows', true ) ) as $k ) {
				if ( ! in_array( $k, $head, true ) && ! in_array( $k, array( 'Category' ), true ) ) {
					$head[] = $k;
				}
			}
		}
		array_push( $head, 'Files', 'Emailed to HR', 'Google Drive folder' );
		$rows = array( $head );
		foreach ( $apps as $app ) {
			$r   = (array) get_post_meta( $app->ID, '_ja_rows', true );
			$row = array();
			foreach ( array_slice( $head, 0, -3 ) as $h ) {
				$row[] = 'Status' === $h ? sssihms_ja_statuses()[ get_post_meta( $app->ID, '_ja_status', true ) ?: 'new' ] : (string) ( $r[ $h ] ?? '' );
			}
			$row[]  = implode( ', ', array_map( 'basename', (array) get_post_meta( $app->ID, '_ja_files', true ) ) );
			$row[]  = get_post_meta( $app->ID, '_ja_emailed', true ) ? 'Yes' : 'No';
			$row[]  = (string) get_post_meta( $app->ID, '_ja_drive', true );
			$rows[] = $row;
		}
		$sheets[ $label ] = $rows;
	}
	$tmp = wp_tempnam( 'job-xlsx' );
	sssihms_ja_write_xlsx( $tmp, $sheets );
	sssihms_fa_send_download( $tmp, 'Job-applications_' . current_time( 'Y-m-d' ) . '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' );
}

/**
 * Minimal .xlsx with several sheets of text cells (name => rows), bold frozen header row and
 * autofilter on each. Inline strings only, so nothing an applicant types becomes a formula.
 * Multi-sheet version of sssihms_fa_write_xlsx().
 */
function sssihms_ja_write_xlsx( $file, $sheets ) {
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
	$ns    = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
	$zip   = new ZipArchive();
	$zip->open( $file, ZipArchive::OVERWRITE );
	$types = '';
	$rels  = '';
	$list  = '';
	$names = '';
	$i     = 0;
	foreach ( $sheets as $name => $rows ) {
		++$i;
		$name  = mb_substr( str_replace( array( '&', '/', '\\', '?', '*', '[', ']', ':' ), array( 'and', '-' ), $name ), 0, 31 );
		$ncol  = count( $rows[0] );
		$width = array_fill( 0, $ncol, 10 );
		$data  = '';
		foreach ( $rows as $ri => $row ) {
			$data .= '<row r="' . ( $ri + 1 ) . '">';
			foreach ( array_values( $row ) as $ci => $val ) {
				$width[ $ci ] = min( 50, max( $width[ $ci ], mb_strlen( $val ) + 2 ) );
				$data        .= '<c r="' . $col( $ci ) . ( $ri + 1 ) . '" t="inlineStr"' . ( 0 === $ri ? ' s="1"' : '' ) . '><is><t xml:space="preserve">' . $esc( $val ) . '</t></is></c>';
			}
			$data .= '</row>';
		}
		$cols = '';
		foreach ( $width as $ci => $w ) {
			$cols .= '<col min="' . ( $ci + 1 ) . '" max="' . ( $ci + 1 ) . '" width="' . $w . '" customWidth="1"/>';
		}
		$lastc = $col( $ncol - 1 );
		$zip->addFromString( "xl/worksheets/sheet$i.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet ' . $ns . '><sheetViews><sheetView workbookViewId="0"' . ( 1 === $i ? ' tabSelected="1"' : '' ) . '><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>' . $cols . '</cols><sheetData>' . $data . '</sheetData><autoFilter ref="A1:' . $lastc . count( $rows ) . '"/></worksheet>' );
		$types .= '<Override PartName="/xl/worksheets/sheet' . $i . '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
		$rels  .= '<Relationship Id="rId' . $i . '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' . $i . '.xml"/>';
		$list  .= '<sheet name="' . $esc( $name ) . '" sheetId="' . $i . '" r:id="rId' . $i . '"/>';
		$names .= '<definedName name="_xlnm._FilterDatabase" localSheetId="' . ( $i - 1 ) . '" hidden="1">\'' . $esc( $name ) . '\'!$A$1:$' . $lastc . '$' . count( $rows ) . '</definedName>';
	}
	$sid = $i + 1;
	$zip->addFromString( '[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' . $types . '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>' );
	$zip->addFromString( '_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' );
	$zip->addFromString( 'xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' . $rels . '<Relationship Id="rId' . $sid . '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' );
	$zip->addFromString( 'xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook ' . $ns . '><sheets>' . $list . '</sheets><definedNames>' . $names . '</definedNames></workbook>' );
	$zip->addFromString( 'xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF4EFE6"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>' );
	$zip->close();
}

/* ---------- Vacancies: HR adds posts and flyers; listed on the Careers page ---------- */

/** One-time: the HR Recruitment role, and the sssihms_hr capability for administrators and editors. */
add_action( 'init', 'sssihms_ja_roles' );
function sssihms_ja_roles() {
	if ( ! sssihms_ja_is_target() || '1' === get_option( 'sssihms_ja_roles' ) ) {
		return;
	}
	add_role( 'sssihms_hr', 'HR Recruitment', array( 'read' => true, 'upload_files' => true, 'sssihms_hr' => true ) );
	foreach ( array( 'administrator', 'editor' ) as $r ) {
		$role = get_role( $r );
		if ( $role ) {
			$role->add_cap( 'sssihms_hr' );
		}
	}
	update_option( 'sssihms_ja_roles', '1' );
}

/** Vacancy fields: key => array( label, type, required ). */
function sssihms_ja_vac_fields() {
	return array(
		'title'     => array( 'Position', 'text', true ),
		'cat'       => array( 'Category', 'select', true ),
		'dept'      => array( 'Department', 'text', false ),
		'posts'     => array( 'Number of posts', 'number', false ),
		'qual'      => array( 'Qualification', 'textarea', false ),
		'exp'       => array( 'Experience', 'text', false ),
		'details'   => array( 'Other details (salary, accommodation, etc.)', 'textarea', false ),
		'last_date' => array( 'Last date to apply (leave empty: open until filled)', 'date', false ),
	);
}

/** An open vacancy as an array (with id, flyer), or null if missing, closed or past its last date. */
function sssihms_ja_vac_get( $id, $only_open = true ) {
	$p = $id ? get_post( $id ) : null;
	if ( ! $p || 'sssihms_vacancy' !== $p->post_type || 'trash' === $p->post_status ) {
		return null;
	}
	$vac = array_merge( (array) get_post_meta( $p->ID, '_vac', true ), array( 'id' => $p->ID, 'title' => $p->post_title, 'flyer' => (int) get_post_meta( $p->ID, '_vac_flyer', true ), 'open' => (bool) get_post_meta( $p->ID, '_vac_open', true ) ) );
	$live = $vac['open'] && ( empty( $vac['last_date'] ) || $vac['last_date'] >= current_time( 'Y-m-d' ) );
	return ! $only_open || $live ? $vac : null;
}

function sssihms_ja_vac_all() {
	return get_posts( array( 'post_type' => 'sssihms_vacancy', 'post_status' => 'private', 'numberposts' => -1, 'orderby' => 'date', 'order' => 'DESC' ) );
}

function sssihms_ja_vac_date( $ymd ) {
	$d = $ymd ? DateTime::createFromFormat( '!Y-m-d', $ymd ) : false;
	return $d ? $d->format( 'd-M-Y' ) : '';
}

/** Clear the page cache for the Careers page so changes show at once. */
function sssihms_ja_vac_flush() {
	if ( function_exists( 'w3tc_flush_post' ) ) {
		$careers = get_page_by_path( 'careers' );
		if ( $careers ) {
			w3tc_flush_post( $careers->ID );
		}
	}
}

// Vacancies drop off at their last date: clear the Careers page cache just after midnight IST.
add_action( 'init', 'sssihms_ja_vac_schedule' );
function sssihms_ja_vac_schedule() {
	if ( sssihms_ja_is_target() && ! wp_next_scheduled( 'sssihms_ja_vac_flush' ) ) {
		wp_schedule_event( ( new DateTime( 'tomorrow 00:05', wp_timezone() ) )->getTimestamp(), 'daily', 'sssihms_ja_vac_flush' );
	}
}
add_action( 'sssihms_ja_vac_flush', 'sssihms_ja_vac_flush' );

function sssihms_ja_vac_page() {
	$cats = sssihms_ja_categories();
	echo '<div class="wrap">';
	if ( isset( $_GET['ja_msg'] ) ) {
		echo '<div class="notice notice-success"><p>' . esc_html( sanitize_text_field( wp_unslash( $_GET['ja_msg'] ) ) ) . '</p></div>';
	}
	$edit = isset( $_GET['edit'] ) ? sssihms_ja_vac_get( absint( $_GET['edit'] ), false ) : null;
	if ( $edit || isset( $_GET['new'] ) ) {
		$vac = $edit ?: array();
		echo '<h1>' . ( $edit ? 'Edit vacancy' : 'Add vacancy' ) . '</h1>'
			. '<form method="post" enctype="multipart/form-data" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">' . wp_nonce_field( 'sssihms_vac_save', '_wpnonce', true, false )
			. '<input type="hidden" name="action" value="sssihms_vac_save"><input type="hidden" name="id" value="' . (int) ( $vac['id'] ?? 0 ) . '"><table class="form-table">';
		foreach ( sssihms_ja_vac_fields() as $k => $f ) {
			$cur = $vac[ $k ] ?? '';
			echo '<tr><th><label for="vac-' . $k . '">' . esc_html( $f[0] ) . ( $f[2] ? ' *' : '' ) . '</label></th><td>';
			if ( 'select' === $f[1] ) {
				echo '<select id="vac-' . $k . '" name="vac_' . $k . '" required><option value="">— Choose —</option>';
				foreach ( $cats as $c => $label ) {
					echo '<option value="' . $c . '"' . selected( $cur, $c, false ) . '>' . esc_html( $label ) . '</option>';
				}
				echo '</select>';
			} elseif ( 'textarea' === $f[1] ) {
				echo '<textarea id="vac-' . $k . '" name="vac_' . $k . '" rows="3" class="large-text">' . esc_textarea( $cur ) . '</textarea>';
			} else {
				echo '<input type="' . $f[1] . '" id="vac-' . $k . '" name="vac_' . $k . '" value="' . esc_attr( $cur ) . '" class="' . ( 'text' === $f[1] ? 'regular-text' : 'small-text' ) . '"' . ( 'number' === $f[1] ? ' min="1"' : '' ) . ( $f[2] ? ' required' : '' ) . '>';
			}
			echo '</td></tr>';
		}
		echo '<tr><th><label for="vac-flyer">Flyer</label></th><td>';
		if ( ! empty( $vac['flyer'] ) && get_post( $vac['flyer'] ) ) {
			echo '<p>Current: <a href="' . esc_url( wp_get_attachment_url( $vac['flyer'] ) ) . '" target="_blank" rel="noopener">' . esc_html( basename( get_attached_file( $vac['flyer'] ) ) ) . '</a> '
				. '<label><input type="checkbox" name="vac_flyer_remove" value="1"> Remove</label></p><p>Upload a new file to replace it:</p>';
		}
		echo '<input type="file" id="vac-flyer" name="flyer" accept=".jpg,.jpeg,.png,.pdf"><p class="description">JPG, PNG or PDF, up to 5 MB. Optional.</p></td></tr>'
			. '<tr><th>Show on the Careers page</th><td><label><input type="checkbox" name="vac_open" value="1"' . checked( $vac['open'] ?? true, true, false ) . '> Open</label></td></tr>'
			. '</table><p><button class="button button-primary">Save vacancy</button> <a class="button" href="' . esc_url( admin_url( 'admin.php?page=sssihms-vac' ) ) . '">Cancel</a></p></form></div>';
		return;
	}

	echo '<h1 class="wp-heading-inline">Vacancies</h1> <a class="page-title-action" href="' . esc_url( admin_url( 'admin.php?page=sssihms-vac&new=1' ) ) . '">Add vacancy</a><hr class="wp-header-end">'
		. '<p>Open vacancies appear on the <a href="' . esc_url( home_url( '/careers/' ) ) . '" target="_blank" rel="noopener">Career Opportunities</a> page, newest first, each with an "Apply for this post" button. A vacancy is hidden automatically after its last date; close it to hide it sooner.</p>'
		. '<table class="widefat striped"><thead><tr><th>Position</th><th>Category</th><th>Department</th><th>Posts</th><th>Last date</th><th>Flyer</th><th>On the website</th><th></th></tr></thead><tbody>';
	$list = sssihms_ja_vac_all();
	foreach ( $list as $p ) {
		$vac   = sssihms_ja_vac_get( $p->ID, false );
		$live  = (bool) sssihms_ja_vac_get( $p->ID );
		$state = $live ? 'Shown' : ( $vac['open'] ? 'Hidden — last date passed' : 'Closed' );
		$tog   = sssihms_ja_admin_url( 'sssihms_vac_state', array( 'id' => $p->ID, 'to' => $vac['open'] ? 'close' : 'open' ) );
		echo '<tr><td><strong><a href="' . esc_url( admin_url( 'admin.php?page=sssihms-vac&edit=' . $p->ID ) ) . '">' . esc_html( $vac['title'] ) . '</a></strong></td><td>' . esc_html( $cats[ $vac['cat'] ?? '' ] ?? '' ) . '</td><td>' . esc_html( $vac['dept'] ?? '' ) . '</td><td>' . esc_html( $vac['posts'] ?? '' ) . '</td><td>' . esc_html( sssihms_ja_vac_date( $vac['last_date'] ?? '' ) ?: 'Until filled' ) . '</td>'
			. '<td>' . ( $vac['flyer'] ? '<a href="' . esc_url( wp_get_attachment_url( $vac['flyer'] ) ) . '" target="_blank" rel="noopener">View</a>' : '—' ) . '</td><td>' . $state . '</td>'
			. '<td><a href="' . esc_url( admin_url( 'admin.php?page=sssihms-vac&edit=' . $p->ID ) ) . '">Edit</a> · <a href="' . esc_url( $tog ) . '">' . ( $vac['open'] ? 'Close' : 'Reopen' ) . '</a> · '
			. '<a href="' . esc_url( sssihms_ja_admin_url( 'sssihms_vac_state', array( 'id' => $p->ID, 'to' => 'trash' ) ) ) . '" onclick="return confirm(\'Move this vacancy to the trash?\')">Trash</a></td></tr>';
	}
	if ( ! $list ) {
		echo '<tr><td colspan="8">No vacancies yet. Use "Add vacancy".</td></tr>';
	}
	echo '</tbody></table></div>';
}

function sssihms_ja_vac_back( $msg ) {
	sssihms_ja_vac_flush();
	wp_safe_redirect( add_query_arg( 'ja_msg', rawurlencode( $msg ), admin_url( 'admin.php?page=sssihms-vac' ) ) );
	exit;
}

add_action( 'admin_post_sssihms_vac_save', 'sssihms_ja_vac_save' );
function sssihms_ja_vac_save() {
	sssihms_ja_admin_check( 'sssihms_vac_save' );
	$id   = absint( $_POST['id'] ?? 0 );
	$prev = $id ? sssihms_ja_vac_get( $id, false ) : null;
	if ( $id && ! $prev ) {
		wp_die( 'Vacancy not found.', 404 );
	}
	$data = array();
	foreach ( sssihms_ja_vac_fields() as $k => $f ) {
		$raw        = wp_unslash( $_POST[ 'vac_' . $k ] ?? '' );
		$data[ $k ] = 'textarea' === $f[1] ? trim( sanitize_textarea_field( $raw ) ) : trim( sanitize_text_field( $raw ) );
	}
	$errors = array();
	if ( '' === $data['title'] ) {
		$errors[] = 'Enter the position.';
	}
	if ( ! isset( sssihms_ja_categories()[ $data['cat'] ] ) ) {
		$errors[] = 'Choose a category.';
	}
	if ( '' !== $data['posts'] && ( ! ctype_digit( $data['posts'] ) || (int) $data['posts'] < 1 ) ) {
		$errors[] = 'Number of posts should be a whole number.';
	}
	if ( '' !== $data['last_date'] && ! sssihms_ja_vac_date( $data['last_date'] ) ) {
		$errors[] = 'Enter a valid last date.';
	}
	$up = $_FILES['flyer'] ?? null;
	if ( $up && UPLOAD_ERR_NO_FILE !== $up['error'] ) {
		$check = wp_check_filetype_and_ext( $up['tmp_name'], $up['name'] );
		if ( UPLOAD_ERR_OK !== $up['error'] ) {
			$errors[] = 'The flyer could not be uploaded.';
		} elseif ( $up['size'] > 5 * MB_IN_BYTES ) {
			$errors[] = 'The flyer is larger than 5 MB.';
		} elseif ( ! in_array( strtolower( (string) $check['ext'] ), array( 'jpg', 'jpeg', 'png', 'pdf' ), true ) ) {
			$errors[] = 'The flyer must be a JPG, PNG or PDF file.';
		}
	}
	if ( $errors ) {
		wp_die( esc_html( implode( ' ', $errors ) ) . '<p><a href="javascript:history.back()">Go back</a></p>', 'Vacancy not saved', array( 'response' => 400 ) );
	}

	$title = $data['title'];
	unset( $data['title'] );
	$args = array( 'post_type' => 'sssihms_vacancy', 'post_status' => 'private', 'post_title' => $title );
	$id   = $id ? wp_update_post( array_merge( $args, array( 'ID' => $id ) ) ) : wp_insert_post( $args );
	update_post_meta( $id, '_vac', $data );
	update_post_meta( $id, '_vac_open', empty( $_POST['vac_open'] ) ? 0 : 1 );
	if ( ! empty( $_POST['vac_flyer_remove'] ) ) {
		delete_post_meta( $id, '_vac_flyer' ); // The file stays in the media library.
	}
	if ( $up && UPLOAD_ERR_OK === $up['error'] ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		$att = media_handle_upload( 'flyer', 0, array( 'post_title' => 'Vacancy flyer — ' . $title ) );
		if ( is_wp_error( $att ) ) {
			sssihms_ja_vac_back( 'Vacancy saved, but the flyer was not: ' . $att->get_error_message() );
		}
		update_post_meta( $id, '_vac_flyer', $att );
	}
	sssihms_ja_vac_back( 'Vacancy "' . $title . '" saved.' );
}

add_action( 'admin_post_sssihms_vac_state', 'sssihms_ja_vac_state' );
function sssihms_ja_vac_state() {
	sssihms_ja_admin_check( 'sssihms_vac_state' );
	$vac = sssihms_ja_vac_get( absint( $_GET['id'] ?? 0 ), false );
	$to  = sanitize_key( $_GET['to'] ?? '' );
	if ( ! $vac ) {
		wp_die( 'Vacancy not found.', 404 );
	}
	if ( 'trash' === $to ) {
		wp_trash_post( $vac['id'] );
		sssihms_ja_vac_back( 'Vacancy "' . $vac['title'] . '" moved to the trash.' );
	}
	update_post_meta( $vac['id'], '_vac_open', 'open' === $to ? 1 : 0 );
	sssihms_ja_vac_back( 'Vacancy "' . $vac['title'] . '" ' . ( 'open' === $to ? 'reopened' : 'closed' ) . '.' );
}

/** [sssihms_vacancies]: the whole "Current Vacancies" section, or nothing when none are open. */
add_shortcode( 'sssihms_vacancies', 'sssihms_ja_vac_render' );
function sssihms_ja_vac_render() {
	if ( ! sssihms_ja_is_target() ) {
		return '';
	}
	$cards = '';
	foreach ( sssihms_ja_vac_all() as $p ) {
		$vac = sssihms_ja_vac_get( $p->ID );
		if ( ! $vac ) {
			continue;
		}
		$flyer = '';
		if ( $vac['flyer'] && get_post( $vac['flyer'] ) ) {
			$url   = wp_get_attachment_url( $vac['flyer'] );
			$flyer = wp_attachment_is_image( $vac['flyer'] )
				? '<a class="vac-flyer" href="' . esc_url( $url ) . '" target="_blank" rel="noopener">' . wp_get_attachment_image( $vac['flyer'], 'medium_large', false, array( 'alt' => 'Flyer: ' . $vac['title'] ) ) . '</a>'
				: '<p><a class="vac-pdf" href="' . esc_url( $url ) . '" target="_blank" rel="noopener">View the flyer (PDF) →</a></p>';
		}
		$facts = array(
			'Number of posts' => $vac['posts'] ?? '',
			'Qualification'   => $vac['qual'] ?? '',
			'Experience'      => $vac['exp'] ?? '',
			'Last date'       => sssihms_ja_vac_date( $vac['last_date'] ?? '' ),
		);
		$dl = '';
		foreach ( array_filter( $facts, 'strlen' ) as $k => $val ) {
			$dl .= '<dt>' . esc_html( $k ) . '</dt><dd>' . nl2br( esc_html( $val ) ) . '</dd>';
		}
		$meta   = array_filter( array( sssihms_ja_categories()[ $vac['cat'] ] ?? '', $vac['dept'] ?? '' ), 'strlen' );
		$cards .= '<article class="vac-card">' . ( $flyer && wp_attachment_is_image( $vac['flyer'] ) ? $flyer : '' ) . '<div class="vac-body">'
			. '<p class="vac-meta">' . esc_html( implode( ' · ', $meta ) ) . '</p><h3>' . esc_html( $vac['title'] ) . '</h3>'
			. ( $dl ? '<dl>' . $dl . '</dl>' : '' ) . ( ! empty( $vac['details'] ) ? '<p class="vac-details">' . nl2br( esc_html( $vac['details'] ) ) . '</p>' : '' )
			. ( $flyer && ! wp_attachment_is_image( $vac['flyer'] ) ? $flyer : '' )
			. '<p class="vac-apply"><a class="btn btn-primary" href="' . esc_url( add_query_arg( 'vacancy', $vac['id'], home_url( '/careers/apply/' ) ) ) . '#job-application">Apply for this post →</a></p></div></article>';
	}
	if ( '' === $cards ) {
		return '';
	}
	return '<style>
.vac-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));gap:24px;margin-top:8px}
.vac-card{background:#fff;border:1px solid var(--border);border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
.vac-flyer img{display:block;width:100%;height:auto;border-bottom:1px solid var(--border)}
.vac-body{padding:20px 22px;display:flex;flex-direction:column;flex:1}
.vac-meta{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--primary-deep);margin:0 0 6px;font-weight:600}
.vac-card h3{font-family:var(--f-head);font-size:22px;color:var(--text);margin:0 0 12px}
.vac-card dl{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;margin:0 0 12px;font-size:15px}
.vac-card dt{color:var(--tm);font-weight:600}.vac-card dd{margin:0;color:var(--text)}
.vac-details{font-size:15px;color:var(--tm);line-height:1.7;margin:0 0 12px}
.vac-pdf{color:var(--primary);text-decoration:underline;font-weight:600}
.vac-apply{margin:auto 0 0;padding-top:8px}
</style><section class="section section-alt" id="vacancies"><div class="wrap"><span class="eyebrow">Now Recruiting</span><h2 class="section-title">Current Vacancies</h2><div class="vac-grid">' . $cards . '</div></div></section>';
}
