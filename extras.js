// Easter eggs + boarding-pass entrance. Progressive enhancement only:
// everything here is injected by JS; the site works fully without it.
(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
    };

    // ---- Avatar sunglasses -----------------------------------------------
    const SHADES_SVG =
        '<svg id="shades" viewBox="0 0 120 34" aria-hidden="true">'
        + '<g fill="#14181d">'
        + '<rect x="1" y="2" width="118" height="5" rx="2.5"/>'
        + '<rect x="49" y="5" width="22" height="5"/>'
        + '<rect x="7" y="4" width="45" height="23" rx="9"/>'
        + '<rect x="68" y="4" width="45" height="23" rx="9"/>'
        + '</g>'
        + '<rect x="14" y="9" width="13" height="4" rx="2" fill="rgba(255,255,255,0.28)" transform="rotate(-8 20 11)"/>'
        + '<rect x="75" y="9" width="13" height="4" rx="2" fill="rgba(255,255,255,0.28)" transform="rotate(-8 81 11)"/>'
        + '</svg>';

    const avatar = document.querySelector('.avatar');
    if (avatar) {
        const wrap = document.createElement('span');
        wrap.className = 'avatar-wrap';
        avatar.parentNode.insertBefore(wrap, avatar);
        wrap.appendChild(avatar);
        wrap.title = 'Deal with it';

        const setShades = on => {
            const cur = wrap.querySelector('#shades');
            if (on && !cur) wrap.insertAdjacentHTML('beforeend', SHADES_SVG);
            else if (!on && cur) cur.remove();
            store.set('shades', on ? '1' : '0');
        };
        let shadesOn = store.get('shades') === '1';
        if (shadesOn) setShades(true);
        wrap.addEventListener('click', () => {
            shadesOn = !shadesOn;
            setShades(shadesOn);
        });
    }

    // ---- Konami code: stamp-pulse the map + confetti ----------------------
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let kIdx = 0;
    addEventListener('keydown', e => {
        const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        kIdx = k === KONAMI[kIdx] ? kIdx + 1 : (k === KONAMI[0] ? 1 : 0);
        if (kIdx === KONAMI.length) {
            kIdx = 0;
            konami();
        }
    });

    function konami() {
        const map = document.getElementById('world-map');
        const marks = map ? map.querySelectorAll('.visited, .visited-dot') : [];
        if (reduced) {
            // No-motion fallback: brief gold flash of the visited countries.
            if (map) {
                map.classList.add('konami-flash');
                setTimeout(() => map.classList.remove('konami-flash'), 700);
            }
            return;
        }
        marks.forEach((el, i) => {
            el.classList.remove('konami-pop');
            void el.getBoundingClientRect(); // reflow so the animation re-triggers
            el.style.setProperty('--kd', (i * 45) + 'ms');
            el.classList.add('konami-pop');
            el.addEventListener('animationend',
                () => el.classList.remove('konami-pop'), { once: true });
        });
        confetti();
    }

    function confetti() {
        const COLORS = ['#d95f4b', '#1d5fd6', '#d7b56d'];
        const frag = document.createDocumentFragment();
        const bits = [];
        for (let i = 0; i < 42; i++) {
            const d = document.createElement('div');
            d.className = 'confetti';
            d.style.left = (Math.random() * 100) + 'vw';
            d.style.background = COLORS[i % COLORS.length];
            if (Math.random() < 0.5) d.style.width = '6px';
            d.style.setProperty('--cfx', (Math.random() * 180 - 90).toFixed(0) + 'px');
            d.style.setProperty('--cfr', (360 + Math.random() * 540).toFixed(0) + 'deg');
            d.style.setProperty('--cfd', (1.7 + Math.random() * 1.1).toFixed(2) + 's');
            d.style.setProperty('--cfdelay', (Math.random() * 0.4).toFixed(2) + 's');
            frag.appendChild(d);
            bits.push(d);
        }
        document.body.appendChild(frag);
        setTimeout(() => bits.forEach(b => b.remove()), 3200);
    }

    // ---- Boarding-pass entrance (first visit only; ?boarding=1 forces) ----
    const forceBoarding = new URLSearchParams(location.search).has('boarding');
    if (forceBoarding || store.get('boarded') !== '1') {
        store.set('boarded', '1');
        const ov = document.createElement('div');
        ov.id = 'boarding';
        ov.innerHTML =
            '<div class="bpass" role="dialog" aria-label="Boarding pass">'
            + '<div class="bp-half bp-main">'
            + '<div class="bp-head">BOARDING PASS</div>'
            + '<div class="bp-name">SATHIANATHEN/STEFAN</div>'
            + '<div class="bp-grid">'
            + '<span>FLIGHT<b>SS-2026</b></span>'
            + '<span>GATE<b>42</b></span>'
            + '<span>SEAT<b>&#8734;</b></span>'
            + '</div>'
            + '<div class="bp-dest">DEST: EVERYWHERE</div>'
            + '</div>'
            + '<div class="bp-half bp-stub">'
            + '<div class="bp-stub-head">SS-2026 &middot; 42</div>'
            + '<div class="bp-barcode"></div>'
            + '<div class="bp-skip">tap to board</div>'
            + '</div>'
            + '</div>';
        document.body.appendChild(ov);

        let done = false;
        const dismiss = () => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            removeEventListener('keydown', dismiss, true);
            if (reduced) { ov.remove(); return; }
            ov.classList.add('tear');
            setTimeout(() => ov.remove(), 700);
        };
        const timer = setTimeout(dismiss, 1200);
        ov.addEventListener('click', dismiss);
        addEventListener('keydown', dismiss, true);
    }
})();

// Rotating fun facts under the stats ticker.
(() => {
    const FACTS = [
        '7/7 continents — one through the window \u2744',
        '50 countries \u00b7 26% of the world',
        'do-not-travel bingo: 1 of 21 (thanks, Iran)',
        'crossed the equator 20 times',
        'smallest: Monaco (2 km\u00b2) \u00b7 newest: Kosovo (b. 2008)',
    ];
    const el = document.getElementById('fun-fact');
    if (!el) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0;
    el.textContent = FACTS[0];
    setInterval(() => {
        i = (i + 1) % FACTS.length;
        if (reduced) { el.textContent = FACTS[i]; return; }
        el.classList.add('fade');
        setTimeout(() => { el.textContent = FACTS[i]; el.classList.remove('fade'); }, 350);
    }, 5000);
})();
