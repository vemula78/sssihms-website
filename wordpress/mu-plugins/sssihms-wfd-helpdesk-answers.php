<?php
/**
 * Plugin Name: SSSIHMS Whitefield — Help Desk Answers
 * Description: wp-admin search page for help-desk staff. Answers come word for word from the
 *              Markdown knowledge base; nothing is generated, so an answer can only be as right
 *              as the file it quotes.
 *
 * The knowledge-base files live outside the web root (SSSIHMS_KB_DIR) so they cannot be fetched
 * directly. Each file is split into passages — every "Common questions" pair and every section —
 * and ranked with BM25 plus a small synonym list. "To verify" sections are internal review notes
 * and are never shown. Questions are not stored: staff may type patient names into the box.
 */

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'SSSIHMS_KB_DIR' ) ) {
	define( 'SSSIHMS_KB_DIR', '/srv/www/kb/whitefield' );
}

/** Files that are about the knowledge base rather than the hospital. */
function sssihms_kb_skip_files() {
	return array( 'README.md', 'WEBSITE-ISSUES.md' );
}

/** Lower-cased word list; keeps Indic letters and their vowel signs together. */
function sssihms_kb_words( $text ) {
	$text = mb_strtolower( strip_tags( $text ) );
	preg_match_all( '/[\p{L}\p{M}\p{N}]+/u', $text, $m );
	return $m[0];
}

function sssihms_kb_stopwords() {
	static $s = null;
	if ( null === $s ) {
		$s = array_flip( explode( ' ', 'a an and are as at be by can could do does for from had has have how i if in into is it its me my of on or our should so than that the their them there these they this to was we were what when where which who why will with would you your there any also about am get got please tell know want need sir madam' ) );
	}
	return $s;
}

/** Light stemming so "surgeries", "surgery" and "operations", "operation" meet. */
function sssihms_kb_stem( $w ) {
	if ( ! preg_match( '/^[a-z]+$/', $w ) || strlen( $w ) < 4 ) {
		return $w;
	}
	foreach ( array( 'ies' => 'y', 'ing' => '', 'ed' => '', 'es' => '', 's' => '' ) as $suf => $rep ) {
		$n = strlen( $suf );
		if ( strlen( $w ) - $n >= 3 && substr( $w, -$n ) === $suf && ! ( 's' === $suf && 'ss' === substr( $w, -2 ) ) ) {
			return substr( $w, 0, -$n ) . $rep;
		}
	}
	return $w;
}

/** Help-desk words mapped to the words the knowledge base uses. */
function sssihms_kb_synonyms() {
	return array(
		'fee' => 'free charge cost', 'fees' => 'free charge cost', 'cost' => 'free charge', 'price' => 'free charge cost',
		'pay' => 'free charge', 'payment' => 'free charge', 'money' => 'free charge cost', 'charges' => 'free charge',
		'heart' => 'cardiology cardiac', 'bypass' => 'cabg', 'stent' => 'angioplasty', 'angioplasty' => 'stent',
		'brain' => 'neurosurgery', 'spine' => 'neurosurgery spinal', 'back' => 'spine lumbar', 'eye' => 'ophthalmology cataract',
		'eyes' => 'ophthalmology', 'cataract' => 'ophthalmology', 'delivery' => 'obstetrics caesarean', 'pregnancy' => 'obstetrics',
		'baby' => 'paediatric children', 'child' => 'paediatric children', 'kids' => 'children paediatric', 'pediatric' => 'paediatric',
		'knee' => 'orthopaedics replacement', 'hip' => 'orthopaedics replacement', 'bone' => 'orthopaedics', 'ear' => 'ent',
		'nose' => 'ent', 'throat' => 'ent', 'teeth' => 'dental', 'tooth' => 'dental',
		'timing' => 'timings hours time', 'timings' => 'hours time', 'hours' => 'timings time', 'open' => 'timings hours',
		'reach' => 'directions metro bus', 'directions' => 'reach metro', 'address' => 'contact location', 'location' => 'address directions',
		'phone' => 'contact number telephone', 'number' => 'contact phone telephone', 'call' => 'phone contact', 'email' => 'contact mail',
		'stay' => 'accommodation attendants', 'room' => 'accommodation', 'accommodation' => 'stay attendants', 'attendant' => 'attendants',
		'food' => 'canteen meals', 'canteen' => 'food', 'eat' => 'food canteen',
		'appointment' => 'registration opd', 'register' => 'registration', 'opd' => 'outpatient appointment',
		'documents' => 'bring reports', 'bring' => 'documents reports', 'emergency' => 'casualty', 'casualty' => 'emergency',
		'admission' => 'admit', 'admit' => 'admission', 'job' => 'careers vacancy', 'jobs' => 'careers vacancy', 'vacancy' => 'careers',
		'course' => 'programme admission', 'courses' => 'programmes', 'nursing' => 'nurse', 'donate' => 'donation', 'donation' => 'donate',
		'blood' => 'donation donor', 'volunteer' => 'sevadal seva', 'telemedicine' => 'teleconsultation', 'video' => 'telemedicine',
	);
}

