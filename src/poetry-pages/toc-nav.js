/*!
 * Poetry page table-of-contents navigation.
 *
 * The page body is rendered by the bundled prototype component, which draws the
 * contents list as <a class="dp-toc-link" data-n="7" data-i="6"> with NO href and
 * no click handler — so all 132 / 51 / 717 entries were inert. Every poem does
 * carry an id (dp-p-N), so the list only needed wiring up.
 *
 * Adding a real href (rather than a JS-only scroll) keeps the entries keyboard
 * focusable, middle-clickable and copyable, and lets the browser do the scrolling.
 *
 * Safe to load twice; it marks what it has wired.
 */
(function () {
	'use strict';

	function wire() {
		var links = document.querySelectorAll( 'a.dp-toc-link' );
		if ( ! links.length ) {
			return false;
		}

		// Numbering can skip (Padya Sudha lists 717 poems but ids run to dp-p-718),
		// so resolve by data-n first and fall back to position.
		var poems = document.querySelectorAll( 'article.dp-poem' );
		var wired = 0;

		Array.prototype.forEach.call( links, function ( a ) {
			if ( a.getAttribute( 'data-toc-wired' ) ) {
				return;
			}
			var n = a.getAttribute( 'data-n' );
			var i = parseInt( a.getAttribute( 'data-i' ), 10 );
			var target = n ? document.getElementById( 'dp-p-' + n ) : null;
			if ( ! target && ! isNaN( i ) && poems[ i ] ) {
				target = poems[ i ];
			}
			if ( ! target ) {
				return;
			}
			if ( ! target.id ) {
				target.id = 'dp-poem-' + ( i + 1 );
			}
			a.setAttribute( 'href', '#' + target.id );
			a.setAttribute( 'data-toc-wired', '1' );
			wired++;

			a.addEventListener( 'click', function () {
				var cur = document.querySelector( 'a.dp-toc-link.active' );
				if ( cur ) {
					cur.classList.remove( 'active' );
				}
				a.classList.add( 'active' );
			} );
		} );

		if ( ! wired ) {
			return false;
		}

		// Keep the contents list in step with what the reader is actually looking at.
		if ( window.IntersectionObserver && poems.length ) {
			var byId = {};
			Array.prototype.forEach.call( links, function ( a ) {
				var h = a.getAttribute( 'href' );
				if ( h ) {
					byId[ h.slice( 1 ) ] = a;
				}
			} );
			var io = new IntersectionObserver(
				function ( entries ) {
					entries.forEach( function ( e ) {
						if ( ! e.isIntersecting ) {
							return;
						}
						var a = byId[ e.target.id ];
						if ( ! a || a.classList.contains( 'active' ) ) {
							return;
						}
						var cur = document.querySelector( 'a.dp-toc-link.active' );
						if ( cur ) {
							cur.classList.remove( 'active' );
						}
						a.classList.add( 'active' );
					} );
				},
				{ rootMargin: '-45% 0px -50% 0px' }
			);
			Array.prototype.forEach.call( poems, function ( p ) {
				if ( p.id ) {
					io.observe( p );
				}
			} );
		}

		return true;
	}

	// The list is drawn by JS after load, so poll briefly rather than racing it.
	var tries = 0;
	( function attempt() {
		if ( wire() ) {
			return;
		}
		if ( ++tries < 60 ) {
			setTimeout( attempt, 250 );
		}
	} )();
})();
