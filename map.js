// World map of visited countries, colored from the flight log.
(() => {
    const VISITED = [
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
    const DOTS = { HK: [794, 399], MV: [684, 453], MC: [500, 327], LI: [510, 313] };

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
        });
})();
