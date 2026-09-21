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

	/**
	 * These pages carry no links at all, so a reader who arrives from the menu has no
	 * way back into the site — the same trap the Vahini readers had. Prepend a slim
	 * bar matching the reader chrome.
	 */
	function backBar() {
		// The observer can fire while the document is still parsing, when there is no
		// body to insert into yet.
		if ( ! document.body || document.querySelector( '.ssp-topbar' ) ) {
			return;
		}
		var titles = {
			'divine-poetry': 'Divine Poetry',
			'sai-compositions': 'Sri Sathya Sai Compositions',
			'padya-sudha': 'Sri Sathya Sai Padya Sudha'
		};
		var slug = ( location.pathname.split( '/' ).pop() || '' ).replace( /\.html$/, '' );
		var here = titles[ slug ] || document.title.replace( /\s*—.*$/, '' );

		var css = document.createElement( 'style' );
		css.textContent =
			'.ssp-topbar{position:sticky;top:0;z-index:99999;background:#2c1a0e;color:#f0d5b0;' +
			'font:600 13px/1.2 "Nunito Sans",system-ui,sans-serif;display:flex;align-items:center;' +
			'gap:14px;flex-wrap:wrap;padding:10px 16px;box-shadow:0 1px 8px rgba(0,0,0,.25)}' +
			'.ssp-topbar a{color:#f0d5b0;text-decoration:none;display:inline-flex;align-items:center;min-height:32px}' +
			'.ssp-topbar a:hover{text-decoration:underline}' +
			'.ssp-topbar a:focus-visible{outline:3px solid #e8a95f;outline-offset:2px;border-radius:3px}' +
			'.ssp-topbar .ssp-here{margin-left:auto;opacity:.72;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:11px}' +
			'@media print{.ssp-topbar{display:none}}';
		document.head.appendChild( css );

		var bar = document.createElement( 'nav' );
		bar.className = 'ssp-topbar';
		bar.setAttribute( 'aria-label', 'Site navigation' );
		bar.innerHTML =
			'<a href="/">\u2190 SSSIHMS</a>' +
			'<a href="/about-hospital/bhagawan/">Bhagawan</a>' +
			'<a href="/poems/">Songs &amp; Poems</a>' +
			'<span class="ssp-here">' + here.replace( /[<>&]/g, '' ) + '</span>';
		document.body.insertBefore( bar, document.body.firstChild );
	}

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

	// The list is drawn by the bundle after load, and Padya Sudha renders 717 poems,
	// which can take well over the 15s a bounded poll allowed — it gave up and left the
	// index dead. Watch the DOM instead, and keep watching: the bundle can also
	// re-render, which would drop the hrefs again.
	function run() {
		try {
			backBar();
		} catch ( e ) {
			/* the bar is a convenience; never let it block the contents list */
		}
		try {
			wire();
		} catch ( e2 ) {
			/* ignore */
		}
	}

	if ( document.readyState !== 'loading' ) {
		run();
	} else {
		document.addEventListener( 'DOMContentLoaded', run );
	}
	window.addEventListener( 'load', run );

	if ( window.MutationObserver ) {
		var scheduled = false;
		var obs = new MutationObserver( function () {
			if ( scheduled ) {
				return;
			}
			scheduled = true;
			setTimeout( function () {
				scheduled = false;
				run();
			}, 150 );
		} );
		obs.observe( document.documentElement, { childList: true, subtree: true } );
	} else {
		var tries = 0;
		( function attempt() {
			run();
			if ( ++tries < 240 ) {
				setTimeout( attempt, 250 );
			}
		} )();
	}
})();
