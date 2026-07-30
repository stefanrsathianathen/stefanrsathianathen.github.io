// World map of visited countries, colored from the flight log.
(() => {
    const VISITED = [
        { code: 'AU', name: 'Australia', date: 'JUN 2017' },
        { code: 'NZ', name: 'New Zealand', date: 'JUN 2017' },
        { code: 'US', name: 'USA', date: 'JUN 2017' },
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
        { code: 'BR', name: 'Brazil', date: 'NOV 2023' },
        { code: 'AR', name: 'Argentina', date: 'NOV 2023' },
        { code: 'PE', name: 'Peru', date: 'MAY 2024' },
        { code: 'AT', name: 'Austria', date: 'JUN 2024' },
        { code: 'GB', name: 'UK', date: 'JUL 2024' },
        { code: 'UZ', name: 'Uzbekistan', date: 'JUL 2024' },
        { code: 'KZ', name: 'Kazakhstan', date: 'JUL 2024' },
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
        { code: 'MX', name: 'Mexico', date: 'JUN 2026' },
    ];
    // Tiny territories with no path in the low-res map get dot markers (map px coords).
    const DOTS = { HK: [794, 399], MV: [684, 453] };

    const slot = document.getElementById('world-map');
    const tip = document.getElementById('map-tip');

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
        });
})();