/** Query words → weighted stems (synonyms count half). */
function sssihms_kb_query_terms( $q ) {
	$stop  = sssihms_kb_stopwords();
	$syn   = sssihms_kb_synonyms();
	$terms = array();
	foreach ( sssihms_kb_words( $q ) as $w ) {
		if ( isset( $stop[ $w ] ) ) {
			continue;
		}
		$terms[ sssihms_kb_stem( $w ) ] = 1.0;
		if ( isset( $syn[ $w ] ) ) {
			foreach ( explode( ' ', $syn[ $w ] ) as $s ) {
				$st = sssihms_kb_stem( $s );
				$terms[ $st ] = max( $terms[ $st ] ?? 0, 0.5 );
			}
		}
	}
	return $terms;
}

/** Splits one Markdown file into passages. */
function sssihms_kb_parse( $rel, $md ) {
	$lines  = preg_split( '/\R/', $md );
	$title  = ltrim( $lines[0] ?? '', '# ' );
	$source = '';
	foreach ( array_slice( $lines, 0, 6 ) as $l ) {
		if ( 0 === strpos( $l, 'Source:' ) && preg_match( '#https?://[^\s,)]+#', $l, $m ) ) {
			$source = $m[0];
		}
	}
	$out   = array();
	$sec   = '';
	$buf   = array();
	$inq   = false;
	$flush = function () use ( &$out, &$buf, &$sec, $rel, $title, $source ) {
		$body = trim( implode( "\n", $buf ) );
		if ( '' !== $body && '' !== $sec ) {
			$out[] = array( 'file' => $rel, 'title' => $title, 'source' => $source, 'head' => $sec, 'q' => '', 'body' => $body );
		}
		$buf = array();
	};
	$n = count( $lines );
	for ( $i = 1; $i < $n; $i++ ) {
		$l = $lines[ $i ];
		if ( preg_match( '/^(#{2,4})\s+(.*)$/', $l, $h ) ) {
			$flush();
			$sec = trim( $h[2] );
			$inq = ( 0 === stripos( $sec, 'Common questions' ) );
			continue;
		}
		if ( 0 === stripos( $sec, 'To verify' ) ) {
			continue; // Internal review notes; never shown.
		}
		// "**Question?**" then the answer on the same line or the following lines.
		if ( $inq && preg_match( '/^\*\*(.+?\?)\*\*\s*(.*)$/', $l, $qm ) ) {
			$ans = array();
			if ( '' !== trim( $qm[2] ) ) {
				$ans[] = trim( $qm[2] );
			}
			while ( $i + 1 < $n && ! preg_match( '/^(\*\*.+\?\*\*|#{2,4}\s)/', $lines[ $i + 1 ] ) ) {
				$ans[] = $lines[ ++$i ];
			}
			$a = trim( implode( "\n", $ans ) );
			if ( '' !== $a ) {
				$out[] = array( 'file' => $rel, 'title' => $title, 'source' => $source, 'head' => 'Common questions', 'q' => $qm[1], 'body' => $a );
			}
			continue;
		}
		if ( ! $inq ) {
			$buf[] = $l;
		}
	}
	$flush();
	return $out;
}

/** Builds the passage index from every .md file under $dir. */
function sssihms_kb_build( $dir ) {
	$stop = sssihms_kb_stopwords();
	$docs = array();
	$it   = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $dir, FilesystemIterator::SKIP_DOTS ) );
	$files = array();
	foreach ( $it as $f ) {
		if ( 'md' === strtolower( $f->getExtension() ) && ! in_array( $f->getFilename(), sssihms_kb_skip_files(), true ) ) {
			$files[] = $f->getPathname();
		}
	}
	sort( $files );
	foreach ( $files as $path ) {
		$rel = ltrim( substr( $path, strlen( rtrim( $dir, '/' ) ) ), '/' );
		foreach ( sssihms_kb_parse( $rel, file_get_contents( $path ) ) as $p ) {
			// Question words count three times, headings twice, the file title once more.
			$text = str_repeat( ' ' . $p['q'], 3 ) . str_repeat( ' ' . $p['head'], 2 ) . ' ' . $p['title'] . ' ' . $p['body'];
			$tf   = array();
			foreach ( sssihms_kb_words( $text ) as $w ) {
				if ( ! isset( $stop[ $w ] ) ) {
					$s        = sssihms_kb_stem( $w );
					$tf[ $s ] = ( $tf[ $s ] ?? 0 ) + 1;
				}
			}
			$p['tf']  = $tf;
			$p['len'] = array_sum( $tf );
			$docs[]   = $p;
		}
	}
	$df = array();
	foreach ( $docs as $d ) {
		foreach ( $d['tf'] as $t => $c ) {
			$df[ $t ] = ( $df[ $t ] ?? 0 ) + 1;
		}
	}
	$avg = $docs ? array_sum( array_column( $docs, 'len' ) ) / count( $docs ) : 1;
	return array( 'docs' => $docs, 'df' => $df, 'avg' => $avg, 'files' => count( $files ) );
}

