/* Patient feedback portal form: OTP steps, voice recorder and submission, for
   [sssihms_feedback_portal] in sssihms-wfd-feedback-portal.php. The server repeats every check. */
(function () {
	var root = document.getElementById('fbp');
	if (!root || !window.fetch || !window.FormData) return;
	var cfg = JSON.parse(root.getAttribute('data-cfg')), S = cfg.s;
	var $ = function (id) { return document.getElementById(id); };
	var f = $('fbp-form'), main = $('fbp-main'), om = $('fbp-otp-msg'), am = $('fbp-audio-msg');
	var t0 = Date.now(), phone = '', verified = false, audio = null, audioSecs = 0;
	f.hidden = false;

	function api(path, body, isForm) {
		var h = {};
		if (cfg.nonce) h['X-WP-Nonce'] = cfg.nonce;
		if (body && !isForm) { h['Content-Type'] = 'application/json'; body = JSON.stringify(body); }
		return fetch(cfg.rest + path, { method: body ? 'POST' : 'GET', headers: h, body: body || undefined, credentials: 'same-origin' })
			.then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._ok = r.ok; return j; }); })
			.catch(function () { return { _ok: false, message: S.net }; });
	}
	function say(el, text, bad) { el.textContent = text || ''; el.className = 'fa-note' + (bad ? ' fbp-bad' : ''); }
	function busy(btn, on, label) { btn.disabled = on; if (label) btn.textContent = label; }
	function norm(p) { p = p.replace(/[\s().-]/g, ''); return p.replace(/^(\+?91|0)(?=\d{10}$)/, ''); }
	function assisted() { var a = $('fbp-assisted'); return !!(a && a.checked); }
	function syncMain() { main.disabled = !(verified || assisted()); }

	/* Step 1: mobile number and OTP */
	function setVerified(masked) {
		verified = true;
		$('fbp-otp').hidden = true;
		$('fbp-ok').hidden = false;
		$('fbp-ok').querySelector('span').textContent = '✓ ' + S.verified.replace('%s', masked);
		say(om, '');
		syncMain();
	}
	function send() {
		var p = norm($('fbp-phone').value), b = $('fbp-send');
		if (!/^[6-9]\d{9}$/.test(p)) { say(om, S.bad_phone, true); $('fbp-phone').focus(); return; }
		busy(b, true, S.sending);
		api('otp', { phone: p }).then(function (j) {
			busy(b, false, S.send);
			if (!j._ok) { say(om, j.message || S.net, true); return; }
			phone = p;
			$('fbp-codebox').hidden = false;
			$('fbp-code').value = '';
			$('fbp-code').focus();
			say(om, S.sent.replace('%s', j.masked) + (j.test_code ? ' ' + S.test_code.replace('%s', j.test_code) : ''));
		});
	}
	function verify() {
		var c = $('fbp-code').value.replace(/\D/g, ''), b = $('fbp-verify');
		if (c.length !== 6) { say(om, S.bad_code, true); $('fbp-code').focus(); return; }
		busy(b, true);
		api('otp/verify', { phone: phone, code: c }).then(function (j) {
			busy(b, false);
			if (!j._ok) { say(om, j.message || S.net, true); return; }
			setVerified(j.masked);
		});
	}
	$('fbp-send').addEventListener('click', send);
	$('fbp-resend').addEventListener('click', send);
	$('fbp-verify').addEventListener('click', verify);
	$('fbp-phone').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); send(); } });
	$('fbp-code').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); verify(); } });
	$('fbp-change').addEventListener('click', function () {
		verified = false;
		$('fbp-ok').hidden = true;
		$('fbp-otp').hidden = false;
		$('fbp-codebox').hidden = true;
		$('fbp-phone').value = '';
		$('fbp-phone').focus();
		syncMain();
	});
	// A number verified in the last 24 hours needs no new OTP.
	api('otp/status').then(function (j) { if (j._ok && j.verified) setVerified(j.masked); });

	/* Staff: assisted entry skips the OTP */
	var ast = $('fbp-assisted');
	if (ast) {
		var consentText = $('fbp-consent-text').textContent;
		ast.addEventListener('change', function () {
			$('fbp-assisted-more').hidden = !ast.checked;
			$('fbp-otp').hidden = ast.checked || verified;
			$('fbp-consent-text').textContent = ast.checked ? 'I have read this notice out to the patient or attendant, and they agree.' : consentText;
			syncMain();
		});
	}

	/* Location from the QR code (?src=…) */
	var src = (new URLSearchParams(location.search).get('src') || '').toLowerCase(), sel = $('fbp-src');
	if (/^[a-z0-9-]{1,40}$/.test(src)) {
		if (!sel.querySelector('option[value="' + src + '"]')) sel.add(new Option(src, src));
		sel.value = src;
	}

	/* Voice recording, in the browser (no app) */
	var mr = null, chunks = [], timer = null, started = 0, stream = null;
	var canRec = !!(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
	function clock(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
	function ui(state) {
		$('fbp-rec').hidden = state !== 'idle';
		$('fbp-stop').hidden = state !== 'rec';
		$('fbp-play').hidden = state !== 'done';
		$('fbp-again').hidden = state !== 'done';
		$('fbp-remove').hidden = state !== 'done';
		if (state !== 'rec') $('fbp-clock').textContent = state === 'done' ? clock(audioSecs) : '';
	}
	function pickType() {
		var t = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'];
		for (var i = 0; i < t.length; i++) if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t[i])) return t[i];
		return '';
	}
	function stopRec() { if (mr && mr.state === 'recording') mr.stop(); }
	function startRec() {
		say(am, '');
		navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
			var type = pickType(), opts = { audioBitsPerSecond: 48000 };
			if (type) opts.mimeType = type;
			stream = s;
			chunks = [];
			mr = new MediaRecorder(s, opts);
			mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
			mr.onstop = function () {
				clearInterval(timer);
				stream.getTracks().forEach(function (tr) { tr.stop(); });
				audio = new Blob(chunks, { type: (mr.mimeType || type || 'audio/webm').split(';')[0] });
				audioSecs = Math.max(1, Math.round((Date.now() - started) / 1000));
				$('fbp-play').src = URL.createObjectURL(audio);
				ui('done');
			};
			mr.start(1000);
			started = Date.now();
			ui('rec');
			timer = setInterval(function () {
				var s = Math.floor((Date.now() - started) / 1000);
				$('fbp-clock').textContent = S.recording + ' ' + clock(s) + ' / ' + clock(cfg.max);
				if (s >= cfg.max) stopRec();
			}, 250);
		}).catch(function () { say(am, S.mic_denied, true); });
	}
	function clearRec() {
		audio = null;
		audioSecs = 0;
		$('fbp-play').removeAttribute('src');
		ui('idle');
	}
	if (canRec) {
		$('fbp-rec').addEventListener('click', startRec);
		$('fbp-stop').addEventListener('click', stopRec);
		$('fbp-again').addEventListener('click', function () { clearRec(); startRec(); });
		$('fbp-remove').addEventListener('click', clearRec);
		ui('idle');
	} else {
		$('fbp-audio-ui').hidden = true;
		say(am, S.mic_no);
	}

	/* Submit */
	function showErrors(list) {
		var box = $('fbp-errors'), ul = document.createElement('ul'), h = document.createElement('strong');
		h.textContent = S.fix;
		list.forEach(function (m) { var li = document.createElement('li'); li.textContent = m; ul.appendChild(li); });
		box.innerHTML = '';
		box.appendChild(h);
		box.appendChild(ul);
		box.hidden = false;
		box.focus();
	}
	// The error list describes the last attempt only; clear it once the patient makes changes.
	['input', 'change'].forEach(function (ev) { main.addEventListener(ev, function () { $('fbp-errors').hidden = true; }); });
	f.addEventListener('submit', function (e) {
		e.preventDefault();
		var errs = [], email = $('fbp-email').value.trim(), b = $('fbp-submit');
		if (!verified && !assisted()) errs.push(S.need_verify);
		if (!f.querySelector('input[name=category]:checked')) errs.push(S.need_cat);
		if (!$('fbp-patient').value.trim()) errs.push(S.need_patient);
		if (mr && mr.state === 'recording') errs.push(S.stop_first);
		else if (!$('fbp-text').value.trim() && !audio) errs.push(S.need_text);
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push(S.bad_email);
		if (!$('fbp-consent').checked) errs.push(S.need_consent);
		if (errs.length) { showErrors(errs); return; }
		$('fbp-errors').hidden = true;
		var fd = new FormData(f);
		fd.append('t', Math.round((Date.now() - t0) / 1000));
		if (audio) {
			fd.append('audio', audio, 'voice.' + (/mp4|m4a|aac/.test(audio.type) ? 'm4a' : /ogg/.test(audio.type) ? 'ogg' : 'webm'));
			fd.append('audio_secs', audioSecs);
		}
		busy(b, true, S.submitting);
		api('submit', fd, true).then(function (j) {
			busy(b, false, S.submit);
			if (!j._ok) { showErrors(j.errors || [j.message || S.net]); return; }
			var d = $('fbp-done'), h = document.createElement('h3'), p = document.createElement('p'), p2 = document.createElement('p'), again = document.createElement('a');
			h.textContent = S.thanks_h;
			p.textContent = S.thanks.replace('%1$s', j.ticket).replace('%2$s', j.days);
			p2.textContent = j.sms ? S.thanks_sms : S.thanks_keep;
			again.href = location.href;
			again.textContent = S.another;
			d.innerHTML = '';
			[h, p, p2, again].forEach(function (n) { d.appendChild(n); });
			f.hidden = true;
			d.hidden = false;
			d.focus();
			d.scrollIntoView({ block: 'center' });
		});
	});
})();
