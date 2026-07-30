// World map of visited countries, colored from the flight log.
(() => {
    const VISITED = [
        { code: 'SG', name: 'Singapore', date: '2008' },
        { code: 'AU', name: 'Australia', date: 'JUN 2017' },
        { code: 'NZ', name: 'New Zealand', date: 'JUN 2017' },
        { code: 'US', name: 'USA', date: 'JUN 2017' },
        { code: 'IS', name: 'Iceland', date: '2017' },
        { code: 'CA', name: 'Canada', date: 'JUN 2019' },
        { code: 'HK', name: 'Hong Kong', date: 'OCT 2021' },
        { code: 'DE', name: 'Germany', date: 'DEC 2021' },
        { code: 'AE', name: 'UAE', date: 'DEC 2021' },
        { code: 'NL', name: 'Netherlands', date: 'JUN 2022' },
        { code: 'TR', name: 'Turkey', date: 'JUN 2022' },
        { code: 'AZ', name: 'Azerbaijan', date: 'JUN 2022' },
        { code: 'ES', name: 'Spain', date: 'JUN 2022' },
        { code: 'CH', name: 'Switzerland', date: 'JUN 2022' },
        { code: 'FR', name: 'France', date: 'OCT 2022' },
        { code: 'MA', name: 'Morocco', date: 'OCT 2022' },
        { code: 'IT', name: 'Italy', date: 'JUN 2023' },
        { code: 'PT', name: 'Portugal', date: 'JUN 2023' },
        { code: 'JP', name: 'Japan', date: 'JUL 2023' },
        { code: 'QA', name: 'Qatar', date: 'OCT 2023' },
        { code: 'IR', name: 'Iran', date: 'OCT 2023' },
        { code: 'LK', name: 'Sri Lanka', date: 'OCT 2023' },
        { code: 'MV', name: 'Maldives', date: 'OCT 2023' },
        { code: 'MC', name: 'Monaco', date: '2023' },
        { code: 'BR', name: 'Brazil', date: 'NOV 2023' },
        { code: 'AR', name: 'Argentina', date: 'NOV 2023' },
        { code: 'PE', name: 'Peru', date: 'MAY 2024' },
        { code: 'AT', name: 'Austria', date: 'JUN 2024' },
        { code: 'GB', name: 'UK', date: 'JUL 2024' },
        { code: 'UZ', name: 'Uzbekistan', date: 'JUL 2024' },
        { code: 'KZ', name: 'Kazakhstan', date: 'JUL 2024' },
        { code: 'KG', name: 'Kyrgyzstan', date: 'JUL 2024' },
        { code: 'PL', name: 'Poland', date: 'JUL 2024' },
        { code: 'HR', name: 'Croatia', date: 'JUL 2024' },
        { code: 'DK', name: 'Denmark', date: 'FEB 2025' },
        { code: 'IE', name: 'Ireland', date: 'MAR 2025' },
        { code: 'NO', name: 'Norway', date: 'MAR 2025' },
        { code: 'JO', name: 'Jordan', date: 'MAR 2025' },
        { code: 'IN', name: 'India', date: 'APR 2025' },
        { code: 'NP', name: 'Nepal', date: 'MAY 2025' },
        { code: 'HU', name: 'Hungary', date: 'JUN 2025' },
        { code: 'RS', name: 'Serbia', date: 'JUN 2025' },
        { code: 'MK', name: 'North Macedonia', date: 'JUN 2025' },
        { code: 'FJ', name: 'Fiji', date: 'OCT 2025' },
        { code: 'TW', name: 'Taiwan', date: 'NOV 2025' },
        { code: 'XK', name: 'Kosovo', date: '2025' },
        { code: 'BG', name: 'Bulgaria', date: '2025' },
        { code: 'LI', name: 'Liechtenstein', date: '2025' },
        { code: 'MX', name: 'Mexico', date: 'JUN 2026' },
    ];
    // Tiny territories with no path in the low-res map get dot markers (map px coords).
    const DOTS = { HK: [794, 399], MV: [684, 453], MC: [500, 327], LI: [510, 313], SG: [766, 461] };

    const PHOTOS = {
        Peru: [['photos/machu-picchu.webp', 'Machu Picchu'], ['photos/llama.webp', 'A llama in the Andes']],
        Denmark: [['photos/nyhavn.webp', 'Nyhavn canal'], ['photos/nyhavn-bikes.webp', 'Cyclists in Copenhagen']],
        Netherlands: [['photos/tulips.webp', 'Red tulips at Keukenhof']],
        Jordan: [['photos/petra.webp', 'The Treasury, Petra'], ['photos/petra-night.webp', 'Petra by candlelight'], ['photos/camel.webp', 'Camel in Wadi Rum']],
        Canada: [['photos/maligne-lake.webp', 'Maligne Lake boathouse']],
        Taiwan: [['photos/wok-fire.webp', 'Street cook, flaming wok']],
        USA: [['photos/sequoias.webp', 'Giant sequoias']],
    };

    const slot = document.getElementById('world-map');
    const tip = document.getElementById('map-tip');
    const pop = document.getElementById('country-pop');
    const popStamp = document.getElementById('pop-stamp');
    const popPhotos = document.getElementById('pop-photos');
    const popClose = document.getElementById('pop-close');

    function showCountry(name, date) {
        popStamp.innerHTML = '<div class="pop-stamp"><span class="top">ADMITTED</span>'
            + '<span class="country"></span><span class="date"></span></div>';
        popStamp.querySelector('.country').textContent = name.toUpperCase();
        popStamp.querySelector('.date').textContent = date;
        popPhotos.innerHTML = '';
        (PHOTOS[name] || []).forEach(([src, alt]) => {
            const img = new Image();
            img.src = src;
            img.alt = alt;
            popPhotos.appendChild(img);
        });
        pop.hidden = false;
        // Re-trigger the stamp-slam animation on every open.
        pop.classList.remove('slam');
        void pop.offsetWidth;
        pop.classList.add('slam');
        popClose.focus();
    }

    popClose.addEventListener('click', () => { pop.hidden = true; });
    addEventListener('keydown', e => { if (e.key === 'Escape') pop.hidden = true; });

    fetch('world.svg')
        .then(r => r.text())
        .then(text => {
            slot.innerHTML = text.replace(/^﻿?<\?xml[^>]*\?>/, '');
            const svg = slot.querySelector('svg');
            const byCode = Object.fromEntries(VISITED.map(v => [v.code, v]));

            VISITED.forEach(v => {
                const p = svg.getElementById(v.code);
                if (p) {
                    p.classList.add('visited');
                    p.dataset.name = v.name;
                    p.dataset.date = v.date;
                }
            });
            for (const [code, [x, y]] of Object.entries(DOTS)) {
                const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                c.setAttribute('cx', x);
                c.setAttribute('cy', y);
                c.setAttribute('r', 3.5);
                c.classList.add('visited-dot');
                c.dataset.name = byCode[code].name;
                c.dataset.date = byCode[code].date;
                svg.appendChild(c);
            }

            const b = svg.getBBox();
            svg.setAttribute('viewBox', `${b.x} ${b.y} ${b.width} ${b.height}`);
            svg.removeAttribute('width');
            svg.removeAttribute('height');

            svg.addEventListener('pointermove', e => {
                const t = e.target.closest('[data-name]');
                if (!t) { tip.hidden = true; return; }
                tip.hidden = false;
                tip.textContent = `${t.dataset.name} — first visited ${t.dataset.date}`;
                const r = slot.getBoundingClientRect();
                tip.style.left = Math.min(e.clientX - r.left + 14, r.width - tip.offsetWidth - 4) + 'px';
                tip.style.top = (e.clientY - r.top - 34) + 'px';
            });
            svg.addEventListener('pointerleave', () => { tip.hidden = true; });
            svg.addEventListener('click', e => {
                const t = e.target.closest('[data-name]');
                if (t) showCountry(t.dataset.name, t.dataset.date);
            });

            initFlights(svg, b);
        });

    // ---- Animated flight routes + count-up stats ticker ----------------------
    function initFlights(svg, bounds) {
        const FD = window.FLIGHT_DATA;
        if (!FD || !FD.routes || !FD.routes.length) return;

        const NS = 'http://www.w3.org/2000/svg';
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const DURATION = 9000;

        // Miller projection calibrated against the amCharts worldLow SVG:
        // LK path start (704.574, 442.372) = (80.5E, 8.2N),
        // IS path start (434.573, 212.429) = (24.5W, 65.5N).
        const PA = 2.571181, PB = 497.5939;   // x = PA * lon + PB
        const PR = 191.08446, PC = 469.77938; // y = PC - PR * 1.25 * asinh(tan(0.8 * lat))
        const SPAN = PA * 360;                // full 360 degrees of longitude, in px
        const projY = lat => PC - PR * 1.25 * Math.asinh(Math.tan(0.8 * lat * Math.PI / 180));

        // Clip trails/plane to the map so dateline wrap-around stays tidy.
        const clip = document.createElementNS(NS, 'clipPath');
        clip.id = 'flight-clip';
        const rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('x', bounds.x);
        rect.setAttribute('y', bounds.y);
        rect.setAttribute('width', bounds.width);
        rect.setAttribute('height', bounds.height);
        clip.appendChild(rect);
        svg.appendChild(clip);

        const layer = document.createElementNS(NS, 'g');
        layer.id = 'flight-layer';
        layer.setAttribute('clip-path', 'url(#flight-clip)');
        svg.appendChild(layer);

        // Geometry per unique (undirected) route: a quadratic bezier bulging upward.
        const geo = {};
        function routeGeo(from, to) {
            const key = from < to ? from + '-' + to : to + '-' + from;
            if (geo[key]) return geo[key];
            const [a, b2] = key.split('-');
            const [lon1, lat1] = FD.airports[a];
            let [lon2, lat2] = FD.airports[b2];
            // Unwrap across the antimeridian so Pacific hops don't cross the map.
            if (lon2 - lon1 > 180) lon2 -= 360;
            else if (lon1 - lon2 > 180) lon2 += 360;
            const p1 = [PA * lon1 + PB, projY(lat1)];
            const p2 = [PA * lon2 + PB, projY(lat2)];
            const dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
            const lift = Math.min(8 + dist * 0.18, 62);
            const c = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 - lift];
            const wrapped = p2[0] < bounds.x || p2[0] > bounds.x + bounds.width
                || p1[0] < bounds.x || p1[0] > bounds.x + bounds.width;
            return (geo[key] = { key, first: a, p1, c, p2, wrapped, el: null, len: 0 });
        }
        const bez = (g, t) => [
            (1 - t) * (1 - t) * g.p1[0] + 2 * (1 - t) * t * g.c[0] + t * t * g.p2[0],
            (1 - t) * (1 - t) * g.p1[1] + 2 * (1 - t) * t * g.c[1] + t * t * g.p2[1],
        ];
        const bezD = (g, t) => [
            2 * (1 - t) * (g.c[0] - g.p1[0]) + 2 * t * (g.p2[0] - g.c[0]),
            2 * (1 - t) * (g.c[1] - g.p1[1]) + 2 * t * (g.p2[1] - g.c[1]),
        ];

        function trailEl(g) {
            if (g.el) return g.el;
            const d = `M${g.p1[0].toFixed(1)} ${g.p1[1].toFixed(1)} Q${g.c[0].toFixed(1)} ${g.c[1].toFixed(1)} ${g.p2[0].toFixed(1)} ${g.p2[1].toFixed(1)}`;
            const grp = document.createElementNS(NS, 'g');
            grp.setAttribute('class', 'flight-trail');
            const mk = dx => {
                const p = document.createElementNS(NS, 'path');
                p.setAttribute('d', d);
                if (dx) p.setAttribute('transform', `translate(${dx} 0)`);
                grp.appendChild(p);
                return p;
            };
            const main = mk(0);
            if (g.wrapped) mk(g.p2[0] > bounds.x + bounds.width || g.p1[0] > bounds.x + bounds.width ? -SPAN : SPAN);
            layer.appendChild(grp);
            g.el = grp;
            g.len = main.getTotalLength();
            return grp;
        }
        function setTrailProgress(g, t, rev) {
            trailEl(g);
            const off = g.len * (1 - t);
            for (const p of g.el.children) {
                p.style.strokeDasharray = g.len;
                p.style.strokeDashoffset = rev ? -off : off; // reveal from the end the plane departs
            }
        }
        function finishTrail(g) {
            trailEl(g);
            for (const p of g.el.children) {
                p.style.strokeDasharray = '';
                p.style.strokeDashoffset = '';
            }
            g.done = true;
        }

        // Little plane glyph, drawn pointing towards +x.
        const plane = document.createElementNS(NS, 'path');
        plane.setAttribute('class', 'flight-plane');
        plane.setAttribute('d', 'M7 0L1.5 1.2L-3 4.2L-4.4 3.5L-1.2 1L-4.6 0.7L-6.2 2L-7.2 1.6L-5.8 0L-7.2 -1.6L-6.2 -2L-4.6 -0.7L-1.2 -1L-4.4 -3.5L-3 -4.2L1.5 -1.2Z');
        plane.setAttribute('visibility', 'hidden');
        layer.appendChild(plane);

        // Stats ticker.
        const S = FD.stats || {};
        const tickers = [
            [document.getElementById('st-countries'), S.countries, v => Math.round(v)],
            [document.getElementById('st-flights'), S.flights, v => Math.round(v)],
            [document.getElementById('st-km'), S.totalKm, v => Math.round(v).toLocaleString('en-US')],
            [document.getElementById('st-earth'), S.earthCircumnavigations, v => v.toFixed(1) + '×'],
        ].filter(([el, target]) => el && typeof target === 'number');
        const setTickers = p => tickers.forEach(([el, target, fmt]) => { el.textContent = fmt(target * p); });

        const flights = FD.routes.map(([from, to]) => {
            const g = routeGeo(from, to);
            return { g, rev: from !== g.first };
        });

        function showAllStatic() {
            flights.forEach(f => finishTrail(f.g));
            plane.setAttribute('visibility', 'hidden');
            setTickers(1);
        }

        let raf = null;
        function play() {
            if (raf) cancelAnimationFrame(raf);
            Object.values(geo).forEach(g => { if (g.el) { g.el.remove(); g.el = null; g.done = false; } });
            setTickers(0);
            plane.setAttribute('visibility', 'visible');
            const per = DURATION / flights.length;
            let cursor = 0;
            const start = performance.now();
            function frame(now) {
                const t = Math.max(now - start, 0); // first rAF timestamp can precede start
                const i = Math.min(Math.floor(t / per), flights.length - 1);
                while (cursor < i) finishTrail(flights[cursor++].g); // batch-complete skipped flights
                const f = flights[i];
                const frac = Math.min(Math.max(t / per - i, 0), 1);
                const bt = f.rev ? 1 - frac : frac;
                if (!f.g.done) setTrailProgress(f.g, frac, f.rev);
                let [x, y] = bez(f.g, bt);
                const [dx, dy] = bezD(f.g, bt);
                while (x > bounds.x + bounds.width) x -= SPAN;
                while (x < bounds.x) x += SPAN;
                const ang = Math.atan2(f.rev ? -dy : dy, f.rev ? -dx : dx) * 180 / Math.PI;
                plane.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
                setTickers(Math.min(t / DURATION, 1));
                if (t < DURATION) {
                    raf = requestAnimationFrame(frame);
                } else {
                    raf = null;
                    flights.forEach(fl => finishTrail(fl.g));
                    plane.setAttribute('visibility', 'hidden');
                    setTickers(1);
                }
            }
            raf = requestAnimationFrame(frame);
        }

        const replay = document.getElementById('replay-flights');
        if (reduced) {
            showAllStatic();
        } else {
            if (replay) {
                replay.hidden = false;
                replay.addEventListener('click', play);
            }
            play();
        }
    }
})();