/** BM25 ranking; returns up to $k passages with their score. */
function sssihms_kb_search( $index, $q, $k = 3 ) {
	$terms = sssihms_kb_query_terms( $q );
	if ( ! $terms ) {
		return array();
	}
	$N      = count( $index['docs'] );
	$scores = array();
	foreach ( $index['docs'] as $i => $d ) {
		$s   = 0.0;
		$hit = 0;
		foreach ( $terms as $t => $wt ) {
			if ( empty( $d['tf'][ $t ] ) ) {
				continue;
			}
			$tf  = $d['tf'][ $t ];
			$idf = log( 1 + ( $N - $index['df'][ $t ] + 0.5 ) / ( $index['df'][ $t ] + 0.5 ) );
			$s  += $wt * $idf * ( $tf * 2.2 ) / ( $tf + 1.2 * ( 0.25 + 0.75 * $d['len'] / $index['avg'] ) );
			$hit += ( 1.0 === $wt ) ? 1 : 0;
		}
		if ( $s > 0 ) {
			// Prefer a ready-made answer when it covers the question as well as a section does.
			$scores[ $i ] = $s * ( '' !== $d['q'] ? 1.15 : 1.0 ) * ( 1 + 0.1 * $hit );
		}
	}
	// A question typed in an Indian script: Kannada and Telugu join words together, so exact
	// word matches are rare. Put that language's patient-information section first.
	foreach ( array( 'Kannada' => '\x{0C80}-\x{0CFF}', 'Telugu' => '\x{0C00}-\x{0C7F}', 'Hindi' => '\x{0900}-\x{097F}', 'Bengali' => '\x{0980}-\x{09FF}' ) as $lang => $range ) {
		if ( preg_match( '/[' . $range . ']/u', $q ) ) {
			foreach ( $index['docs'] as $i => $d ) {
				if ( 0 === strpos( $d['head'], $lang ) ) {
					$scores[ $i ] = max( $scores ? max( $scores ) : 0, 3.0 ) + 1;
				}
			}
			break;
		}
	}
	arsort( $scores );
	$out = array();
	foreach ( array_slice( $scores, 0, $k, true ) as $i => $s ) {
		$out[] = $index['docs'][ $i ] + array( 'score' => $s );
	}
	return $out;
}

/** Minimal Markdown → HTML for the answer cards: headings, bold, italics, links, lists, tables. */
function sssihms_kb_md_html( $md ) {
	$inline = function ( $t ) {
		$t = htmlspecialchars( $t, ENT_QUOTES, 'UTF-8' );
		$t = preg_replace( '/\*\*(.+?)\*\*/u', '<strong>$1</strong>', $t );
		$t = preg_replace( '/(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])/u', '<em>$1</em>', $t );
		$t = preg_replace( '/`([^`]+)`/', '<code>$1</code>', $t );
		$t = preg_replace( '#\[([^\]]+)\]\((https?://[^)\s]+)\)#', '<a href="$2" target="_blank" rel="noopener">$1</a>', $t );
		return preg_replace( '#(?<!["=>])(https?://[^\s<,)]+)#', '<a href="$1" target="_blank" rel="noopener">$1</a>', $t );
	};
	$html  = '';
	$list  = '';
	$table = array();
	$close = function () use ( &$html, &$list, &$table, $inline ) {
		if ( $list ) {
			$html .= "</$list>";
			$list  = '';
		}
		if ( $table ) {
			$html .= '<table class="widefat striped kb-t">';
			foreach ( $table as $r => $cells ) {
				$tag   = 0 === $r ? 'th' : 'td';
				$html .= '<tr>' . implode( '', array_map( fn( $c ) => "<$tag>" . $inline( trim( $c ) ) . "</$tag>", $cells ) ) . '</tr>';
			}
			$html .= '</table>';
			$table = array();
		}
	};
	foreach ( preg_split( '/\R/', $md ) as $l ) {
		if ( preg_match( '/^\s*\|(.*)\|\s*$/', $l, $m ) ) {
			if ( ! preg_match( '/^[\s|:-]+$/', $m[1] ) ) {
				$table[] = explode( '|', $m[1] );
			}
			continue;
		}
		if ( preg_match( '/^\s*(?:[-*]|(\d+)\.)\s+(.*)$/', $l, $m ) ) {
			$want = '' !== $m[1] ? 'ol' : 'ul';
			if ( $list !== $want ) {
				$close();
				$html .= "<$want>";
				$list  = $want;
			}
			$html .= '<li>' . $inline( $m[2] ) . '</li>';
			continue;
		}
		$close();
		if ( preg_match( '/^#{2,6}\s+(.*)$/', $l, $m ) ) {
			$html .= '<h4>' . $inline( $m[1] ) . '</h4>';
		} elseif ( '' !== trim( $l ) ) {
			$html .= '<p>' . $inline( $l ) . '</p>';
		}
	}
	$close();
	return $html;
}

