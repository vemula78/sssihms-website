/*!
 * Vahini reader — chapter navigation.
 *
 * The reader draws a Contents panel of chapter buttons ("07 Thou art That…") which
 * close the panel and do nothing else. Every chapter is in the document with an id
 * (ch-1 … ch-73) and the page is one long scroll — Prema Vahini is 92,000px tall —
 * so without this a reader can only reach chapter 73 by scrolling to it.
 *
 * Purely additive: a bubble-phase listener that scrolls after the reader's own
 * handler has run and closed the panel. It never calls preventDefault, so nothing
 * the reader already does is altered.
 */
(function () {
	'use strict';

	function chapterFromButton( el ) {
		var txt = ( el.textContent || '' ).replace( /\s+/g, ' ' ).trim();
		var m = txt.match( /^(\d{1,3})\s/ );
		if ( ! m ) {
			return null;
		}
		return document.getElementById( 'ch-' + parseInt( m[ 1 ], 10 ) );
	}

	document.addEventListener(
		'click',
		function ( ev ) {
			var btn = ev.target && ev.target.closest ? ev.target.closest( 'button' ) : null;
			if ( ! btn ) {
				return;
			}
			var target = chapterFromButton( btn );
			if ( ! target ) {
				return;
			}
			// Let the reader close its panel first, then move to the chapter.
			// These books keep growing as images and later chapters lay out, which
			// pushes the target down after the jump — the bigger the book, the further
			// out you land. So re-seat a few times until the position stops moving.
			var settle = [ 60, 300, 700, 1300, 2200, 3500, 5000, 7000 ];
			settle.forEach( function ( delay ) {
				setTimeout( function () {
					try {
						if ( Math.abs( target.getBoundingClientRect().top ) < 4 ) {
							return;
						}
						target.scrollIntoView( { behavior: 'auto', block: 'start' } );
					} catch ( e ) {}
				}, delay );
			} );

			setTimeout( function () {
				try {
					// Instant, not smooth: these books are enormous — Bhagavatha Vahini's
					// last chapter is 204,000px down, and a smooth scroll over that
					// distance never practically arrives. A chapter jump should behave
					// like an ordinary anchor.
					target.scrollIntoView( { behavior: 'auto', block: 'start' } );
					// Make the landing spot focusable for keyboard and screen-reader users.
					if ( ! target.hasAttribute( 'tabindex' ) ) {
						target.setAttribute( 'tabindex', '-1' );
					}
					target.focus( { preventScroll: true } );
				} catch ( e ) {
					try {
						target.scrollIntoView();
					} catch ( e2 ) {}
				}
			}, 60 );
		},
		false
	);
})();