/* ---------------------------------------------------------------- WordPress */

if ( function_exists( 'add_action' ) ) {

	function sssihms_kb_index() {
		if ( ! is_dir( SSSIHMS_KB_DIR ) ) {
			return null;
		}
		// Rebuild whenever any file changes; the key covers names, sizes and times.
		$sig = '';
		foreach ( new RecursiveIteratorIterator( new RecursiveDirectoryIterator( SSSIHMS_KB_DIR, FilesystemIterator::SKIP_DOTS ) ) as $f ) {
			$sig .= $f->getPathname() . $f->getSize() . $f->getMTime();
		}
		$key   = 'sssihms_kb_' . md5( $sig );
		$index = get_transient( $key );
		if ( false === $index ) {
			$index = sssihms_kb_build( SSSIHMS_KB_DIR );
			set_transient( $key, $index, DAY_IN_SECONDS );
		}
		return $index;
	}

	add_action( 'admin_menu', function () {
		if ( 4 !== get_current_blog_id() ) {
			return;
		}
		add_menu_page( 'Help Desk Answers', 'Help Desk Answers', 'read', 'sssihms-helpdesk', 'sssihms_kb_page', 'dashicons-format-chat', 3 );
	} );

	function sssihms_kb_page() {
		$q     = isset( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '';
		$index = sssihms_kb_index();
		echo '<div class="wrap"><h1>Help Desk Answers</h1>';
		echo '<style>.kb-card{background:#fff;border:1px solid #dcdcde;border-left:4px solid #DC7C24;padding:12px 16px;margin:14px 0;max-width:900px}.kb-card h3{margin:0 0 4px}.kb-meta{color:#646970;font-size:12px;margin-bottom:8px}.kb-t{max-width:860px;margin:8px 0}.kb-q{font-size:16px;padding:6px 10px;width:min(640px,100%)}</style>';
		if ( ! $index ) {
			echo '<div class="notice notice-error"><p>The knowledge base folder is missing on the server. Please tell the web team.</p></div></div>';
			return;
		}
		echo '<p>Type a question the way a caller would ask it, e.g. <em>Is treatment free?</em>, <em>How do I reach by Metro?</em>, <em>Do you do knee replacement?</em> Answers are taken word for word from the hospital knowledge base. If none fits, do not guess. Check with your supervisor.</p>';
		echo '<form method="get"><input type="hidden" name="page" value="sssihms-helpdesk" /><input class="kb-q" type="search" name="q" value="' . esc_attr( $q ) . '" placeholder="Ask a question…" autofocus /> <button class="button button-primary">Find answer</button></form>';
		if ( '' !== $q ) {
			$hits = sssihms_kb_search( $index, $q, 3 );
			if ( ! $hits || $hits[0]['score'] < 3.0 ) {
				echo '<div class="notice notice-warning inline"><p>No reliable answer found in the knowledge base. Try other words, or check with your supervisor.</p></div>';
			} else {
				foreach ( $hits as $i => $h ) {
					if ( $i > 0 && $h['score'] < 0.45 * $hits[0]['score'] ) {
						break; // Far weaker than the best match; showing it would mislead.
					}
					echo '<div class="kb-card"><h3>' . esc_html( '' !== $h['q'] ? $h['q'] : $h['head'] ) . '</h3>';
					echo '<div class="kb-meta">' . esc_html( $h['title'] ) . ' · ' . esc_html( $h['file'] );
					if ( $h['source'] ) {
						echo ' · <a href="' . esc_url( $h['source'] ) . '" target="_blank" rel="noopener">website page</a>';
					}
					echo '</div>' . wp_kses_post( sssihms_kb_md_html( $h['body'] ) ) . '</div>';
				}
			}
		}
		echo '<p class="description">' . (int) $index['files'] . ' files, ' . count( $index['docs'] ) . ' answers indexed. Questions typed here are not saved.</p></div>';
	}
}
